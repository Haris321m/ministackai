"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, Cpu } from "lucide-react";
import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashBoard() {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [modelsCount, setModelsCount] = useState<number>(0);
  const [time, setTime] = useState<string>("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token=Cookies.get("token")
      const res = await axios.get(`${API_URL}/users`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setUsersCount(res.data.length);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch models
  const fetchModels = async () => {
    try {
      const token=Cookies.get("token")
      const res = await axios.get(`${API_URL}/models`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setModelsCount(res.data.length);
    } catch (err) {
      console.error("Error fetching models:", err);
    }
  };

  // Live Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchModels();
  }, []);

  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        {/* Clock */}
        <motion.div
          className="mt-4 sm:mt-0 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-mono text-lg shadow-md"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🕒 {time}
        </motion.div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Users Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
          whileHover={{ rotate: 1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Users className="text-blue-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Total Users
            </h2>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {usersCount}
          </p>
        </motion.div>

        {/* Models Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
          whileHover={{ rotate: -1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Cpu className="text-purple-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Active Models
            </h2>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {modelsCount}
          </p>
        </motion.div>

        {/* Example Extra Card */}
        <motion.div
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold mb-3">Performance</h2>
          <p className="text-lg font-medium">🔥 Running Smoothly</p>
        </motion.div>
      </div>
    </div>
  );
}
