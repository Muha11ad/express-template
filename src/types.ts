export const TYPES = {
	ILogger: Symbol.for('ILogger'),
	Application: Symbol.for('Application'),
	ConfigService: Symbol.for('ConfigService'),
	ExeptionFilter: Symbol.for('ExeptionFilter'),
	TypeOrmService: Symbol.for('TypeOrmService'),

	//User
	UserModel: Symbol.for('UserModel'),
	UserService: Symbol.for('UserService'),
	UserRepository: Symbol.for('UserRepository'),
	UserController: Symbol.for('UserController'),
};
