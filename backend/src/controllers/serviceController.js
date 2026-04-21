import * as serviceService from "../services/serviceService.js";
import { successResponse } from "../utils/response.js";

// export const createService = async (req, res) => {
//   try {
//     const service = await serviceService.createService(
//       req.user._id,
//       req.body
//     );

//     res.status(201).json(service);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const createService = async (req, res) => {
  const service = await serviceService.createService(
    req.user._id,
    req.body
  );

  return successResponse(res, service, "Service created", 201);
};

// export const getMyServices = async (req, res) => {
//   try {
//     const providerId = req.params.providerId;

//     const services = await serviceService.getProviderServices(providerId);

//     res.json(services);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getMyServices = async (req, res) => {
  const services = await serviceService.getProviderServices(
    req.params.providerId
  );

  return successResponse(res, services, "Services fetched");
};

export const deleteService = async (req, res) => {
  try {
    await serviceService.deleteService(req.user._id, req.params.id);

    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};