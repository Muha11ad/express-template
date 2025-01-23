import { IsEmail, IsString, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class UserRegisterDto {
	@IsNotEmpty({ message: 'Email обязателень' })
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	@MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	@IsNotEmpty({ message: 'Имя обязательно' })
	name: string;

	@IsString({ message: 'Не указано фамилия' })
	@IsNotEmpty({ message: 'Фамилия обязательно' })
	lastName: string;

	@IsString({ message: 'Не указано роль' })
	@IsIn(['admin', 'director', 'teamLead', 'teacher', 'master'], { message: 'Недопустимая роль' })
	role: string;
}
