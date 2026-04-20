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

export const getProviderServices = async (providerId) => {
  return await Service.find({ provider: providerId });
};

export const deleteService = async (userId, serviceId) => {
  const provider = await Provider.findOne({ user: userId });
  if (!provider) throw new Error("Provider not found");

  const service = await Service.findById(serviceId);
  if (!service) throw new Error("Service not found");

  
  if (service.provider.toString() !== provider._id.toString())
    throw new Error("Not authorized to delete this service");

  await service.deleteOne();

  return true;
};