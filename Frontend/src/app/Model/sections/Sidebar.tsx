"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  LogOut,
} from "lucide-react";
import { IoMenu } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "@/components/ContextAPI";
import Image from "next/image";
import Logo from "../../../assets/logo.png";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Conversation {
  Id: number;
  Title: string;
  UserId: number;
  CreatedAt: string;
}

interface User {
  Id: number;
  FirstName: string;
  LastName: string;
  profilePic?: string;
  tokens: number;
}

interface SidebarProps {
  conversations: Conversation[];
  onSelectConversation: (c: Conversation) => void;
  onNewChat: () => Promise<Conversation | null>;
  onUpdateConversation: (c: Conversation) => void;
  onDeleteConversation: (id: number) => void;
  activeConversationId?: number;
}

export default function Sidebar({
  conversations = [],
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onUpdateConversation,
  activeConversationId,
}: SidebarProps) {
  const [open, setOpen] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<number | string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileMenu, setProfileMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const userid = Cookies.get("userId");
        if (!userid || !API_URL) return;
        const res = await axios.get(`${API_URL}/users/${userid}`);
        if (isMounted) setUser(res.data || null);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Error fetching user (handled safely):", error);
        }
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setMenuOpenId(null);
        }
        if (
          profileRef.current &&
          !profileRef.current.contains(event.target as Node)
        ) {
          setProfileMenu(false);
        }
      } catch {}
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg lg:hidden backdrop-blur-md"
      >
        <IoMenu size={22} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative h-screen flex flex-col justify-between transition-all duration-500 ease-in-out
          bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-900/40 dark:to-gray-800/30 backdrop-blur-2xl border-r border-white/20 dark:border-gray-700
          ${open ? "lg:w-64" : "w-16"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 z-40`}
      >
        {/* Header */}
        <div className="px-4 py-5">
          <div className="flex items-center justify-between mb-6">
            {open && (
              <Image
                onClick={() => router.push("/")}
                src={Logo}
                alt="logo"
                className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform"
              />
            )}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition hidden lg:block"
            >
              {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          <button
            onClick={async () => {
              try {
                const newConv = await onNewChat();
                if (newConv) {
                  onSelectConversation(newConv);
                  setMobileOpen(false);
                }
              } catch {}
            }}
            className={`flex items-center justify-center font-semibold gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform ${
              open ? "px-4 py-2" : "p-2"
            }`}
          >
            <Plus className="text-lg" />
            {open && <span>New Chat</span>}
          </button>
        </div>

        {/* Conversations */}
        <div
          className={`flex-1 overflow-y-auto px-4 mt-4 custom-scrollbar flex flex-col gap-3 ${
            open ? "block" : "hidden"
          }`}
        >
          {Array.isArray(conversations) && conversations.length > 0 ? (
            conversations
              .slice(0)
              .reverse()
              .map((chat) => (
                <div
                  key={chat.Id}
                  className={`relative flex items-center justify-between px-3 py-2 rounded-xl shadow-sm transition-all duration-300
                    ${
                      chat.Id === activeConversationId
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "bg-white/40 dark:bg-gray-700/40 hover:bg-white/60 dark:hover:bg-gray-600/60"
                    }`}
                >
                  <span
                    className="flex-1 cursor-pointer truncate"
                    onClick={() => {
                      try {
                        onSelectConversation(chat);
                        setMobileOpen(false);
                      } catch {}
                    }}
                  >
                    {chat.Title || "New Chat"}
                  </span>

                  <button
                    className="ml-2 p-1 rounded-full hover:bg-white/20 transition"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === chat.Id ? null : chat.Id)
                    }
                  >
                    <MoreVertical size={16} />
                  </button>

                  {menuOpenId === chat.Id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-2 top-full mt-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-2xl w-40 z-50 animate-fadeIn overflow-hidden border border-gray-200/20"
                    >
                      <button
                        onClick={() => {
                          try {
                            setMenuOpenId(null);
                            onUpdateConversation(chat);
                            setMobileOpen(false);
                          } catch {}
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-gray-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          try {
                            setMenuOpenId(null);
                            onDeleteConversation(chat.Id);
                            setMobileOpen(false);
                          } catch {}
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-800/40"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p className="text-gray-400 italic text-sm">No conversations yet</p>
          )}
        </div>

        {/* Profile */}
        {user && (
          <div
            ref={profileRef}
            className="relative px-4 py-4 border-t border-white/10"
          >
            <div
              className="flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-all bg-white/10 hover:bg-white/20 dark:hover:bg-gray-700"
              onClick={() => setProfileMenu(!profileMenu)}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold">
                {user.FirstName?.charAt(0).toUpperCase()}
              </div>
              {open && (
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {`${user.FirstName || ""} ${user.LastName || ""}`}
                  </span>
                </div>
              )}
            </div>

            {profileMenu && (
              <div className="absolute z-50 left-4 right-4 bottom-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scrollbar + Animations */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #6366f1, #a855f7);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #4338ca, #7e22ce);
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-in-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
}
