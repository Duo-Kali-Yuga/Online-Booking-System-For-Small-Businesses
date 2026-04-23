import Service from "../models/Service.js";
import Provider from "../models/Provider.js";

export const createService = async (userId, data) => {
  const provider = await Provider.findOne({ user: userId });

  if (!provider) throw new Error("Provider profile required");

  const service = await Service.create({
    provider: provider._id,
    ...data,
  });

  return service;
};

// export const getProviderServices = async (providerId) => {
//   return await Service.find({ provider: providerId });
// };

// controllers/serviceController.js
export const getServicesByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    // CRITICAL: Ensure the field name here matches your Schema (e.g., provider: providerId)
    const services = await Service.find({ provider: providerId }); 
    
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProviders = async (query, pagination) => {
  const { skip, limit } = pagination;

  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.industry) filter.industry = query.industry;
  if (query.city) filter["location.city"] = query.city;

  const providers = await Provider.find(filter)
    .populate("user", "name")
    .skip(skip)
    .limit(limit);

  const total = await Provider.countDocuments(filter);

  return { providers, total };
};

// export const deleteService = async (userId, serviceId) => {
//   const provider = await Provider.findOne({ user: userId });
//   if (!provider) throw new Error("Provider not found");

//   const service = await Service.findById(serviceId);
//   if (!service) throw new Error("Service not found");

  
//   if (service.provider.toString() !== provider._id.toString())
//     throw new Error("Not authorized to delete this service");

//   await service.deleteOne();

//   return true;
// };

// serviceService.js
export const deleteService = async (providerId, serviceId) => {
  const service = await Service.findOneAndDelete({ 
    _id: serviceId, 
    provider: providerId  // Ensures the logged-in provider OWNS this service
  });

  if (!service) {
    throw new Error("Service not found or unauthorized");
  }
  return service;
};