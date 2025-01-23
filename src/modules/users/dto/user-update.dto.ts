import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UserUpdateDto {
	@IsOptional()
	@IsEmail()
	email: string;

	@IsString()
	@IsOptional()
	@MinLength(6)
	password: string;

	@IsOptional()
	@IsString()
	name: string;
}
