import { UserModel } from '@prisma/client';

export interface IUsersRepository {
	create: (user: Omit<UserModel, 'id'>) => Promise<UserModel>;

	deleteById: (id: number) => Promise<UserModel | null>;

	findByEmail: (email: string) => Promise<UserModel | null>;

	findById: (id: number) => Promise<UserModel | null>;

	updateById: (id: number, user: Partial<UserModel>) => Promise<UserModel | null>;
}
