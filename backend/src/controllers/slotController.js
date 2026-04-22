import { getAvailableSlots } from "../services/slotService.js";

export const getSlots = async (req, res) => {
  console.log("Slots ... Here")
  try {
    const { providerId, date, duration } = req.query;

    const slots = await getAvailableSlots(
      providerId,
      date,
      Number(duration)
    );

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};