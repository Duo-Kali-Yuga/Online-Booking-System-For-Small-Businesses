import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition z-50 text-6xl"
      >
        🤖
      </button>

      {/* Chat Window */}
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}