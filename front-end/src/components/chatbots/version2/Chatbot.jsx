// Chatbot.jsx
import { useState } from "react";
import { chatFlows } from "./chatFlow";
import { useNavigate } from "react-router-dom";

export default function Chatbot({ role }) {
  const [messages, setMessages] = useState([
    chatFlows[role][0],
  ]);

  const navigate = useNavigate();

  const handleOption = (option) => {
    const next = chatFlows[role].find(
      (f) => f.key === option.action
    );

    if (next?.action) {
      next.action(navigate);
    }

    if (next) {
      setMessages((prev) => [...prev, next]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-xl rounded-xl border p-4">
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            <p className="text-sm">{msg.message}</p>

            {msg.options && (
              <div className="flex flex-wrap gap-2 mt-2">
                {msg.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOption(opt)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}