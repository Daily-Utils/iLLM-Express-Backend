import express from 'express';
import { onCreateNodesEdges,onGetNodesEdges ,onCreateWorkflow,onFlowPublish,onGetWorkflows } from '../controllers/workflowController.js';
const router = express.Router();

router.put('/nodes-edges', onCreateNodesEdges);
router.post('/create-workflow',onCreateWorkflow);
router.post('/publish',onFlowPublish);
router.get('/get-flows/:id',onGetWorkflows);
router.get('/get-nodes-edges/:id',onGetNodesEdges);


export default router