import { User } from '@/database';
import { TYPES } from '@/types';
import { sign } from 'jsonwebtoken';
import { HTTPError } from '@/errors';
import { ConfigService } from '@/config';
import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { USER_HTTP_MESSAGES } from '../user.consts';
import { IUserService } from './users.service.interface';
import { IUsersRepository, UserCreateDto, UserLoginDto, UserUpdateDto } from '../index';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
	) {}

	private async signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
	private async findUserById(id: number): Promise<User | null> {
		const user = await this.usersRepository.findById(id);
		if (!user) {
			throw new HTTPError(404, USER_HTTP_MESSAGES.not_found);
		}
		return user;
	}
	private async findUserByEmail(email: string): Promise<User> {
		const user = await this.usersRepository.findByEmail(email);
		if (!user) {
			throw new HTTPError(404, USER_HTTP_MESSAGES.not_found_email);
		}
		return user;
	}

	public async findAllUsers(): Promise<User[]> {
		try {
			return await this.usersRepository.findAll();
		} catch (error) {
			throw new Error(USER_HTTP_MESSAGES.error_fetching);
		}
	}

	public async validateUser(data: UserLoginDto): Promise<string> {
		const user = await this.findUserByEmail(data.email);
		const isPasswordValid = await compare(data.password, user?.password);
		if (!isPasswordValid) {
			throw new HTTPError(401, USER_HTTP_MESSAGES.invalid_password);
		}
		try {
			return await this.signJWT(user.email, this.configService.get('SECRET'));
		} catch (error) {
			throw new Error(USER_HTTP_MESSAGES.error_validating);
		}
	}

	public async deleteUser(id: number): Promise<string> {
		await this.findUserById(id);
		try {
			return await this.usersRepository.delete(id);
		} catch (error) {
			throw new Error(USER_HTTP_MESSAGES.error_deleting);
		}
	}

	public async createUser(data: UserCreateDto): Promise<string> {
		try {
			const existingUser = await this.usersRepository.findByEmail(data.email);
			if (existingUser) {
				throw new HTTPError(400, USER_HTTP_MESSAGES.email_exists);
			}

			const hashedPassword = await hash(data.password, 10);
			const newUser = { ...data, password: hashedPassword };
			await this.usersRepository.create(newUser);
			return await this.signJWT(data.email, this.configService.get('SECRET'));
		} catch (error) {
			throw new Error(USER_HTTP_MESSAGES.error_creating);
		}
	}

	public async updateUser(id: number, user: UserUpdateDto): Promise<string> {
		await this.findUserById(id);
		await this.findUserByEmail(user.email);
		try {
			return await this.usersRepository.update(id, user);
		} catch (error) {
			throw new Error(USER_HTTP_MESSAGES.error_updating);
		}
	}
}
