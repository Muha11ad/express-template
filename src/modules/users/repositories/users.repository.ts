import { TYPES } from '../../../types';
import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { IUsersRepository } from './users.repository.interface';
import { PrismaService } from '../../../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({
		email,
		password,
		name,
		lastName,
		role,
	}: Omit<UserModel, 'id'>): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				name,
				lastName,
				password,
				role,
			},
		});
	}

	async deleteById(id: number): Promise<UserModel | null> {
		const user = await this.prismaService.client.userModel.findFirst({
			where: { id },
		});

		if (!user) {
			return null;
		}
		return this.prismaService.client.userModel.delete({
			where: { id },
		});
	}

	async findByEmail(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findUnique({
			where: { email },
		});
	}

	async findById(id: number): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: { id },
		});
	}

	async updateById(id: number, user: Partial<UserModel>): Promise<UserModel | null> {
		return this.prismaService.client.userModel.update({
			where: { id },
			data: {
				...(user.name && { name: user.name }),
				...(user.lastName && { lastName: user.lastName }),
				...(user.email && { email: user.email }),
				...(user.password && { password: user.password }),
				...(user.role && { role: user.role }),
			},
		});
	}
}
