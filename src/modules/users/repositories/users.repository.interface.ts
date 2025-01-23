import { User } from '@/database';

export interface IUsersRepository {
	create: (user: Omit<User, 'id'>) => Promise<void>;

	deleteById: (id: number) => Promise<void>;

	findByEmail: (email: string) => Promise<void>;

	findById: (id: number) => Promise<void>;

	updateById: (id: number, user: Partial<User>) => Promise<void>;
}
