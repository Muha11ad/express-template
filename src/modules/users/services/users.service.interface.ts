import { User } from '@/database';
import { UserCreateDto, UserLoginDto, UserUpdateDto } from '../index';

export interface IUserService {
	findAllUsers: () => Promise<User[]>;
	findUserById: (id: number) => Promise<User | null>;

	validateUser: (data: UserLoginDto) => Promise<string>;

	deleteUser: (id: number) => Promise<string>;
	createUser: (data: UserCreateDto) => Promise<string>;
	updateUser: (id: number, user: UserUpdateDto) => Promise<string>;
}
