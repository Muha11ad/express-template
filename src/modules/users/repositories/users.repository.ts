import { TYPES } from '../../../types';
import { inject, injectable } from 'inversify';
import { TypeOrmService, User } from '@/database';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.TypeOrmService) private typeOrmService: TypeOrmService) {}

	async create({ email, password, name }: Omit<User, 'id'>): Promise<void> {}

	async deleteById(id: number): Promise<void> {}

	async findByEmail(email: string): Promise<void> {}

	async findById(id: number): Promise<void> {}

	async updateById(id: number, user: Partial<User>): Promise<void> {}
}
