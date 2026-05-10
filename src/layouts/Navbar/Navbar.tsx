'use client';

import Logo from '../../components/Logo';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <nav className="bg-gradient-to-r from-white to-gray-50 shadow-lg fixed top-0 left-0 w-full z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.location.href = '/';
              }
            }}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Logo className="w-14 h-14" />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-800">
                El Reno
              </span>
              <span className="text-xl font-bold text-red-600 ml-1">
                Nail Spa
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLinks pathname={pathname} />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/appointment"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Book Now
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(true)} className="text-gray-700 hover:text-red-600 focus:outline-none transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-Out Sidebar and Overlay */}
      <div className={`fixed inset-0 z-[70] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-40' : 'opacity-0'}`}
        ></div>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`absolute top-0 right-0 w-64 h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl p-6 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-red-600 absolute top-4 right-4 focus:outline-none transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mt-16 space-y-2">
            <NavLinks onClick={() => setIsOpen(false)} pathname={pathname} mobile={true} />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/appointment"
              onClick={() => setIsOpen(false)}
              className="block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all duration-300"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLinks({
  onClick,
  pathname,
  mobile = false
}: {
  onClick?: () => void,
  pathname: string,
  mobile?: boolean
}) {
  const navItems = [
    { href: '/', label: 'Home', icon: 'fas fa-home' },
    { href: '/services', label: 'Services', icon: 'fas fa-spa' },
    { href: '/gallery', label: 'Gallery', icon: 'fas fa-images' },
    { href: '/appointment', label: 'Appointments', icon: 'fas fa-calendar-check' },
    { href: '/contact', label: 'Contact', icon: 'fas fa-envelope' },
  ];

  if (mobile) {
    return (
      <>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${pathname === item.href
                ? 'bg-red-100 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
              }`}
          >
            <i className={`${item.icon} text-lg`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={`relative font-medium transition-colors duration-300 ${pathname === item.href
              ? 'text-red-600'
              : 'text-gray-700 hover:text-red-600'
            } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-300 ${pathname === item.href ? 'after:w-full' : 'after:w-0 hover:after:w-full'
            }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
