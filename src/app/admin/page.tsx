'use client';

import { useEffect, useState } from 'react';
import GalleryUploader from '@/components/admin/GalleryUploader';
import ServicesEditor from '@/components/admin/ServicesEditor';
import PromoBannerEditor from '@/components/admin/PromoBannerEditor';
import GalleryManager from '@/components/admin/GalleryManager';
import Throbber from '@/components/Throbber';
import AppointmentsViewer from '@/components/admin/AppointmentViewer';
import CategoryEditor from '@/components/admin/CategoryEditor';

type AdminTab = 'gallery' | 'services' | 'promo' | 'appointments';
type ServicesSubTab = 'services' | 'categories';

const tabs: { key: AdminTab; label: string }[] = [
  { key: 'gallery', label: 'Gallery' },
  { key: 'services', label: 'Services' },
  { key: 'promo', label: 'Banner' },
  { key: 'appointments', label: 'Appointments' },
];


export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('gallery');
  const [servicesSubTab, setServicesSubTab] = useState<ServicesSubTab>('services');
  const [galleryUpdated, setGalleryUpdated] = useState(false);

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
    <main className="min-h-screen pt-20 px-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-red-600">Admin Dashboard</h1>
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
            }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors duration-200 ${activeTab === tab.key
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
        <div className="flex justify-center mb-4 gap-1">
          {(['services', 'categories'] as ServicesSubTab[]).map((key) => (
            <button
              key={key}
              onClick={() => setServicesSubTab(key)}
              className={`px-4 py-1 font-medium border-b-2 transition-colors duration-200 ${servicesSubTab === key
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-red-500'
                }`}
            >
              {key === 'services' ? 'Edit Services' : 'Edit Categories'}
            </button>
          ))}
        </div>
      )}

      {/* Tab Panels */}
      <div className="space-y-12 flex justify-center ">
        {activeTab === 'gallery' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-red-600">Upload Gallery Images</h2>
            <GalleryUploader onUploadComplete={() => setGalleryUpdated((v) => !v)} />
            <GalleryManager refreshKey={galleryUpdated} />
          </section>
        )}

        {activeTab === 'services' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-red-600">Manage Services</h2>
            {servicesSubTab === 'services' && <ServicesEditor />}
            {servicesSubTab === 'categories' && <CategoryEditor />}
          </section>
        )}

        {activeTab === 'promo' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-red-600">Edit Promo Banner</h2>
            <PromoBannerEditor />
          </section>
        )}

        {activeTab === 'appointments' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-red-600">View Appointments</h2>
            <AppointmentsViewer />
          </section>
        )}
      </div>
    </main>

  );
}
