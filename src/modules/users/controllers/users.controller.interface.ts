import { NextFunction, Request, Response } from 'express';

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => void;
	deleteUser: (req: Request, res: Response, next: NextFunction) => void;
	createUser: (req: Request, res: Response, next: NextFunction) => void;
	updateUser: (req: Request, res: Response, next: NextFunction) => void;
}
