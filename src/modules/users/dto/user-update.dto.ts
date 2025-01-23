import { IsEmail, IsString } from 'class-validator';

export class UserUpdateDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	name: string;

	@IsString({ message: 'Не указано фамилия' })
	lastName: string;

	@IsString({ message: 'Не указано роль' })
	role: string;
}
