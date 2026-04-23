import * as serviceService from "../services/serviceService.js";
import { successResponse } from "../utils/response.js";
import Service from '../models/Service.js';


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

// export const createService = async (req, res) => {
//   const service = await serviceService.createService(
//     req.user._id,
//     req.body
//   );

//   return successResponse(res, service, "Service created", 201);
// };

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
  // const services = await serviceService.getProviderServices(
  //   req.params.providerId
  // );
  const services = await serviceService.getServicesByProvider(
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

// GET /api/services/me
export const getMyServicesMe = async (req, res) => {
  try {
    // req.user was set by your 'protect' middleware
    // We find all services where the 'provider' field matches the logged-in user's ID
    const services = await Service.find({ provider: req.user._id });
    
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/services
// export const createService = async (req, res) => {
//   try {
//     const { name, duration, price } = req.body;
//     const newService = new Service({
//       name,
//       duration,
//       price,
//       provider: req.user.id // Automatically link to the logged-in provider
//     });
//     await newService.save();
//     res.status(201).json({ success: true, data: newService });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// export const createService = async (req, res) => {
//   const service = await serviceService.createService(
//     req.user._id,
//     req.body
//   );

//   return successResponse(res, service, "Service created", 201);
// };

export const createService = async (req, res) => {
  try {
    const { name, duration, price } = req.body;

    // We take the provider ID directly from the authenticated user
    const newService = new Service({
      name,
      duration,
      price,
      provider: req.user._id 
    });

    await newService.save();
    res.status(201).json({ success: true, data: newService });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

