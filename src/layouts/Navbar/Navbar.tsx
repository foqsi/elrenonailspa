'use client';

import Logo from '../../components/Logo';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.location.href = '/';
              }
            }}
            className="flex items-center space-x-2"
          >
            <Logo className="w-16 h-16" />
            <span className="text-2xl font-bold text-gray-400">
              El Reno <span className="text-red-600">Nail Spa</span>
            </span>
          </Link>


          <div className="hidden md:flex space-x-6">
            <NavLinks />
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(true)} className="text-gray-700 focus:outline-none">
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
          className={`absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-6 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 absolute top-4 right-4 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mt-20 space-y-6 text-lg font-bold">
            <NavLinks onClick={() => setIsOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const linkClass = 'block md:inline text-gray-700 hover:text-red-600 text-lg';

  return (
    <>
      <Link href="/" className={linkClass} onClick={onClick}>Home</Link>
      <Link href="/services" className={linkClass} onClick={onClick}>Services</Link>
      <Link href="/gallery" className={linkClass} onClick={onClick}>Gallery</Link>
      <Link href="/appointment" className={linkClass} onClick={onClick}>Appointments</Link>
      <Link href="/contact" className={linkClass} onClick={onClick}>Contact</Link>
    </>
  );
}
