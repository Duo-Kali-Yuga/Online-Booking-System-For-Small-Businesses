import User from '../models/User.js';
import { put, del } from '@vercel/blob';
import path from 'path';

export const updateMe = async (req, res) => {
  try {
    console.log("Incoming Body:", req.body);
    console.log("Incoming File:", req.file);

    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;

    // Handle avatar upload with Vercel Blob
    if (req.file) {
      // Find existing user to check for old avatar
      const existingUser = await User.findById(req.user._id);
      
      // Delete old avatar from Vercel Blob if it exists
      if (existingUser?.avatar && existingUser.avatar.includes('blob.vercel-storage.com')) {
        try {
          await del(existingUser.avatar, { token: process.env.BLOB_READ_WRITE_TOKEN });
          console.log('✅ Deleted old avatar from Vercel Blob');
        } catch (error) {
          console.error('Failed to delete old avatar:', error);
        }
      }
      
      // Generate unique filename for the new avatar
      const fileExtension = path.extname(req.file.originalname);
      const filename = `users/user-${req.user._id}-${Date.now()}${fileExtension}`;
      
      // Upload to Vercel Blob (PUBLIC access)
      const blob = await put(filename, req.file.buffer, {
        access: 'public',  // ← Public access for profile pictures
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false,
        contentType: req.file.mimetype
      });
      
      // Save the blob.url instead of local path
      updateData.avatar = blob.url;
      console.log('✅ Avatar uploaded to:', blob.url);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { 
        returnDocument: 'after',
        runValidators: true 
      }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("UpdateMe Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};