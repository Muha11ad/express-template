import { verify } from 'jsonwebtoken';
import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(request: Request, response: Response, next: NextFunction): void {
		try {
			const token = request.headers['token'] || request.cookies?.token;
			if (token) {
				verify(token, this.secret, (error: any, payload: any) => {
					if (error) {
						response.status(401).json({ message: 'Invalid token' });
						return;
					} else if (payload) {
						if (typeof payload !== 'string' && payload.email) {
							request.user = payload.email;
							next();
						} else {
							response.status(401).json({ message: 'Invalid token payload' });
						}
					}
				});
			} else {
				response.status(401).json({ message: 'Token missing' });
			}
		} catch (error) {
			response.status(500).json({ message: 'Server error' });
		}
	}
}
