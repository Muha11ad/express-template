import { User } from '@/database';
import { UserCreateDto, UserUpdateDto } from '../dto';

export interface IUsersRepository {
	findAll: () => Promise<User[]>;
	findById: (id: number) => Promise<User | null>;
	findByEmail: (email: string) => Promise<User | null>;

	delete: (id: number) => Promise<string>;
	create: (data: UserCreateDto) => Promise<User>;
	update: (id: number, user: UserUpdateDto) => Promise<string>;
}
