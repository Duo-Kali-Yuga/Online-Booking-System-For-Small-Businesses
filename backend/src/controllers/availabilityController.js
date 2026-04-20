import * as availabilityService from "../services/availabilityService.js";

export const setAvailability = async (req, res) => {
  try {
    const data = await availabilityService.setAvailability(
      req.user._id,
      req.body
    );
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const data = await availabilityService.getAvailability(
      req.params.providerId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};