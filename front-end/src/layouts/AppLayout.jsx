import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SupportChat from "../components/chatbots/version1/SupportChat";
import { useAuth } from "../context/AuthContext";
import ChatButton from "../components/chatbots/version2/ChatButton";
import Chatbot from "../components/chatbots/version2/Chatbot";


export default function AppLayout() {

  const { user } = useAuth();

  return (
    <div className="flex flex-col">

      {/* Sidebar */}
      {/* <aside className="w-[var(--sidebar-width)] bg-white border-r p-4">
        <h2 className="font-bold mb-6">Dashboard</h2>
      </aside> */}
      <Navbar/>
      {/* <SupportChat/>
      {user && <Chatbot role={user.role} />} */}
      <ChatButton />

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}