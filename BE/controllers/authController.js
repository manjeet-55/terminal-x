import { registerUser, loginUser } from "../services/authService.js";
import responseGenerators from "../utils/helper.js";
import { StatusCodes } from "http-status-codes";

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await registerUser(email, password);
    res
      .status(StatusCodes.CREATED)
      .json(
        responseGenerators(
          result,
          StatusCodes.CREATED,
          "User registered successfully",
          1
        )
      );
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    res
      .status(StatusCodes.OK)
      .json(responseGenerators(result, StatusCodes.OK, "Login successful", 1));
  } catch (err) {
    next(err);
  }
};
