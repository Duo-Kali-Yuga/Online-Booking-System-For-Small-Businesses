import Provider from "../models/Provider.js";
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

export const getProviders = async (query, pagination) => {
  const { skip, limit } = pagination;

  const filter = {};

  if (query.industry) filter.industry = query.industry;
  if (query.city) filter["location.city"] = query.city;
  if (query.sort === "newest") sort.createdAt = -1;
  if (query.sort === "oldest") sort.createdAt = 1;

  const providers = await Provider.find(filter)
    .populate("user", "name email")
    .skip(skip)
    .limit(limit);

  const total = await Provider.countDocuments(filter);

  return { providers, total };
};