import { CorsOptions } from 'cors';

export function getCorsOptions(): CorsOptions {
	const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
	return {
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		origin: (origin, callback) => {
			if (!origin) {
				callback(null, false);
			} else if (allowedOrigins.includes(origin)) {
				callback(null, origin);
			} else {
				callback(new Error(`Origin ${origin} is not allowed`));
			}
		},
	};
}
