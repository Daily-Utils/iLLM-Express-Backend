import multer from 'multer';
import path from 'path';
import fs from 'fs';

const createMulterUpload = (fileType) => {
  const uploadDir = `uploads/${fileType}s`;

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  const mimeTypes = {
    pdf: 'application/pdf',
    csv: ['text/csv', 'application/vnd.ms-excel']
  };

  const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = mimeTypes[fileType];
    if (Array.isArray(allowedMimeTypes)) {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${fileType.toUpperCase()} files are allowed!`));
      }
    } else {
      if (file.mimetype === allowedMimeTypes) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${fileType.toUpperCase()} files are allowed!`));
      }
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 20 * 1024 * 1024,
      files: 10
    }
  });
};

export const pdfUpload = createMulterUpload('pdf');
export const csvUpload = createMulterUpload('csv');

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File size limit exceeded. Maximum size is 20MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum is 10 files at once.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name in upload.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Error uploading file: ' + err.message
        });
    }
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Error uploading file.'
    });
  }
  next();
};