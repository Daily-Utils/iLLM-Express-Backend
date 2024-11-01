// routes/uploadRoutes.js
import express from 'express';
import { onPDFs, onCSVs } from '../controllers/uploadController.js';
import { pdfUpload, csvUpload, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/pdfs', pdfUpload.array('pdfs', 10), handleUploadError, onPDFs);
router.post('/csvs', csvUpload.array('csvs', 10), handleUploadError, onCSVs);

export default router;