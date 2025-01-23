import 'reflect-metadata';
import cors from 'cors';
import { Server } from 'http';
import { TYPES } from './types';
import { json } from 'body-parser';
import { ILogger } from './logger';
import cookieParser from 'cookie-parser';
import { IConfigService } from './config';
import { IExeptionFilter } from './errors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { UserController } from './modules/users';
import { TypeOrmService } from './database/TypeOrmService';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number | string;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.TypeOrmService) private typeOrmService: TypeOrmService,
	) {
		this.app = express();
		this.port = this.configService.get('PORT') || 9000;
	}

	useMiddleware(): void {
		this.app.use(
			cors({
				origin: ['http://localhost:5173'],
				methods: ['GET', 'POST', 'PUT', 'DELETE'],
				credentials: true,
			}),
		);
		this.app.use(json({ limit: '300mb' }));
		this.app.use(cookieParser());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.typeOrmService.connect();
		this.useRoutes();
		this.useMiddleware();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
