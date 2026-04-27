// export function getBotResponse(message, user) {
//   const msg = message.toLowerCase();
//   const role = user?.role || "guest";

//   // --- GREETING ---
//   if (msg.match(/hi|hello|hey/)) {
//     return { text: `Hi ${user?.name || ""}! How can I help you today?` };
//   }

//   // --- BOOKING ---
//   if (msg.includes("book")) {
//     if (role === "client") {
//       return {
//         text: "I'll take you to the booking page.",
//         action: "/app",
//       };
//     }
//     return { text: "Only clients can book appointments." };
//   }

//   // --- CANCEL ---
//   if (msg.includes("cancel")) {
//     return {
//       text: "Go to your dashboard to cancel an appointment.",
//       action: "/dashboard",
//     };
//   }

//   // --- RESCHEDULE ---
//   if (msg.includes("reschedule")) {
//     return {
//       text: "You can reschedule from your dashboard.",
//       action: "/dashboard",
//     };
//   }

//   // --- PROVIDER ---
//   if (msg.includes("availability")) {
//     if (role === "provider") {
//       return {
//         text: "Opening availability settings...",
//         action: "/provider/availability",
//       };
//     }
//     return { text: "Only providers manage availability." };
//   }

//   if (msg.includes("service")) {
//     if (role === "provider") {
//       return {
//         text: "Let's manage your services.",
//         action: "/provider/services",
//       };
//     }
//     return { text: "Services are managed by providers." };
//   }

//   // --- ADMIN ---
//   if (msg.includes("admin")) {
//     if (role === "admin") {
//       return {
//         text: "Opening admin dashboard...",
//         action: "/admin",
//       };
//     }
//     return { text: "You don't have admin access." };
//   }

//   // --- LOGIN ---
//   if (msg.includes("login")) {
//     return {
//       text: "Redirecting to login...",
//       action: "/login",
//     };
//   }

//   return {
//     text: "I can help with booking, services, or availability. Try asking something like 'book appointment'.",
//   };
// }


import { getMyAppointments, getProviderAppointments } from "../chatService";

getMyAppointments

export async function getBotResponse(message, user) {
  const msg = message.toLowerCase();
  const role = user?.role;

  // --- TODAY BOOKINGS ---
  if (msg.includes("today")) {
    try {
      let res;

      if (role === "client") {
        res = await getMyAppointments();
      } else if (role === "provider") {
        res = await getProviderAppointments();
      }

      const data = res.data.data || [];

      const today = new Date().toISOString().split("T")[0];

      const todayAppointments = data.filter((a) =>
        a.date.startsWith(today)
      );

      return {
        text: `You have ${todayAppointments.length} appointment(s) today.`,
      };
    } catch (err) {
      return { text: "Failed to fetch today's appointments." };
    }
  }

  // --- TOTAL BOOKINGS ---
  if (msg.includes("how many") || msg.includes("total")) {
    try {
      let res;

      if (role === "client") {
        res = await getMyAppointments();
      } else if (role === "provider") {
        res = await getProviderAppointments();
      }

      const data = res.data.data || [];

      return {
        text: `You have ${data.length} total appointment(s).`,
      };
    } catch {
      return { text: "Error fetching data." };
    }
  }

  // --- REVENUE (PROVIDER) ---
  if (msg.includes("revenue")) {
    if (role !== "provider") {
      return { text: "Only providers have revenue stats." };
    }

    try {
      const res = await getProviderAppointments();
      const data = res.data.data || [];

      const revenue = data
        .filter((a) => a.status === "confirmed")
        .reduce((sum, a) => sum + (a.service?.price || 0), 0);

      return {
        text: `Your total revenue is $${revenue}.`,
      };
    } catch {
      return { text: "Could not calculate revenue." };
    }
  }



  // --- GREETING ---
  if (msg.match(/hi|hello|hey/)) {
    return { text: `Hi ${user?.name || ""}! How can I help you today?` };
  }

  // --- BOOKING ---
  if (msg.includes("book")) {
    if (role === "client") {
      return {
        text: "I'll take you to the booking page.",
        action: "/app",
      };
    }
    return { text: "Only clients can book appointments." };
  }

  // --- CANCEL ---
  if (msg.includes("cancel")) {
    return {
      text: "Go to your dashboard to cancel an appointment.",
      action: "/dashboard",
    };
  }

  // --- RESCHEDULE ---
  if (msg.includes("reschedule")) {
    return {
      text: "You can reschedule from your dashboard.",
      action: "/dashboard",
    };
  }

  // --- PROVIDER ---
  if (msg.includes("availability")) {
    if (role === "provider") {
      return {
        text: "Opening availability settings...",
        action: "/provider/availability",
      };
    }
    return { text: "Only providers manage availability." };
  }

  if (msg.includes("service")) {
    if (role === "provider") {
      return {
        text: "Let's manage your services.",
        action: "/provider/services",
      };
    }
    return { text: "Services are managed by providers." };
  }

  // --- ADMIN ---
  if (msg.includes("admin")) {
    if (role === "admin") {
      return {
        text: "Opening admin dashboard...",
        action: "/admin",
      };
    }
    return { text: "You don't have admin access." };
  }

  // --- LOGIN ---
  if (msg.includes("login")) {
    return {
      text: "Redirecting to login...",
      action: "/login",
    };
  }

  // --- DEFAULT ---
  return {
    text: "Try asking: 'appointments today', 'total bookings', or 'revenue'.",
  };
}