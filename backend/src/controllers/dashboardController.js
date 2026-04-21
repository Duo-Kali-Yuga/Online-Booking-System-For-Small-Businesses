import { successResponse } from "../utils/response.js";
import * as analyticsService from "../services/analyticsService.js";

export const getDashboard = async (req, res) => {
  const data = await analyticsService.getDashboardStats(req.user._id);

  return successResponse(res, data, "Dashboard data");
};