/**
 * Custom Operational API Error Class
 * Enables fine-grained status codes, error codes, and centralized response generation
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null, code = 'ERROR', isOperational = true, stack = '') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.details = details;
    this.code = code;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', details = null, code = 'BAD_REQUEST') {
    return new ApiError(400, message, details, code);
  }

  static unauthorized(message = 'Unauthorized Access', details = null, code = 'UNAUTHORIZED') {
    return new ApiError(401, message, details, code);
  }

  static forbidden(message = 'Forbidden Resource', details = null, code = 'FORBIDDEN') {
    return new ApiError(403, message, details, code);
  }

  static notFound(message = 'Resource Not Found', details = null, code = 'NOT_FOUND') {
    return new ApiError(404, message, details, code);
  }

  static conflict(message = 'Resource Conflict', details = null, code = 'CONFLICT') {
    return new ApiError(409, message, details, code);
  }

  static unprocessableEntity(message = 'Unprocessable Entity', details = null, code = 'UNPROCESSABLE_ENTITY') {
    return new ApiError(422, message, details, code);
  }

  static internal(message = 'Internal Server Error', details = null, code = 'INTERNAL_ERROR') {
    return new ApiError(500, message, details, code, false);
  }
}

export default ApiError;
