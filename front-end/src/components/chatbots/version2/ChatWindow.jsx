import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { getBotResponse } from "./botLogic";
import { useAuth } from "../../../context/AuthContext";


export default function ChatWindow({ onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);

  const [typing, setTyping] = useState(false);

  // const handleSend = (text) => {
  //   const userMessage = { sender: "user", text };

  //   // Add user message immediately
  //   setMessages((prev) => [...prev, userMessage]);

  //   // Bot typing effect
  //   setTyping(true);

  //   const botResponse = getBotResponse(text, user);

  //   setTimeout(() => {
  //     const botMessage = {
  //       sender: "bot",
  //       text: botResponse.text || botResponse,
  //     };

  //     setMessages((prev) => [...prev, botMessage]);
  //     setTyping(false);

  //     // Navigate if action exists
  //     if (botResponse.action) {
  //       setTimeout(() => navigate(botResponse.action), 800);
  //     }
  //   }, 600);
  // };

  const handleSend = async (text) => {
    const userMessage = { sender: "user", text };

    setMessages((prev) => [...prev, userMessage]);
    setTyping(true);

    try {
      const botResponse = await getBotResponse(text, user);

      const botMessage = {
        sender: "bot",
        text: botResponse.text,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (botResponse.action) {
        setTimeout(() => navigate(botResponse.action), 800);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
      
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-bold">Assistant</h3>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {/* Typing Indicator */}
        {typing && (
          <div className="text-xs text-slate-400 italic">
            Assistant is typing...
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2 px-4 pb-2">
        {["Book", "Cancel", "Availability", "Services"].map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="text-xs bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}