import https from 'https';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import Asset from '../models/Asset.js';
import Note from '../models/Note.js';
import { recordActivity } from '../utils/logger.js';

/**
 * Handle multiple file uploads and auto-create Neural Notes
 */
export const uploadAssets = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided for architectural archival' });
    }

    const archivedAssets = [];

    for (const file of req.files) {
      let newNote;
      try {
        // 1. Auto-create a linked Neural Note
        newNote = new Note({
          userId: req.userId,
          title: `New Asset: ${file.originalname.split('.')[0]}`,
          content: `Neural Note initialized from resource: ${file.originalname}\nSynced at: ${new Date().toLocaleString()}`,
          category: 'neural',
          type: 'blueprint'
        });
        await newNote.save();

        // 2. Identify file category
        const fileExt = path.extname(file.originalname).substring(1).toLowerCase();
        let fileType = fileExt;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) fileType = 'image';
        if (['doc', 'docx'].includes(fileExt)) fileType = 'document';
        if (['ppt', 'pptx'].includes(fileExt)) fileType = 'ppt';

        // 3. Create Asset document with Cloudinary details
        const asset = new Asset({
          userId: req.userId,
          noteId: newNote._id,
          filename: file.originalname,
          fileType: fileType,
          url: file.path || file.secure_url, 
          publicId: file.filename || file.public_id,
          size: file.size,
          category: 'PDF Documents' // Fallback handled by Schema pre-validate hook
        });

        console.log(`📡 Archiving Neural Node: ${file.originalname} (Vault ID: ${asset.publicId || 'STREAM'})`);
        await asset.save();

        // 4. Link mapping back to note
        newNote.assets.push(asset._id);
        await newNote.save();

        archivedAssets.push({
          assetId: asset._id,
          noteId: newNote._id,
          filename: asset.filename,
          url: asset.url
        });
      } catch (innerErr) {
        console.error(`❌ Partial Sync Failure for ${file.originalname}:`, innerErr);
        // Rollback note if it was created but asset linkage failed
        if (newNote && newNote._id) {
          await Note.findByIdAndDelete(newNote._id).catch(e => console.error('Rollback failed:', e));
        }
        // Continue with next file
      }
    }

    // Record bulk activity for the vault archival
    if (archivedAssets.length > 0) {
      const summaryMsg = archivedAssets.length === 1 
        ? `Asset stored: "${archivedAssets[0].filename}"`
        : `${archivedAssets.length} assets synchronized to vault.`;
      
      await recordActivity(
        req.userId, 
        'VAULT_ADD', 
        summaryMsg, 
        'neural', 
        { count: archivedAssets.length }
      );
    }

    res.status(201).json({
      message: `${req.files.length} Neural Nodes successfully synchronized`,
      archivedAssets
    });
  } catch (error) {
    console.error('❌ Controller Failure (Upload):', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handle Asset deletion and optional Note cascading
 */
export const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { cascadeNote } = req.query;

    const asset = await Asset.findOne({ _id: id, userId: req.userId });
    if (!asset) {
      return res.status(404).json({ message: 'Neural node not found' });
    }

    // 1. Purge from Cloudinary cloud servers
    if (asset.publicId) {
      await cloudinary.uploader.destroy(asset.publicId);
    }

    // 2. Conditional: Purge associated Note
    if (cascadeNote === 'true' && asset.noteId) {
      await Note.findByIdAndDelete(asset.noteId);
    }

    // 3. Purge reference from MongoDB
    await Asset.findByIdAndDelete(id);

    // Record activity
    await recordActivity(
      req.userId, 
      'VAULT_DEL', 
      `Neural node "${asset.filename}" purged from vault.`, 
      'security'
    );

    res.json({ message: `Asset ${cascadeNote === 'true' ? 'and linked note ' : ''}purged successfully` });
  } catch (error) {
    console.error('❌ Controller Failure (Delete):', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all assets for the user
 */
export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.userId })
      .populate('noteId', 'title')
      .sort('-createdAt');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Proxy Download Protocol: Streams from Cloudinary server-side to bypass CORS/401
 */
export const downloadAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findOne({ _id: id, userId: req.userId });
    
    if (!asset) {
      return res.status(404).json({ message: 'Neural resource not found' });
    }

    // Set professional headers for forced download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${asset.filename}"`);

    // Stream the file directly from Cloudinary to the response
    https.get(asset.url, (stream) => {
      if (stream.statusCode !== 200) {
        return res.status(stream.statusCode).json({ message: 'Neural retrieval failure' });
      }
      stream.pipe(res);
    }).on('error', (err) => {
      console.error('❌ Stream Error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Stream interruption' });
      }
    });

  } catch (error) {
    console.error('❌ Proxy Download Failure:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Neural retrieval failed' });
    }
  }
};
