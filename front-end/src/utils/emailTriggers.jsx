import { sendEmail } from './email.js';

export const notifyBookingSuccess = async (userEmail, bookingDetails) => {
  const { date, startTime, businessName } = bookingDetails;
  
  await sendEmail({
    to: userEmail,
    subject: `Booking Confirmed at ${businessName}`,
    text: `Your appointment is confirmed for ${date} at ${startTime}. We look forward to seeing you!`
  });
};