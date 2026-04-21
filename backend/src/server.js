import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startReminderJob } from "./jobs/reminderJob.js";


const PORT = process.env.PORT || 5002;

connectDB();
startReminderJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});