import { compare } from 'bcryptjs';
import { TYPES } from '../../../types';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../../config';
import { IUsersRepository, User } from '../index';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
	) {}
}
