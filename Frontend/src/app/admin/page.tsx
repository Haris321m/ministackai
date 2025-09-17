"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { FaBars } from "react-icons/fa";
import DashBoard from "./sections/DashBoard";
import Users from "./sections/Users";
import Plans from "./sections/Packeges";
import PaymentVerification from "./sections/PaymentVerification";
import Models from "./sections/Models";
import Cookies from "js-cookie";

export default function Page() {
  const [activeSection, setActiveSection] = useState("DashBoard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  
  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("Role");

    if (!token || role !== "admin") {
      router.push("Login"); 
    } else {
      setIsAuthorized(true); 
    }
  }, [router]);

  const renderSection = () => {
    switch (activeSection) {
      case "DashBoard":
        return <DashBoard />;
      case "Users":
        return <Users />;
      case "Plans":
        return <Plans />;
      case "Models":
        return <Models />;
      case "PaymentVerification":
        return <PaymentVerification />;
      default:
        return <DashBoard />;
    }
  };

  const menuItems = ["DashBoard", "Users", "Plans", "Models", "PaymentVerification"];

  if (!isAuthorized) {
    // Loading state until auth check complete
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-600 to-purple-700 text-white w-64 p-5 flex flex-col gap-10 transform transition-transform duration-300 z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <h1 className="text-3xl font-extrabold tracking-wide">Admin</h1>
        <ul className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <li
              key={item}
              onClick={() => {
                setActiveSection(item);
                setIsSidebarOpen(false);
              }}
              className={`text-lg flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 
              ${
                activeSection === item
                  ? "bg-white text-blue-600 font-bold shadow-md"
                  : "hover:bg-white/20"
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden absolute top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-md"
      >
        <FaBars />
      </button>

      {/* Content */}
      <div className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6">
        {renderSection()}
      </div>
    </div>
  );
}
