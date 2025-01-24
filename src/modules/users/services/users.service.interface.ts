import { User } from '@/database';
import { UserCreateDto, UserLoginDto, UserUpdateDto } from '../index';

export interface IUserService {
	findAllUsers: () => Promise<User[]>;

	deleteUser: (id: number) => Promise<string>;

	createUser: (data: UserCreateDto) => Promise<string>;

	validateUser: (data: UserLoginDto) => Promise<string>;

	updateUser: (id: number, user: UserUpdateDto) => Promise<string>;
}
