import * as providerService from "../services/providerService.js";
import { getPagination } from "../utils/pagination.js";
import { successResponse } from "../utils/response.js";

export const createProvider = async (req, res) => {
  try {
    const provider = await providerService.createProviderProfile(
      req.user._id,
      req.body
    );

    res.status(201).json(provider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyProvider = async (req, res) => {
  try {
    const provider = await providerService.getMyProviderProfile(req.user._id);

    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProviders = async (req, res) => {
  const pagination = getPagination(req);

  const { providers, total } = await providerService.getProviders(
    req.query,
    pagination
  );

  return successResponse(res, {
    data: providers,
    pagination: {
      total,
      page: pagination.page,
      pages: Math.ceil(total / pagination.limit),
    },
  });
};