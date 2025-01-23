import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UserCreateDto {
	@IsNotEmpty({ message: 'Email обязателень' })
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	@MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	@IsNotEmpty({ message: 'Имя обязательно' })
	name: string;
}
