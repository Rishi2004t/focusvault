import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import dotenv from 'dotenv';
import { authMiddleware } from '../middleware/auth.js';
import { uploadAssets, getAssets, deleteAsset, downloadAsset } from '../controllers/assetController.js';

dotenv.config();

const router = express.Router();

// Free plan limit: 10MB per file
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary streaming storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const extName = path.extname(file.originalname).toLowerCase();
    let rType = 'auto'; // Images, PDFs, and Videos can process automatically
    
    // Cloudinary strictly requires Microsoft Office documents to be uploaded as 'raw' resource type
    if (['.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt'].includes(extName)) {
      rType = 'raw';
    }
    
    return {
      folder: 'focusvault_assets',
      resource_type: rType,
      access_mode: 'public',
      // Ensure the file keeps a distinguishable public ID, appending the extension if it's raw so Google Docs Viewer can parse the URL
      public_id: `${path.basename(file.originalname, extName).replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}${rType === 'raw' ? extName : ''}`
    };
  },
});

const upload = multer({ 
  storage: cloudinaryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|ppt|pptx|jpg|jpeg|png|gif|webp|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('❌ Restricted File: Only documents (PDF, PPT, Word) and visuals are permitted in the vault.'));
  }
});

/**
 * Neural Asset Routes
 */

// Retrieve all archived assets
router.get('/assets', authMiddleware, getAssets);

// Archival Endpoint: Streamlined Single-Pass Sync
router.post('/multiple', authMiddleware, (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: `❌ File too large. Maximum size is 10MB per file. Please compress your resource.`
      });
    }
    if (err) return res.status(400).json({ message: err.message });
    
    // Pass control to the controller
    uploadAssets(req, res, next);
  });
});

// Purge Endpoint: Secure deletion with cascading note purge option
router.delete('/assets/:id', authMiddleware, deleteAsset);

// Proxy Download: Server-side fetch to bypass browser blocks
router.get('/download/:id', authMiddleware, downloadAsset);

export default router;
