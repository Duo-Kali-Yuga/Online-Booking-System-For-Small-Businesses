import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

export const startReminderJob = () => {
  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

    const appointments = await Appointment.find({
      date: {
        $gte: now,
        $lte: nextHour,
      },
      status: "confirmed",
    });

    for (let appt of appointments) {
      const user = await User.findById(appt.client);

      await sendEmail({
        to: user.email,
        subject: "Appointment Reminder",
        text: `Reminder: You have an appointment at ${appt.startTime}`,
      });
    }
  });
};