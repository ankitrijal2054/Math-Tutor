import React, { useState, useRef } from "react";
import Header from "./Header";
import Sidebar from "../sidebar/Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <Header
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with Conversations */}
        <Sidebar
          ref={sidebarRef}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />

        {/* Chat Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {React.cloneElement(children, { sidebarRef })}
        </main>

        {/* Whiteboard Placeholder - Hidden for now */}
        {/* 
        <aside className="hidden lg:block w-80 bg-slate-800 border-l border-slate-700">
          <div className="p-4 h-full flex items-center justify-center text-slate-400">
            Whiteboard (Coming Soon)
          </div>
        </aside>
        */}
      </div>

      {/* Mobile Backdrop - Close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
