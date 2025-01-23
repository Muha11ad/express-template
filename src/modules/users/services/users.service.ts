import { User } from '@/database';
import { sign } from 'jsonwebtoken';
import { HTTPError } from '@/errors';
import { TYPES } from '../../../types';
import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../../config';
import { USER_HTTP_MESSAGES } from '../user.consts';
import { IUserService } from './users.service.interface';
import { IUsersRepository, UserCreateDto, UserLoginDto, UserUpdateDto } from '../index';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
	) {}
	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}

	public async findAllUsers(): Promise<User[]> {
		try {
			return await this.usersRepository.findAll();
		} catch (error) {
			throw new HTTPError(500, USER_HTTP_MESSAGES.error_fetching);
		}
	}

	public async findUserById(id: number): Promise<User | null> {
		try {
			return await this.usersRepository.findById(id);
		} catch (error) {
			throw new HTTPError(500, USER_HTTP_MESSAGES.error_fetching_id);
		}
	}

	public async validateUser(data: UserLoginDto): Promise<string> {
		const user = await this.usersRepository.findByEmail(data.email);
		if (!user) {
			throw new HTTPError(404, USER_HTTP_MESSAGES.invalid_email);
		}

		const isPasswordValid = await compare(data.password, user.password);
		if (!isPasswordValid) {
			throw new HTTPError(401, USER_HTTP_MESSAGES.invalid_password);
		}
		return await this.signJWT(user.email, this.configService.get('SECRET'));
	}

	public async deleteUser(id: number): Promise<string> {
		try {
			return await this.usersRepository.delete(id);
		} catch (error) {
			throw new HTTPError(500, USER_HTTP_MESSAGES.error_deleting);
		}
	}

	public async createUser(data: UserCreateDto): Promise<string> {
		const user = await this.usersRepository.findByEmail(data.email);
		if (user) {
			throw new HTTPError(400, USER_HTTP_MESSAGES.email_exists);
		}
		try {
			const hashedPassword = await hash(data.password, this.configService.get('SALT'));
			const user = { ...data, password: hashedPassword };
			await this.usersRepository.create(user);
			return await this.signJWT(data.email, this.configService.get('SECRET'));
		} catch (error) {
			throw new HTTPError(500, USER_HTTP_MESSAGES.error_creating);
		}
	}

	public async updateUser(id: number, user: UserUpdateDto): Promise<string> {
		if (user['email']) {
			const emailExists = await this.usersRepository.findByEmail(user['email']);
			if (emailExists) {
				throw new HTTPError(400, USER_HTTP_MESSAGES.email_exists);
			}
		}
		try {
			return await this.usersRepository.update(id, user);
		} catch (error) {
			throw new HTTPError(500, USER_HTTP_MESSAGES.error_updating);
		}
	}
}
