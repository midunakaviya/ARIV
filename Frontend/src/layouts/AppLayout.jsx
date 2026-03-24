

// src/layouts/AppLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname.toLowerCase();

    // 🔹 Chatbot Interface Editor
    if (path.includes("chatbot") || path.includes("editor")) {
      return "Chatbot Editor";
    }

    // 🔹 Dashboard
    if (path.includes("dashboard")) {
      return "Dashboard";
    }

    // 🔹 Home
    if (path.includes("home")) {
      return "Welcome to MAASK";
    }

    // 🔹 Experiment config
    if (path.includes("experiment")) {
      return "Create Experiment";
    }

    return "";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {getTitle()}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
