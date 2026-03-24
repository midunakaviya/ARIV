// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  LogOut,
  Bot,
  PlusCircle,
} from "lucide-react";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/experiment-config", label: "Create Experiment", icon: PlusCircle },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chatbot-builder", label: "Chatbot Editor", icon: Bot },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("maask:lastSurvey");
    navigate("/welcome");
  };

  return (
    // ✅ Key fix: make the whole sidebar stick to the viewport while main content scrolls
    <aside className="w-64 bg-white border-r border-gray-200 sticky top-0 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          
          <div>
            <h1 className="text-xl font-bold text-gray-900">ARIV</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {/* ✅ Keep nav scrollable if height is tight; logout stays pinned at bottom */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-purple-600 text-white rounded-xl"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout (same button, just pinned because sidebar is flex-col + h-screen) */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
