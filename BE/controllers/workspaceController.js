import {
  createWorkspace as createWorkspaceService,
  getWorkspaces as getWorkspacesService,
  deleteWorkspace as deleteWorkspaceService,
  addCommandToWorkspace as addCommandToWorkspaceService,
} from "../services/workspaceService.js";
import responseGenerators from "../utils/helper.js";
import { StatusCodes } from "http-status-codes";

export const createWorkspace = async (req, res, next) => {
  const { name, commands } = req.body;
  const userId = req.user.id;

  try {
    const workspace = await createWorkspaceService(userId, name, commands);
    res
      .status(StatusCodes.CREATED)
      .json(
        responseGenerators(
          workspace,
          StatusCodes.CREATED,
          "Workspace created successfully",
          1
        )
      );
  } catch (err) {
    next(err);
  }
};

export const getWorkspaces = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const workspaces = await getWorkspacesService(userId);
    res
      .status(StatusCodes.OK)
      .json(
        responseGenerators(
          workspaces,
          StatusCodes.OK,
          "Workspaces retrieved successfully",
          1
        )
      );
  } catch (err) {
    next(err);
  }
};

export const deleteWorkspace = async (req, res, next) => {
  const { workspaceId } = req.params;
  const userId = req.user.id;

  try {
    const result = await deleteWorkspaceService(userId, workspaceId);
    res
      .status(StatusCodes.OK)
      .json(responseGenerators({}, StatusCodes.OK, result.message, 1));
  } catch (err) {
    next(err);
  }
};

export const addCommandToWorkspace = async (req, res, next) => {
  const { workspaceId, command } = req.body;
  const userId = req.user.id;

  try {
    const workspace = await addCommandToWorkspaceService(
      userId,
      workspaceId,
      command
    );
    res
      .status(StatusCodes.OK)
      .json(
        responseGenerators(
          workspace,
          StatusCodes.OK,
          "Command added successfully",
          1
        )
      );
  } catch (err) {
    next(err);
  }
};
