'use client';

import { useEffect, useState } from 'react';
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

const tabs: { key: AdminTab; label: string }[] = [
  { key: 'gallery', label: 'Gallery' },
  { key: 'services', label: 'Services' },
  { key: 'promo', label: 'Banner' },
  { key: 'customers', label: 'Customers' },
];

const CustomersSubTabs: { key: CustomersSubTab; label: string }[] = [
  { key: 'appointments', label: 'Appointments' },
  { key: 'customers', label: 'Customers' },
  { key: 'messages', label: 'Messages' },
];

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('gallery');
  const [servicesSubTab, setServicesSubTab] = useState<ServicesSubTab>('services');
  const [galleryUpdated, setGalleryUpdated] = useState(false);
  const [customersSubTab, setCustomersSubTab] = useState<CustomersSubTab>('appointments');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      window.location.href = '/login';
    } else {
      setLoggedIn(true);

      const savedTab = localStorage.getItem('adminTab') as AdminTab;
      if (savedTab && tabs.some((tab) => tab.key === savedTab)) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminTab');
    window.location.href = '/login';
  };

  const handleTabChange = (tabKey: AdminTab) => {
    setActiveTab(tabKey);
    localStorage.setItem('adminTab', tabKey);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Throbber size={48} />
      </div>
    );
  }


  return (
    <main className="min-h-screen pt-8 max-w-6xl mx-auto bg-gray-100/50 pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 to-transparent py-4 px-4 backdrop-blur-sm rounded-md flex justify-between items-center shadow-md mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-red-500">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex justify-center mb-4 border-b gap-1 text-sm md:text-lg">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              handleTabChange(tab.key);
              setServicesSubTab('services');
              setCustomersSubTab('appointments');
            }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors duration-200 bg-gray-100 ${activeTab === tab.key
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-red-500'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Tabs for Services */}
      {activeTab === 'services' && (
        <section className="px-4">
          <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">Manage Services</h2>
          <div className="flex justify-center gap-2 mb-6">
            {(['services', 'categories'] as ServicesSubTab[]).map((key) => (
              <button
                key={key}
                onClick={() => setServicesSubTab(key)}
                className={`px-3 py-1 rounded-md font-medium transition ${servicesSubTab === key
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {key === 'services' ? 'Edit Services' : 'Edit Categories'}
              </button>
            ))}
          </div>
          {servicesSubTab === 'services' && <ServicesEditor />}
          {servicesSubTab === 'categories' && <CategoryEditor />}
        </section>
      )}

      {/* Tab Panels */}
      <div className="space-y-12 flex justify-center ">
        {activeTab === 'gallery' && (
          <section className="px-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">Upload Gallery Images</h2>
            <GalleryUploader onUploadComplete={() => setGalleryUpdated((v) => !v)} />
            <GalleryManager refreshKey={galleryUpdated} />
          </section>
        )}

        {activeTab === 'promo' && (
          <section className="px-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">Edit Promo Banner</h2>
            <PromoBannerEditor />
          </section>
        )}

        {activeTab === 'customers' && (
          <section className="px-4 w-full">
            <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">Customers</h2>

            {/* Customers Sub Tabs */}
            <div className="flex justify-center gap-2 mb-6">
              {CustomersSubTabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCustomersSubTab(key)}
                  className={`px-3 py-1 rounded-md font-medium transition ${customersSubTab === key ? 'bg-red-600 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {customersSubTab === 'appointments' && <AppointmentsViewer />}
            {customersSubTab === 'customers' && <CustomerEditor />}
            {customersSubTab === 'messages' && <MessagesPanel />}
          </section>
        )}

      </div>
    </main>

  );
}
