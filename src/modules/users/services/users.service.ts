import { compare } from 'bcryptjs';
import { TYPES } from '../../../types';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../../config';
import { IUsersRepository, User } from '../index';
import { Master, UserModel } from '.prisma/client';
import { UserLoginDto } from '../dto/user-login.dto';
import { IMasterRepository } from './../../masters';
import { IUserService } from './users.service.interface';
import { UserUpdateDto } from './../dto/user-update.dto';
import { UserRegisterDto } from '../dto/user-register.dto';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.MasterRepository) private masterRepository: IMasterRepository,
	) {}

	async validateUser({ email, password }: UserLoginDto): Promise<Master | UserModel | false> {
		const existedUser = await this.usersRepository.findByEmail(email);
		const existedMaster = await this.masterRepository.findByEmail(email);

		if (existedUser && existedUser.password) {
			const isValid = await compare(password, existedUser.password);
			if (isValid) return existedUser;
		}

		if (existedMaster && existedMaster.password) {
			const isValid = await compare(password, existedMaster.password);
			if (isValid) return existedMaster;
		}

		return false;
	}

	async removeUser(id: number): Promise<UserModel | null> {
		return await this.usersRepository.deleteById(id);
	}

	async changeUser(id: number, data: UserUpdateDto): Promise<UserModel | null> {
		return await this.usersRepository.updateById(id, data);
	}

	async getUserByEmail(email: string): Promise<UserModel | null> {
		return await this.usersRepository.findByEmail(email);
	}

	async prepareUser({
		email,
		name,
		password,
		lastName,
		role,
	}: UserRegisterDto): Promise<UserModel | null> {
		const existedUser = await this.usersRepository.findByEmail(email);
		if (existedUser) {
			return null;
		}
		const newUser = new User(email, name, lastName, role);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		return this.usersRepository.create(newUser);
	}
}
