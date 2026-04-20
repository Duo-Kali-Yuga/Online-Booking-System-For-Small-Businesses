import Provider from "../models/Provider.js";

export const createProviderProfile = async (userId, data) => {
  
  const existing = await Provider.findOne({ user: userId });
  if (existing) throw new Error("Provider profile already exists");

  const provider = await Provider.create({
    user: userId,
    ...data,
  });

  return provider;
};

export const getMyProviderProfile = async (userId) => {
  return await Provider.findOne({ user: userId }).populate("user", "name email");
};