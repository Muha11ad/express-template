import 'reflect-metadata';
import { TYPES } from '../types';
import { DataSource } from 'typeorm';
import { User } from './model/user.model';
import { IConfigService } from '../config';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { Transaction } from './model/transaction.model';

@injectable()
export class TypeOrmService {
	client: DataSource;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ConfigService) private config: IConfigService,
	) {
		this.client = new DataSource({
			type: 'postgres',
			url: this.config.get('DATABASE_URL'),
			entities: [User, Transaction],
			migrations: ['src/database/migrations/*.ts'],
			synchronize: true,
		});
	}

	async connect(): Promise<void> {
		try {
			await this.client.initialize();
			this.logger.log('[TypeOrmService] Successfully connected to the database');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[TypeOrmService] Database connection error: ' + e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.destroy();
	}
}
