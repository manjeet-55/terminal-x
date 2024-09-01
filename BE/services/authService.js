import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import CustomError from "../utils/error.js";
import { StatusCodes } from "http-status-codes";

export const registerUser = async (email, password) => {
  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    return { email: newUser.email };
  } catch (err) {
    throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 86400,
      });
      return { token, email: user.email };
    } else {
      throw new CustomError(
        "Invalid email or password",
        StatusCodes.UNAUTHORIZED
      );
    }
  } catch (err) {
    throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
