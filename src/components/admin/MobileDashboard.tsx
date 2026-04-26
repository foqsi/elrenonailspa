'use client'

import { useState, useRef, useEffect } from 'react'
import {
  FaImages,
  FaConciergeBell,
  FaUsers,
  FaBullhorn,
} from 'react-icons/fa'

export default function MobileDashboard() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMenu = (menu: string) => {
    setOpenMenu(prev => (prev === menu ? null : menu))
  }

  return (
    <nav className="bg-background border-t border-muted shadow-md px-6 py-3 flex justify-around text-muted relative z-50">

      {/* Gallery */}
      <a href="/dashboard/gallery" className="flex flex-col items-center text-xs text-white">
        <FaImages className="text-xl" />
        Gallery
      </a>

      {/* Banner */}
      <a href="/dashboard/banner" className="flex flex-col items-center text-xs text-white">
        <FaBullhorn className="text-xl" />
        Banner
      </a>

      {/* Services Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => toggleMenu('services')}
          className="flex flex-col items-center text-xs text-white"
        >
          <FaConciergeBell className="text-xl" />
          Services
        </button>

        {openMenu === 'services' && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-background border border-muted rounded-md shadow-lg text-md p-2 space-y-2 w-44 z-50">
            <a href="/dashboard/services" className="block hover:text-accent text-gray-500">
              Edit Services
            </a>
            <a href="/dashboard/services/categories" className="block hover:text-accent text-gray-500">
              Categories
            </a>
          </div>
        )}
      </div>

      {/* Customers Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('customers')}
          className="flex flex-col items-center text-xs text-white"
        >
          <FaUsers className="text-xl" />
          Customers
        </button>

        {openMenu === 'customers' && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-background border border-muted rounded-md shadow-lg text-md p-2 space-y-2 w-44 z-50">
            <a href="/dashboard/appointments" className="block hover:text-accent text-gray-500">
              Appointments
            </a>
            <a href="/dashboard/customers" className="block hover:text-accent text-gray-500">
              Customers
            </a>
            <a href="/dashboard/messages" className="block hover:text-accent text-gray-500">
              Messages
            </a>
          </div>
        )}
      </div>

    </nav>
  )
}