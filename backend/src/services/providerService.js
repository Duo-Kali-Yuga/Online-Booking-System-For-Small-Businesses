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
  
  // 1. Industry Filter
  if (query.industry) filter.industry = query.industry;

  // 2. City Filter (Case-insensitive)
  if (query.city && query.city.trim() !== "") {
    filter["location.city"] = { $regex: query.city.trim(), $options: "i" };
  }

  // 3. Text Search (ONLY if search is not empty)
  if (query.search && query.search.trim() !== "") {
    filter.$text = { $search: query.search.trim() };
  }

  const providers = await Provider.find(filter)
    .populate("user", "name email")
    .sort(query.search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Provider.countDocuments(filter);
  return { providers, total };
};