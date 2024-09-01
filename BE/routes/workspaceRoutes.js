import express from "express";
import {
  createWorkspace,
  getWorkspaces,
  deleteWorkspace,
  addCommandToWorkspace,
} from "../controllers/workspaceController.js";

const workspaceRoutes = express.Router();

workspaceRoutes.post("/workspace", createWorkspace);
workspaceRoutes.get("/workspaces", getWorkspaces);
workspaceRoutes.delete("/workspaces/:workspaceId", deleteWorkspace);
workspaceRoutes.post("/workspace/command", addCommandToWorkspace);

export default workspaceRoutes;
