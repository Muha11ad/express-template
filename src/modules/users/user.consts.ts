export const USER_REPOSITORY = {
	updated: 'User updated',
	deleted: 'User deleted',
};

export const USER_HTTP_MESSAGES = {
	not_found: 'User not found',
	not_found_email: 'Email not found',
	invalid_password: 'Invalid password',
	email_exists: 'Email already exists',
	error_creating: 'Failed to create user',
	error_updating: 'Failed to update user',
	error_deleting: 'Failed to delete user',
	error_fetching: 'Failed to fetch users',
	error_validating: 'Failed to validate user',
	success_deleted: 'User deleted successfully',
	success_updated: 'User updated successfully',
	error_email_exists: 'Email already exists',
};

export const USER_ENDPOINTS = {
	getAll: '/',
	create: '/',
	login: '/login',
	delete: '/:id',
	update: '/:id',
};
