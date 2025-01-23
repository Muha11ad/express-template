import { compare, hash } from 'bcryptjs';

export class User {
	private _password: string;

	constructor(
		private readonly _email: string,
		private readonly _name: string,
		private readonly _lastName: string,
		private readonly _role: string,
		passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash || '';
		}
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get lastName(): string {
		return this._lastName;
	}

	get role(): string {
		return this._role;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		if (!this._password) {
			throw new Error('Password not set for user');
		}
		return await compare(pass, this._password);
	}
}
