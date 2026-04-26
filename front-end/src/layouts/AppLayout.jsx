import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";


export default function AppLayout() {
  return (
    <div className="flex flex-col">

      {/* Sidebar */}
      {/* <aside className="w-[var(--sidebar-width)] bg-white border-r p-4">
        <h2 className="font-bold mb-6">Dashboard</h2>
      </aside> */}
      <Navbar/>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}