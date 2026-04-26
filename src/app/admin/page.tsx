'use client';

import { useEffect, useState, useRef } from 'react';
import {
  FaImages,
  FaConciergeBell,
  FaUsers,
  FaBullhorn,
} from 'react-icons/fa';

import GalleryUploader from '@/components/admin/GalleryUploader';
import ServicesEditor from '@/components/admin/ServicesEditor';
import PromoBannerEditor from '@/components/admin/PromoBannerEditor';
import GalleryManager from '@/components/admin/GalleryManager';
import Throbber from '@/components/Throbber';
import AppointmentsViewer from '@/components/admin/AppointmentViewer';
import CategoryEditor from '@/components/admin/CategoryEditor';
import CustomerEditor from '@/components/admin/CustomerEditor';
import MessagesPanel from '@/components/admin/MessagesPanel';

type AdminTab = 'gallery' | 'services' | 'promo' | 'customers';
type ServicesSubTab = 'services' | 'categories';
type CustomersSubTab = 'appointments' | 'customers' | 'messages';

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('gallery');
  const [servicesSubTab, setServicesSubTab] = useState<ServicesSubTab>('services');
  const [customersSubTab, setCustomersSubTab] = useState<CustomersSubTab>('appointments');
  const [galleryUpdated, setGalleryUpdated] = useState(false);

  const [openMenu, setOpenMenu] = useState<null | 'services' | 'customers'>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      window.location.href = '/login';
    } else {
      setLoggedIn(true);

      const savedTab = localStorage.getItem('adminTab') as AdminTab;
      if (savedTab) setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    localStorage.setItem('adminTab', tab);

    if (tab === 'services') setServicesSubTab('services');
    if (tab === 'customers') setCustomersSubTab('appointments');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminTab');
    window.location.href = '/login';
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Throbber size={48} />
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen pt-6 max-w-6xl mx-auto bg-gray-100/50 pb-28">
        {/* Header */}
        <div className="sticky top-0 z-10 py-4 px-4 backdrop-blur-sm flex justify-between items-center shadow-md mb-6 bg-white/70">
          <h1 className="text-2xl md:text-3xl font-bold text-red-500">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>

        {/* DESKTOP TABS */}
        <div className="hidden md:flex justify-center mb-4 border-b gap-1 text-sm md:text-lg">
          {['gallery', 'services', 'promo', 'customers'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab as AdminTab)}
              className={`px-4 py-2 font-medium border-b-2 transition bg-gray-100 ${activeTab === tab
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-red-500'
                }`}
            >
              {tab === 'promo'
                ? 'Banner'
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* DESKTOP SUBTABS */}
        {activeTab === 'services' && (
          <div className="hidden md:flex justify-center gap-2 mb-6">
            <button
              onClick={() => setServicesSubTab('services')}
              className={`px-3 py-1 rounded-md ${servicesSubTab === 'services'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300'
                }`}
            >
              Edit Services
            </button>

            <button
              onClick={() => setServicesSubTab('categories')}
              className={`px-3 py-1 rounded-md ${servicesSubTab === 'categories'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300'
                }`}
            >
              Categories
            </button>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="hidden md:flex justify-center gap-2 mb-6">
            <button
              onClick={() => setCustomersSubTab('appointments')}
              className={`px-3 py-1 rounded-md ${customersSubTab === 'appointments'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300'
                }`}
            >
              Appointments
            </button>

            <button
              onClick={() => setCustomersSubTab('customers')}
              className={`px-3 py-1 rounded-md ${customersSubTab === 'customers'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300'
                }`}
            >
              Customers
            </button>

            <button
              onClick={() => setCustomersSubTab('messages')}
              className={`px-3 py-1 rounded-md ${customersSubTab === 'messages'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300'
                }`}
            >
              Messages
            </button>
          </div>
        )}

        {/* CONTENT */}
        {activeTab === 'services' && (
          <section className="px-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">
              Manage Services
            </h2>
            {servicesSubTab === 'services' && <ServicesEditor />}
            {servicesSubTab === 'categories' && <CategoryEditor />}
          </section>
        )}

        {activeTab === 'gallery' && (
          <section className="px-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">
              Upload Gallery Images
            </h2>
            <GalleryUploader onUploadComplete={() => setGalleryUpdated(v => !v)} />
            <GalleryManager refreshKey={galleryUpdated} />
          </section>
        )}

        {activeTab === 'promo' && (
          <section className="px-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">
              Edit Promo Banner
            </h2>
            <PromoBannerEditor />
          </section>
        )}

        {activeTab === 'customers' && (
          <section className="px-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">
              Customers
            </h2>
            {customersSubTab === 'appointments' && <AppointmentsViewer />}
            {customersSubTab === 'customers' && <CustomerEditor />}
            {customersSubTab === 'messages' && <MessagesPanel />}
          </section>
        )}
      </main>

      {/* MOBILE DASHBOARD */}
      <nav
        ref={menuRef}
        className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 shadow-lg px-6 py-3 flex justify-around z-50"
      >
        {/* Gallery */}
        <button
          onClick={() => {
            handleTabChange('gallery');
            setOpenMenu(null);
          }}
          className={`flex flex-col items-center text-xs ${activeTab === 'gallery' ? 'text-red-500' : 'text-gray-300'
            }`}
        >
          <FaImages className="text-xl mb-1" />
          Gallery
        </button>

        {/* Banner */}
        <button
          onClick={() => {
            handleTabChange('promo');
            setOpenMenu(null);
          }}
          className={`flex flex-col items-center text-xs ${activeTab === 'promo' ? 'text-red-500' : 'text-gray-300'
            }`}
        >
          <FaBullhorn className="text-xl mb-1" />
          Banner
        </button>

        {/* Services */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={() =>
              setOpenMenu(prev => (prev === 'services' ? null : 'services'))
            }
            className={`flex flex-col items-center text-xs ${activeTab === 'services' ? 'text-red-500' : 'text-gray-300'
              }`}
          >
            <FaConciergeBell className="text-xl mb-1" />
            Services
          </button>

          {openMenu === 'services' && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-56 text-base p-2 space-y-1">
              <button
                onClick={() => {
                  handleTabChange('services');
                  setServicesSubTab('services');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 text-gray-300"
              >
                Edit Services
              </button>

              <button
                onClick={() => {
                  handleTabChange('services');
                  setServicesSubTab('categories');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 text-gray-300"
              >
                Categories
              </button>
            </div>
          )}
        </div>

        {/* Customers */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={() =>
              setOpenMenu(prev => (prev === 'customers' ? null : 'customers'))
            }
            className={`flex flex-col items-center text-xs ${activeTab === 'customers' ? 'text-red-500' : 'text-gray-300'
              }`}
          >
            <FaUsers className="text-xl mb-1" />
            Customers
          </button>

          {openMenu === 'customers' && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-56 text-base p-2 space-y-1">
              <button
                onClick={() => {
                  handleTabChange('customers');
                  setCustomersSubTab('appointments');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 text-gray-300"
              >
                Appointments
              </button>

              <button
                onClick={() => {
                  handleTabChange('customers');
                  setCustomersSubTab('customers');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 text-gray-300"
              >
                Customers
              </button>

              <button
                onClick={() => {
                  handleTabChange('customers');
                  setCustomersSubTab('messages');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 text-gray-300"
              >
                Messages
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}