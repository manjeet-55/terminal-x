import { StatusCodes } from 'http-status-codes';

class CustomError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
  }
}

export default CustomError;
