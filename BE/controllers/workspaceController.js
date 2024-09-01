import jwt from "jsonwebtoken";
import Workspace from "../models/workspace.js";

const secretKey = process.env.SECRET_KEY || "terminal-x-secret";

export const createWorkspace = async (req, res) => {
  const { token } = req.headers;
  const { name, commands } = req.body;
  try {
    const decoded = jwt.verify(token, secretKey);
    const newWorkspace = new Workspace({ userId: decoded.id, name, commands });
    await newWorkspace.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getWorkspaces = async (req, res) => {
  const { token } = req.headers;
  try {
    const decoded = jwt.verify(token, secretKey);
    const workspaces = await Workspace.find({ userId: decoded.id });
    res.json({ success: true, workspaces });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteWorkspace = async (req, res) => {
  const { token } = req.headers;
  const { workspaceId } = req.params;
  try {
    const decoded = jwt.verify(token, secretKey);
    const workspace = await Workspace.findOneAndDelete({
      _id: workspaceId,
      userId: decoded.id,
    });
    if (!workspace) {
      return res
        .status(404)
        .json({ success: false, error: "Workspace not found" });
    }
    res.json({ success: true, message: "Workspace deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addCommandToWorkspace = async (req, res) => {
  const { token } = req.headers;
  const { workspaceId, command } = req.body; // command should be an object with key and value

  try {
    const decoded = jwt.verify(token, secretKey);

    const workspace = await Workspace.findOne({ _id: workspaceId, userId: decoded.id });

    if (!workspace) {
      return res.status(404).json({ success: false, error: "Workspace not found" });
    }

    workspace.commands.push(command);
    await workspace.save();

    res.json({ success: true, workspace });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};