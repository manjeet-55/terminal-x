import { StatusCodes } from "http-status-codes";
import responseGenerators from "../utils/helper.js";
import CustomError from "../utils/error.js";
import pkg from 'jsonwebtoken';
import Joi from 'joi';

const { ValidationError } = Joi;

const { TokenExpiredError } = pkg;
const ERROR = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};

const errorMiddleware = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(responseGenerators({}, StatusCodes.BAD_REQUEST, error.message, 1));
  }

  if (error instanceof CustomError) {
    return res
      .status(error.statusCode)
      .send(responseGenerators({}, error.statusCode, error.message, 1));
  }

  if (error instanceof TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(
        responseGenerators({}, StatusCodes.UNAUTHORIZED, "Token is expired", 1)
      );
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(
      responseGenerators(
        {},
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || ERROR.INTERNAL_SERVER_ERROR,
        1
      )
    );
};

export default errorMiddleware;
