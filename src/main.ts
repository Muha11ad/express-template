import { App } from './app';
import { TYPES } from './types';
import { TypeOrmService } from './database';
import { LoggerService, ILogger } from './logger';
import { ConfigService, IConfigService } from './config';
import { ExeptionFilter, IExeptionFilter } from './errors';
import { Container, ContainerModule, interfaces } from 'inversify';
import { IUserService, UserService } from './modules/users/services';
import { IUserController, UserController } from './modules/users/controllers';
import { IUsersRepository, UsersRepository } from './modules/users/repositories';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<TypeOrmService>(TYPES.TypeOrmService).to(TypeOrmService).inSingletonScope();

	bind<IUsersRepository>(TYPES.UserRepository).to(UsersRepository);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);

	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
