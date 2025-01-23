import 'reflect-metadata';
import { sign } from 'jsonwebtoken';
import { TYPES } from '../../../types';
import { IUserService } from '../index';
import { ROLES } from './../../../types';
import { ILogger } from '../../../logger';
import { HTTPError } from '../../../errors';
import { injectable, inject } from 'inversify';
import { IConfigService } from '../../../config';
import { UserLoginDto } from '../dto/user-login.dto';
import { NextFunction, Request, Response } from 'express';
import { IUserController } from './users.controller.interface';
import { PrismaClient, Master, UserModel } from '@prisma/client';
import { AuthMiddleware, BaseController, ValidateMiddleware, VerifyRole } from '../../../common';

@injectable()
export class UserController extends BaseController implements IUserController {
	private readonly secret4Token: string;
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.secret4Token = this.configService.get('SECRET');
		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},

			{
				path: '/delete/:id',
				method: 'delete',
				func: this.deleteUser,
				middlewares: [
					new AuthMiddleware(this.secret4Token),
					new VerifyRole(new PrismaClient(), [ROLES.admin]),
				],
			},

			{
				path: '/create',
				method: 'post',
				func: this.createUser,
			},

			{
				path: '/update/:id',
				method: 'put',
				func: this.updateUser,
				middlewares: [
					new AuthMiddleware(this.secret4Token),
					new VerifyRole(new PrismaClient(), [ROLES.admin]),
				],
			},
			{
				path: '/logout',
				method: 'post',
				func: this.logoutUser,
				middlewares: [new AuthMiddleware(this.secret4Token)],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result: UserModel | Master | false = await this.userService.validateUser(req.body);
		if (result === false) {
			this.send(res, 404, 'Lo`gin yo`ki paro`l xato', false);
			return;
		}
		const jwt = await this.signJWT(result.email, this.configService.get('SECRET'));
		res.cookie('token', jwt);
		if ('role' in result) {
			switch (result.role) {
				case ROLES.admin:
					this.ok(res, { jwt, redirectTo: 'admin', result });
					break;
				case ROLES.director:
					this.ok(res, { jwt, redirectTo: 'admin', result });
					break;
				case ROLES.teamLead:
					this.ok(res, { jwt, redirectTo: 'admin', result });
					break;
				case ROLES.teacher:
					this.ok(res, { jwt, redirectTo: 'admin', result });
					break;
				default:
					this.ok(res, { jwt, redirectTo: 'master', result });
					break;
			}
		} else {
			this.ok(res, { jwt, redirectTo: 'master', result });
		}
	}

	async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const result = await this.userService.removeUser(id);
		if (!result) {
			return next(new HTTPError(404, 'Такого пользователя нету', 'delete'));
		}
		this.ok(res, { result });
	}

	async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.prepareUser(req.body);
		if (!result) {
			return next(new HTTPError(400, 'Пж проверьте данные', 'create'));
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
		res.cookie('token', jwt);
		this.ok(res, { result, jwt });
	}

	async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);

		const result = await this.userService.changeUser(id, req.body);
		if (!result) {
			return next(new HTTPError(400, 'Пж проверьте данные', 'update'));
		}
		this.ok(res, { result });
	}

	async logoutUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		res.clearCookie('token');
		this.ok(res, 'User logged out successfuly');
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
