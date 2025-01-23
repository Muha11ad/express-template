import { TYPES } from '@/types';
import { ILogger } from '@/logger';
import { HTTPError } from '@/errors';
import { inject, injectable } from 'inversify';
import { TypeOrmService, User } from '@/database';
import { UserCreateDto, UserUpdateDto } from '../dto';
import { IUsersRepository } from './users.repository.interface';
import { USER_HTTP_MESSAGES, USER_REPOSITORY } from '../consts';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.TypeOrmService) private typeOrmService: TypeOrmService,
	) {}

	public async findByEmail(email: string): Promise<User | null> {
		try {
			return await this.typeOrmService.client.getRepository(User).findOne({ where: { email } });
		} catch (error) {
			this.handleError(error, 'findByEmail');
			return null;
		}
	}

	public async findById(id: number): Promise<User | null> {
		try {
			return await this.typeOrmService.client.getRepository(User).findOne({ where: { id } });
		} catch (error) {
			this.handleError(error, 'findById');
			return null;
		}
	}

	public async findAll(): Promise<User[]> {
		try {
			return await this.typeOrmService.client.getRepository(User).find();
		} catch (error) {
			this.handleError(error, 'findAll');
			return [];
		}
	}

	public async create(data: UserCreateDto): Promise<User> {
		try {
			const user = await this.typeOrmService.client.getRepository(User).save(data);
			return user;
		} catch (error) {
			this.handleError(error, 'create');
			throw new HTTPError(500, USER_HTTP_MESSAGES.error_creating);
		}
	}

	public async update(id: number, user: UserUpdateDto): Promise<string> {
		try {
			await this.typeOrmService.client.getRepository(User).update({ id }, user);
			return USER_REPOSITORY.updated;
		} catch (error) {
			this.handleError(error, 'update');
			throw new HTTPError(500, USER_HTTP_MESSAGES.error_updating);
		}
	}

	public async delete(id: number): Promise<string> {
		try {
			await this.typeOrmService.client.getRepository(User).delete({ id });
			return USER_REPOSITORY.deleted;
		} catch (error) {
			this.handleError(error, 'delete');
			throw new HTTPError(500, USER_HTTP_MESSAGES.error_deleting);
		}
	}

	private handleError(error: unknown, methodName: string): void {
		if (error instanceof Error) {
			this.logger.error(`Error in ${methodName}: ${error.message}`);
		} else {
			this.logger.error(`Unknown error in ${methodName}`);
		}
	}
}
