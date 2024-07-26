import jwt from 'jsonwebtoken';
import Workspace from '../models/workspace.js';

const secretKey = process.env.SECRET_KEY;

export const createWorkspace = async (req, res) => {
  const { token, name, commands } = req.body;
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
