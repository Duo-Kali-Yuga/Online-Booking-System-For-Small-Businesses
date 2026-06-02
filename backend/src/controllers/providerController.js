import * as providerService from "../services/providerService.js";
import Provider from "../models/Provider.js";
import { getPagination } from "../utils/pagination.js";
import { successResponse } from "../utils/response.js";
import { getCache, setCache } from "../utils/cache.js";
import multer from 'multer';
import path from 'path';
import { put, del } from '@vercel/blob'; // Add this import


const storage = multer.memoryStorage(); 


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'));
};

export const upload = multer({ 
  storage,  // Now using memory storage
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter 
});

export const createProvider = async (req, res) => {
  try {
    const userId = req.user._id;


    const existing = await Provider.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ message: "Provider profile already exists" });
    }

  
    const provider = await providerService.createProviderProfile(
      userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Provider profile created successfully",
      data: provider
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyProvider = async (req, res) => {
  try {
    const provider = await providerService.getMyProviderProfile(req.user._id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found. Please complete setup." });
    }
  
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate("user", "name email");
    if (!provider) return res.status(404).json({ message: "Not found" });

    res.json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProviders = async (req, res) => {
  const query = req.query;
  const pagination = { 
    skip: parseInt(req.query.skip) || 0, 
    limit: parseInt(req.query.limit) || 10 
  };

  const result = await providerService.getProviders(query, pagination);
  
  res.status(200).json({
    success: true,
    data: result
  });
};

export const deleteProviderAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const provider = await Provider.findOne({ user: userId });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });


    if (provider.avatar && provider.avatar.includes('blob.vercel-storage.com')) {
      try {
        await del(provider.avatar, { token: process.env.BLOB_READ_WRITE_TOKEN });
        console.log('Deleted old avatar from Vercel Blob');
      } catch (error) {
        console.error('Failed to delete avatar from blob:', error);
      }
    }

    await Appointment.deleteMany({ provider: provider._id });
    await Provider.deleteOne({ _id: provider._id });
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "Account and associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProviderProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    console.log("Incoming Body:", req.body.location);
    console.log("Incoming File:", req.file);
    
    // Handle avatar upload with Vercel Blob
    if (req.file) {

      const existingProvider = await Provider.findOne({ user: req.user._id });
      

      if (existingProvider?.avatar && existingProvider.avatar.includes('blob.vercel-storage.com')) {
        try {
          await del(existingProvider.avatar, { token: process.env.BLOB_READ_WRITE_TOKEN });
          console.log('Deleted old avatar from Vercel Blob');
        } catch (error) {
          console.error('Failed to delete old avatar:', error);
        }
      }
      
      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const filename = `providers/user-${req.user._id}-${Date.now()}${fileExtension}`;
      
      // Upload to Vercel Blob
      const blob = await put(filename, req.file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false,
        contentType: req.file.mimetype
      });
      
      // Save the blob.url instead of local path
      updateData.avatar = blob.url;
      console.log('✅ Avatar uploaded to:', blob.url);
    }

    const provider = await Provider.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { 
        returnDocument: 'after', 
        runValidators: true 
      }
    );
    
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found." });
    }
    
    res.json({ success: true, data: provider });
  } catch (error) {
    console.error('Update provider error:', error);
    res.status(500).json({ message: error.message });
  }
};


export const updateMe = async (req, res) => {
  try {
    console.log("Incoming Body:", req.body);
    console.log("Incoming File:", req.file);

    const updateData = {};

    if (req.file) {
      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const filename = `users/user-${req.user._id}-${Date.now()}${fileExtension}`;
      
      // Upload to Vercel Blob
      const blob = await put(filename, req.file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false,
        contentType: req.file.mimetype
      });
      
      updateData.avatar = blob.url;
      console.log('✅ Avatar uploaded to:', blob.url);
    }


    const user = await Provider.findByIdAndUpdate(
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