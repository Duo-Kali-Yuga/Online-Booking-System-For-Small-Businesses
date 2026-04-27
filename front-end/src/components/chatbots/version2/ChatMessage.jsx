export default function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-slate-100 text-slate-800 rounded-bl-none"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}