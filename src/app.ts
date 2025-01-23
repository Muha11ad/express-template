import 'reflect-metadata';
import cors from 'cors';
import { Server } from 'http';
import { TYPES } from './types';
import { json } from 'body-parser';
import { ILogger } from './logger';
import cookieParser from 'cookie-parser';
import { IExeptionFilter } from './errors';
import express, { Express, urlencoded } from 'express';
import { TypeOrmService } from './database';
import { inject, injectable } from 'inversify';
import { UserController } from './modules/users';
import { getCorsOptions, IConfigService } from './config';

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
		this.app.use(json());
		this.app.use(cookieParser());
		this.app.use(urlencoded()); // Add this line
		this.app.use(cors(getCorsOptions()));
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
