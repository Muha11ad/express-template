import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UserCreateDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(6)
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;
}
