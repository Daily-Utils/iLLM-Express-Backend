import express from 'express';
import { onPDFs } from '../controllers/uploadController.js';
import { upload,handleUploadError } from '../middlewares/uploadMiddleware.js';


const router = express.Router();


router.post('/pdfs', upload.array('pdfs', 10),handleUploadError,onPDFs);



export default router;