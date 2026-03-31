import { Outlet } from "react-router-dom";
import AppSidebar from "../AppSidebar";
import FloatingOrbs from "../FloatingOrbs";

export default function DashboardLayout() {
  return (
    <div className="mesh-gradient-bg flex min-h-screen">
      <FloatingOrbs />
      <AppSidebar />
      <main className="flex-1 relative z-10 p-4 lg:p-8 pb-24 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
