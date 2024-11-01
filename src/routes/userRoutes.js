import express from 'express';
import { updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/clerk-webhook', updateUser);

export default router;
