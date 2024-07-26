import express from 'express';
import { createWorkspace, getWorkspaces } from '../controllers/workspaceController.js';

const router = express.Router();

router.post('/workspace', createWorkspace);
router.get('/workspaces', getWorkspaces);

export default router;
