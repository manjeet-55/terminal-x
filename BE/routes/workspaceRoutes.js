import express from "express";
import {
  createWorkspace,
  getWorkspaces,
  deleteWorkspace,
  addCommandToWorkspace,
} from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/workspace", createWorkspace);
router.get("/workspaces", getWorkspaces);
router.delete("/workspaces/:workspaceId", deleteWorkspace);
router.post("/workspace/command", addCommandToWorkspace);

export default router;
