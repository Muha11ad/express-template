import { TYPES } from '@/types';
import { inject, injectable } from 'inversify';
import { USER_REPOSITORY } from '../user.consts';
import { TypeOrmService, User } from '@/database';
import { UserCreateDto, UserUpdateDto } from '../dto';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.TypeOrmService) private typeOrmService: TypeOrmService) {}

	public async findByEmail(email: string): Promise<User | null> {
		return await this.typeOrmService.client.getRepository(User).findOne({ where: { email } });
	}

	public async findById(id: number): Promise<User | null> {
		return await this.typeOrmService.client.getRepository(User).findOne({ where: { id } });
	}

	public async findAll(): Promise<User[]> {
		return await this.typeOrmService.client.getRepository(User).find();
	}

	public async create(data: UserCreateDto): Promise<User> {
		const user = await this.typeOrmService.client.getRepository(User).save(data);
		return user;
	}

	public async update(id: number, user: UserUpdateDto): Promise<string> {
		await this.typeOrmService.client.getRepository(User).update({ id }, user);
		return USER_REPOSITORY.updated;
	}

	public async delete(id: number): Promise<string> {
		await this.typeOrmService.client.getRepository(User).delete({ id });
		return USER_REPOSITORY.deleted;
	}
}
