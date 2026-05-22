import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser, FiBriefcase, FiHelpCircle } from 'react-icons/fi';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! Welcome to BookEase. How can I help you today?", sender: 'bot' }
  ]);

  const botOptions = [
    { label: "How do I book?", action: "To book, just browse services in your dashboard and click 'Book Now' on a provider's profile." },
    { label: "Become a Provider", action: "Go to Register and select 'Business Account' to start listing your services." },
    { label: "Is it free?", action: "For clients, yes! Providers can choose between several flexible plans." }
  ];

  const handleOptionClick = (option) => {
    setMessages([...messages, 
      { id: Date.now(), text: option.label, sender: 'user' },
      { id: Date.now() + 1, text: option.action, sender: 'bot' }
    ]);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 h-[450px] bg-white rounded-[var(--radius-lg)] shadow-premium border border-[var(--border-light)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-brand p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold text-sm tracking-tight">BookEase Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)}><FiX /></button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 text-sm font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-brand text-white rounded-l-xl rounded-tr-xl' 
                      : 'bg-white text-slate-700 border border-[var(--border-light)] rounded-r-xl rounded-tl-xl'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-3 bg-white border-t border-[var(--border-light)] flex flex-wrap gap-2">
              {botOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-brand/20 text-brand hover:bg-brand hover:text-white transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand text-white rounded-full shadow-premium flex items-center justify-center text-2xl"
      >
        {isOpen ? <FiX /> : <FiMessageCircle />}
      </motion.button>
    </div>
  );
};

export default SupportChat;