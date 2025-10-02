'use client'

import React, { useState } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useAuth } from './ContextAPI'
import { FaBars, FaTimes, FaRocket, FaGem } from 'react-icons/fa'
import logo from "../assets/logo.png"
import Image from 'next/image'

export default function Header() {
  const router = useRouter()
  const { user, logout, loading } = useAuth() 
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    setMenuOpen(false)
    router.push("/Login")
  }

  return (
    <header className="top-0 left-0 w-full z-50 fixed">
      {/* Liquid Glow Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#7d68ff]/20 dark:bg-[#7d68ff]/25 blur-3xl rounded-full animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-[#00e1ff]/20 dark:bg-[#00e1ff]/25 blur-3xl rounded-full animate-ping" />
      </div>

      {/* Navbar Container */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-black/60 border-b border-gray-200/60 dark:border-gray-700/40 shadow-sm">
        <div className="flex justify-between items-center container mx-auto py-4 px-6 relative">
          
          {/* Logo */}
          <div 
            onClick={() => router.push("/")}  
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform  hover:cursor-pointer"
          >
            <Image src={logo} alt="logo" className="w-11 h-11" />
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#7d68ff] to-[#00e1ff] bg-clip-text text-transparent">
              MiniSmart.AI
            </h1>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-10 font-medium">
            <ScrollLink to="features" smooth duration={500} className="text-lg cursor-pointer hover:text-[#6C63FF] transition-colors flex items-center gap-1  hover:cursor-pointer">
              Features
            </ScrollLink>
            <ScrollLink to="pricing" smooth duration={500} className="text-lg cursor-pointer hover:text-[#6C63FF] transition-colors flex items-center gap-1  hover:cursor-pointer">
              Pricing
            </ScrollLink>

            {user?.planSubscribed && (
              <Link href="/Model" className="text-lg hover:text-[#6C63FF] transition-colors  hover:cursor-pointer">
                AI Dashboard
              </Link>
            )}
          </nav>

          {/* Right Side (Login / User) */}
          <div className="hidden md:flex items-center gap-4 relative">
            {loading ? (
              <div className="w-20 h-10" />
            ) : user ? (
              <div className="relative">
                {/* User Avatar */}
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer border-2 border-[#7d68ff] 
                    bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] text-white font-bold 
                    hover:scale-110 transition-transform shadow-md"
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-3 z-50 animate-fadeIn">
                    <p className="px-5 py-2 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                      Hi, {user.name}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full font-semibold text-left px-5 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition  hover:cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push("/Login")}
                  className="py-2 px-6 rounded-full bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] 
                    text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform hover:cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/newSignup")}
                  className="py-2 px-6 rounded-full border-2 border-[#7d68ff] dark:border-[#6be0ff] 
                    text-[#7d68ff] dark:text-[#6be0ff] text-lg font-semibold hover:bg-[#7d68ff] hover:text-white 
                    dark:hover:bg-[#6be0ff] transition-all hover:cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="py-10 md:hidden flex flex-col gap-4 px-6 pb-6 bg-white/95 dark:bg-black/90 border-t border-gray-200 dark:border-gray-800 shadow-lg animate-slideDown">
            <ScrollLink to="features" smooth duration={500} onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-[#6C63FF] transition-colors flex items-center gap-1">
              Features
            </ScrollLink>
            <ScrollLink to="pricing" smooth duration={500} onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-[#6C63FF] transition-colors flex items-center gap-1">
              Pricing
            </ScrollLink>

            {user?.planSubscribed && (
              <Link href="/Model" className="text-lg hover:text-[#6C63FF] transition-colors">
                AI Dashboard
              </Link>
            )}

            {loading ? null : user ? (
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-medium text-gray-800 dark:text-gray-200">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="py-2 px-6 rounded-lg bg-red-500 text-white text-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={() => { router.push("/Login"); setMenuOpen(false) }}
                  className="py-2 px-6 rounded-lg bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] 
                    text-white text-lg font-semibold hover:scale-105 transition-transform"
                >
                  Login
                </button>
                <button
                  onClick={() => { router.push("/newSignup"); setMenuOpen(false) }}
                  className="py-2 px-6 rounded-lg border-2 border-[#7d68ff] dark:border-[#6be0ff] 
                    text-[#7d68ff] dark:text-[#6be0ff] text-lg font-semibold hover:bg-[#7d68ff] hover:text-white 
                    dark:hover:bg-[#6be0ff] transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
