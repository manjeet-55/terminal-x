import Workspace from "../models/workspace.js";
import CustomError from "../utils/error.js";
import { StatusCodes } from "http-status-codes";

export const createWorkspace = async (userId, name, commands) => {
  try {
    const newWorkspace = new Workspace({ userId, name, commands });
    await newWorkspace.save();
    return newWorkspace;
  } catch (err) {
    throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getWorkspaces = async (userId) => {
  try {
    const workspaces = await Workspace.find({ userId });
    return workspaces;
  } catch (err) {
    throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteWorkspace = async (userId, workspaceId) => {
  try {
    const workspace = await Workspace.findOneAndDelete({
      _id: workspaceId,
      userId,
    });

    if (!workspace) {
      throw new CustomError("Workspace not found", StatusCodes.NOT_FOUND);
    }

    return { message: "Workspace deleted successfully" };
  } catch (err) {
    throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const addCommandToWorkspace = async (userId, workspaceId, command) => {
  try {
    const workspace = await Workspace.findOne({ _id: workspaceId, userId });

    if (!workspace) {
      throw new CustomError("Workspace not found", StatusCodes.NOT_FOUND);
    }

    workspace.commands.push(command);
    await workspace.save();

    return workspace;
  } catch (err) {
    throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
