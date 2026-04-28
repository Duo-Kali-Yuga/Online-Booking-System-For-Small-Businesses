import * as providerService from "../services/providerService.js";
import Provider from "../models/Provider.js";
import { getPagination } from "../utils/pagination.js";
import { successResponse } from "../utils/response.js";
import { getCache, setCache } from "../utils/cache.js";
import multer from 'multer';
import path from 'path';



export const createProvider = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Check for existence FIRST before calling the service
    const existing = await Provider.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ message: "Provider profile already exists" });
    }

    // 2. Call the service to create the profile
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


// export const getProviders = async (req, res) => {
//   const pagination = getPagination(req);

//   const { providers, total } = await providerService.getProviders(
//     req.query,
//     pagination
//   );

//   return successResponse(res, {
//     data: providers,
//     pagination: {
//       total,
//       page: pagination.page,
//       pages: Math.ceil(total / pagination.limit),
//     },
//   });
// };


// export const getProviders = async (query, pagination) => {
//   console.log("1. Fetching Data")
//   const { skip, limit } = pagination;
//   const filter = {};
//   const sort = {};

//   // 1. Only filter industry if it's actually selected
//   if (query.industry && query.industry !== "") {
//     filter.industry = query.industry;
//   }

//   // 2. Only filter city if it's not empty
//   if (query.city && query.city.trim() !== "") {
//     filter["location.city"] = { $regex: query.city.trim(), $options: "i" };
//   }

//   console.log("2. Fetching Data")
//   // 3. CRITICAL: Only use $text if there is a real search string
//   if (query.search && query.search.trim() !== "") {
//     filter.$text = { $search: query.search.trim() };
//   }

//   // 4. Default Sorting
//   if (query.sort === "oldest") sort.createdAt = 1;
//   else sort.createdAt = -1;
//   console.log("3. Fetching Data")
//   try {
//     // If filter is {}, this returns all providers
//     const providers = await Provider.find(filter)
//       .populate("user", "name email")
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);
//     console.log("4. Fetching Data")
//     const total = await Provider.countDocuments(filter);
//     console.log("total:",total)
//     console.log("providers:",providers)
//     return { providers, total };
//   } catch (error) {
//     console.error("Database Query Error:", error);
//     throw error; 
//   }
// };

export const getProviders = async (req, res) => {
  const query = req.query;
  const pagination = { 
    skip: parseInt(req.query.skip) || 0, 
    limit: parseInt(req.query.limit) || 10 
  };

  const result = await providerService.getProviders(query, pagination);
  
  // If you are using a standard response:
  res.status(200).json({
    success: true,
    data: result // This makes the path res.data.data.providers
  });
};

// controllers/providerController.js

// 1. Update Profile (Include Industry)
// export const updateProviderProfile = async (req, res) => {
//   try {
//     const { businessName, bio, location, avatar, phone, industry } = req.body;
//     const provider = await Provider.findOneAndUpdate(
//       { user: req.user._id },
//       { businessName, bio, location, avatar, phone, industry },
//       { new: true, runValidators: true }
//     );
//     res.json({ success: true, data: provider });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateProviderProfile = async (req, res) => {
//   try {
//     const { businessName, bio, location, avatar, phone, industry, settings } = req.body;
    
//     const provider = await Provider.findOneAndUpdate(
//       { user: req.user._id },
//       { businessName, bio, location, avatar, phone, industry, settings },
//       { new: true, runValidators: true }
//     );
    
//     res.json({ success: true, data: provider });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// 2. Delete Provider Account
export const deleteProviderAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the provider document
    const provider = await Provider.findOne({ user: userId });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    // Remove associated data (Appointments and the Provider profile)
    await Appointment.deleteMany({ provider: provider._id });
    await Provider.deleteOne({ _id: provider._id });
    
    // Optionally delete the User document as well
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "Account and associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Configure how the file is stored
const storage = multer.diskStorage({
  destination: 'uploads/avatars/',
  filename: (req, file, cb) => {
    // Save file as: providerID-timestamp.jpg
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({ storage });

export const updateProviderProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    console.log("Incoming Body:", req.body.location);
    console.log("Incoming File:", req.file);
    
    // We remove the req.file / avatar logic here because 
    // the frontend is sending the file to the User controller instead.

    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const provider = await Provider.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { 
        // FIX: The Mongoose Deprecation Warning
        returnDocument: 'after', 
        runValidators: true 
      }
    );
    
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found." });
    }
    
    res.json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    console.log("Incoming Body:", req.body);
    console.log("Incoming File:", req.file);

    const updateData = {};

    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
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

