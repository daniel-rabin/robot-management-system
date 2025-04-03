import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiSettings,
  FiArrowLeft,
  FiArrowRight,
  FiGrid,
  FiCpu,
  FiCode,
  FiSliders,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

interface SidebarLayoutProps {
  children: React.ReactNode;
  userFirstName: string | null;
  currentPage: string;
}

const navItems = [
  { label: "Dashboard", icon: <FiGrid />, path: "/" },
  { label: "Robots", icon: <FiCpu />, path: "/robots" },
  { label: "Code", icon: <FiCode />, path: "/code" },
  { label: "Control", icon: <FiSliders />, path: "/control" },
  { label: "Planner", icon: <FiCalendar />, path: "/planner" },
  { label: "Logs", icon: <FiFileText />, path: "/logs" },
];

export default function SidebarLayout({
  children,
  userFirstName,
  currentPage,
}: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`bg-gray-800 text-white p-4 flex flex-col justify-between ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1
              className={`text-2xl font-bold cursor-pointer hover:text-blue-400 ${
                !sidebarOpen && "hidden"
              }`}
              onClick={() => navigate("/")}
            >
              Robodyne
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white"
            >
              {sidebarOpen ? (
                <FiArrowLeft size={20} />
              ) : (
                <FiArrowRight size={20} />
              )}
            </button>
          </div>
          <nav className="space-y-2">
            {navItems.map(({ label, icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-700 ${
                  location.pathname === path ? "font-bold bg-gray-700" : ""
                }`}
              >
                {icon}
                {sidebarOpen && <span>{label}</span>}
              </button>
            ))}
          </nav>
        </div>
        <button className="block w-full text-left hover:bg-gray-700 p-2 rounded">
          {sidebarOpen ? "Settings" : <FiSettings />}
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 relative overflow-x-hidden overflow-y-auto">
        <div className="flex justify-end mb-4" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-200"
          >
            <span className="text-sm font-medium">Account Settings</span>
            <FiSettings size={18} />
          </button>
          {showDropdown && (
            <div className="absolute mt-12 right-6 w-56 bg-white border rounded shadow z-10">
              <div className="px-4 py-2 font-semibold text-gray-800 border-b">
                {userFirstName || user?.email}
              </div>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                Account Settings
              </button>
              <div className="border-t my-1"></div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
