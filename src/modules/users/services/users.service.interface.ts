import { UserModel, Master } from '@prisma/client';
import { UserLoginDto, UserRegisterDto, UserUpdateDto } from '../index';

export interface IUserService {
	validateUser: (dto: UserLoginDto) => Promise<Master | UserModel | false>;
	removeUser: (id: number) => Promise<{ email: string } | null>;
	changeUser: (id: number, dto: UserUpdateDto) => Promise<UserModel | null>;
	getUserByEmail: (email: string) => Promise<UserModel | null>;
	prepareUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
}
