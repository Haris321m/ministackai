'use client'

import React, { useState } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useAuth } from './ContextAPI'
import { FaBars, FaTimes } from 'react-icons/fa'
import logo from "../assets/logo.png";
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
    <header className="top-0 left-0 w-full z-50 backdrop-blur-md bg-white/60 dark:bg-black/60 border-b border-gray-200 dark:border-gray-800 shadow-sm fixed">
      <div className="flex justify-between items-center container mx-auto py-4 px-6 relative">

        {/* Logo */}
        <div onClick={() => router.push("/")}  className='flex justify-center items-center gap-1'>
          <Image src={logo} alt='logo' className='w-12 h-12'></Image>
          <h1
            className="text-2xl font-extrabold cursor-pointer text-btnBg dark:text-white "
          >
            MiniSmart.Ai
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-10 font-medium">
          <ScrollLink to="features" smooth duration={500} className="text-lg cursor-pointer hover:text-[#6C63FF] transition-colors">Features</ScrollLink>
          <ScrollLink to="pricing" smooth duration={500} className="text-lg cursor-pointer hover:text-[#6C63FF] transition-colors">Pricing</ScrollLink>
          {/* <ScrollLink to="faqs" smooth duration={500} className="text-lg cursor-pointer hover:text-[#6C63FF] transition-colors">FAQs</ScrollLink> */}

          {user?.planSubscribed && (
            <Link href="/Model" className="text-lg hover:text-[#6C63FF] transition-colors">
              AI Dashboard
            </Link>
          )}
        </nav>
        <div className="hidden md:flex items-center relative">
          {loading ? (
            <div className="w-20 h-10" />
          ) : user ? (
            <div className="flex gap-4 items-center">
              <div className="relative">
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-2 border-[#7d68ff] bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] text-white font-bold hover:scale-105 transition-transform"
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fadeIn">
                    <p className="px-4 py-2 dark:text-gray-300">Hi, {user.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full font-bold text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => router.push("/Login")}
              className="py-2 px-6 rounded-lg bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] text-white hover:cursor-pointer text-lg font-semibold hover:opacity-90 transition"
            >
              Login
            </button>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-5 pb-5 bg-white/90 dark:bg-black/90 border-t border-gray-200 dark:border-gray-800 shadow-lg animate-slideDown">
          <ScrollLink to="features" smooth duration={500} onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-[#6C63FF] transition-colors">Features</ScrollLink>
          <ScrollLink to="pricing" smooth duration={500} onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-[#6C63FF] transition-colors">Pricing</ScrollLink>
          {/* <ScrollLink to="faqs" smooth duration={500} onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-[#6C63FF] transition-colors">FAQs</ScrollLink> */}

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
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => { router.push("/Login"); setMenuOpen(false) }}
                className="py-2 px-6 rounded-lg bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] text-white hover:cursor-pointer text-lg font-semibold hover:opacity-90 transition"
              >
                Login
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
