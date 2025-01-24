import 'reflect-metadata';
import { TYPES } from '@/types';
import { ILogger } from '@/logger';
import { HTTPError } from '@/errors';
import { ConfigService } from '@/config';
import { injectable, inject } from 'inversify';
import { UserLoginDto } from '../dto/user-login.dto';
import { NextFunction, Request, Response } from 'express';
import { BaseController, ValidateMiddleware } from '@/common';
import { IUserController } from './users.controller.interface';
import { USER_ENDPOINTS, USER_HTTP_MESSAGES } from '../user.consts';
import { IUserService, UserCreateDto, UserUpdateDto } from '../index';

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
				path: USER_ENDPOINTS.login,
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},

			{
				path: USER_ENDPOINTS.delete,
				method: 'delete',
				func: this.delete,
			},

			{
				path: USER_ENDPOINTS.create,
				method: 'post',
				func: this.create,
				middlewares: [new ValidateMiddleware(UserCreateDto)],
			},

			{
				path: USER_ENDPOINTS.getAll,
				method: 'get',
				func: this.getAll,
			},
			{
				path: USER_ENDPOINTS.update,
				method: 'put',
				func: this.update,
				middlewares: [new ValidateMiddleware(UserUpdateDto)],
			},
		]);
	}
	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const token = await this.userService.validateUser(req.body);
			this.ok(res, token);
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = req.params.id;
			await this.userService.deleteUser(Number(id));
			this.ok(res, USER_HTTP_MESSAGES.success_deleted);
		} catch (error) {
			next(error);
		}
	}

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user = await this.userService.createUser(req.body);
			this.ok(res, user);
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = req.params.id;
			const user = await this.userService.updateUser(Number(id), req.body);
			this.ok(res, user);
		} catch (error) {
			next(error);
		}
	}
	
	async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const users = await this.userService.findAllUsers();
			this.ok(res, users);
		} catch (error) {
			next(error);
		}
	}
}
