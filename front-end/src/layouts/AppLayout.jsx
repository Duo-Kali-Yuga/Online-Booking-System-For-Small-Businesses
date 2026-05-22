import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import ChatButton from "../components/chatbots/version2/ChatButton";
import Chatbot from "../components/chatbots/version2/Chatbot";


export default function AppLayout() {

  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      <Navbar/>
      <ChatButton />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}