import 'reflect-metadata';
import { TYPES } from '@/types';
import { sign } from 'jsonwebtoken';
import { ILogger } from '@/logger';
import { IUserService } from '../index';
import { ConfigService } from '@/config';
import { injectable, inject } from 'inversify';
import { UserLoginDto } from '../dto/user-login.dto';
import { NextFunction, Request, Response } from 'express';
import { IUserController } from './users.controller.interface';
import { AuthMiddleware, BaseController, ValidateMiddleware } from '@/common';

@injectable()
export class UserController extends BaseController implements IUserController {
	private readonly secret4Token: string;
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: ConfigService,
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
				middlewares: [new AuthMiddleware(this.secret4Token)],
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
				middlewares: [new AuthMiddleware(this.secret4Token)],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {}

	async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {}

	async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {}

	async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {}

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
