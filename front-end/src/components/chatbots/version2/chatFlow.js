
export const chatFlows = {
  client: [
    {
      message: "Hi! What do you want to do?",
      options: [
        { label: "Book appointment", action: "BOOK" },
        { label: "My bookings", action: "DASHBOARD" },
      ],
    },
    {
      key: "BOOK",
      message: "Great! Let's find a provider.",
      action: (navigate) => navigate("/client"),
    },
    {
      key: "DASHBOARD",
      message: "Opening your dashboard...",
      action: (navigate) => navigate("/client/dashboard"),
    },
  ],
};