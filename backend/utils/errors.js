const util = require('util')

class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

class ValidationError extends AppError {
	constructor(message) {
		super(message, 400);
		this.name = 'ValidationError';
		this.message = message;
	}
}

class UnauthorizedError extends AppError {
	constructor(message) {
		super(message, 401);
		this.name = 'UnauthorizedError';
		this.message = message;
	}
}

class NotFoundError extends AppError {
	constructor(message) {
		super(message, 404);
		this.name = 'NotFoundError';
		this.message = message;
	}
}

class BadRequestError extends AppError {
	constructor(message) {
		super(message, 400);
		this.name = 'BadRequestError';
		this.message = message;
	}
}

class DuplicateError extends AppError {
	constructor(field) {
		super(`A user with this ${field} already exists. Please use a different ${field}.`, 409);
		this.name = 'DuplicateError';
		this.field = field;
	}
}

class NotImplementedError extends AppError {
	constructor(message) {
		super(message, 501);
		this.name = 'NotImplementedError';
		this.message = message;
	}
}

module.exports = {
	AppError,
	ValidationError,
	UnauthorizedError,
	NotFoundError,
	BadRequestError,
	DuplicateError,
	NotImplementedError
};
