'use client';

import { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FaBullhorn,
  FaCalendarCheck,
  FaChevronUp,
  FaConciergeBell,
  FaImages,
  FaSignOutAlt,
  FaUsers,
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

type AdminTabConfig = {
  id: AdminTab;
  label: string;
  description: string;
  icon: IconType;
};

const adminTabs: AdminTabConfig[] = [
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Upload and manage salon photos',
    icon: FaImages,
  },
  {
    id: 'services',
    label: 'Services',
    description: 'Edit services and categories',
    icon: FaConciergeBell,
  },
  {
    id: 'promo',
    label: 'Banner',
    description: 'Update promotional messages',
    icon: FaBullhorn,
  },
  {
    id: 'customers',
    label: 'Customers',
    description: 'Appointments, customers, and messages',
    icon: FaUsers,
  },
];

const validAdminTabs: AdminTab[] = ['gallery', 'services', 'promo', 'customers'];

function isAdminTab(value: string | null): value is AdminTab {
  return value !== null && validAdminTabs.includes(value as AdminTab);
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('gallery');
  const [servicesSubTab, setServicesSubTab] = useState<ServicesSubTab>('services');
  const [customersSubTab, setCustomersSubTab] =
    useState<CustomersSubTab>('appointments');
  const [galleryUpdated, setGalleryUpdated] = useState(false);

  const [openMenu, setOpenMenu] = useState<null | 'services' | 'customers'>(
    null
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    setLoggedIn(true);

    const savedTab = localStorage.getItem('adminTab');
    if (isAdminTab(savedTab)) {
      setActiveTab(savedTab);
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

  const scrollToDashboardTop = () => {
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setOpenMenu(null);
    localStorage.setItem('adminTab', tab);

    if (tab === 'services') {
      setServicesSubTab('services');
    }

    if (tab === 'customers') {
      setCustomersSubTab('appointments');
    }

    scrollToDashboardTop();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminTab');
    window.location.href = '/login';
  };

  const activeTabConfig = adminTabs.find((tab) => tab.id === activeTab);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-red-50">
        <Throbber size={48} />
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-red-50/60 pt-8 px-4 pb-32 scroll-smooth">
        <div ref={topRef} className="scroll-mt-8" />

        <div className="max-w-6xl mx-auto">
          <section className="mb-8 overflow-hidden rounded-3xl border border-red-100 bg-white shadow-xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-red-700 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-lg"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>

            <div className="hidden md:grid grid-cols-1 gap-3 p-4 md:grid-cols-4 md:p-5">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cx(
                      'group rounded-2xl border-2 p-4 text-left transition-all duration-300',
                      isActive
                        ? 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/60 hover:shadow-md'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cx(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                          isActive
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600'
                        )}
                      >
                        <Icon className="text-lg" />
                      </div>

                      <div>
                        <h2
                          className={cx(
                            'font-bold transition-colors',
                            isActive
                              ? 'text-red-700'
                              : 'text-gray-900 group-hover:text-red-700'
                          )}
                        >
                          {tab.label}
                        </h2>

                        <p className="mt-1 hidden text-xs leading-relaxed text-gray-500 lg:block">
                          {tab.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {activeTabConfig && (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              {activeTab === 'services' && (
                <div className="hidden md:flex rounded-xl border border-red-100 bg-red-50 p-1">
                  <button
                    onClick={() => {
                      setServicesSubTab('services');
                      scrollToDashboardTop();
                    }}
                    className={cx(
                      'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                      servicesSubTab === 'services'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-gray-700 hover:bg-white hover:text-red-700'
                    )}
                  >
                    Edit Services
                  </button>

                  <button
                    onClick={() => {
                      setServicesSubTab('categories');
                      scrollToDashboardTop();
                    }}
                    className={cx(
                      'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                      servicesSubTab === 'categories'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-gray-700 hover:bg-white hover:text-red-700'
                    )}
                  >
                    Categories
                  </button>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="hidden md:flex rounded-xl border border-red-100 bg-red-50 p-1">
                  <button
                    onClick={() => {
                      setCustomersSubTab('appointments');
                      scrollToDashboardTop();
                    }}
                    className={cx(
                      'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                      customersSubTab === 'appointments'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-gray-700 hover:bg-white hover:text-red-700'
                    )}
                  >
                    Appointments
                  </button>

                  <button
                    onClick={() => {
                      setCustomersSubTab('customers');
                      scrollToDashboardTop();
                    }}
                    className={cx(
                      'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                      customersSubTab === 'customers'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-gray-700 hover:bg-white hover:text-red-700'
                    )}
                  >
                    Customers
                  </button>

                  <button
                    onClick={() => {
                      setCustomersSubTab('messages');
                      scrollToDashboardTop();
                    }}
                    className={cx(
                      'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                      customersSubTab === 'messages'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-gray-700 hover:bg-white hover:text-red-700'
                    )}
                  >
                    Messages
                  </button>
                </div>
              )}
            </div>
          )}

          <section className="rounded-3xl border border-red-100 bg-white p-4 shadow-xl md:p-6">
            {activeTab === 'services' && (
              <div>
                <SectionTitle
                  title={
                    servicesSubTab === 'services'
                      ? 'Manage Services'
                      : 'Manage Categories'
                  }
                  description={
                    servicesSubTab === 'services'
                      ? 'Add, update, and organize service details and pricing.'
                      : 'Create and sort the categories shown on the services page.'
                  }
                />

                {servicesSubTab === 'services' && <ServicesEditor />}
                {servicesSubTab === 'categories' && <CategoryEditor />}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <SectionTitle
                  title="Upload Gallery Images"
                  description="Add new salon photos and manage existing gallery images."
                />

                <div className="space-y-8">
                  <GalleryUploader
                    onUploadComplete={() => setGalleryUpdated((v) => !v)}
                  />
                  <GalleryManager refreshKey={galleryUpdated} />
                </div>
              </div>
            )}

            {activeTab === 'promo' && (
              <div>
                <SectionTitle
                  title="Edit Promo Banner"
                  description="Control the promotional banner shown across the website."
                />

                <PromoBannerEditor />
              </div>
            )}

            {activeTab === 'customers' && (
              <div>
                <SectionTitle
                  title={
                    customersSubTab === 'appointments'
                      ? 'Appointments'
                      : customersSubTab === 'customers'
                        ? 'Customers'
                        : 'Messages'
                  }
                  description={
                    customersSubTab === 'appointments'
                      ? 'Review appointment requests and booking details.'
                      : customersSubTab === 'customers'
                        ? 'Search and manage customer records.'
                        : 'Read messages submitted through the website.'
                  }
                />

                {customersSubTab === 'appointments' && <AppointmentsViewer />}
                {customersSubTab === 'customers' && <CustomerEditor />}
                {customersSubTab === 'messages' && <MessagesPanel />}
              </div>
            )}
          </section>
        </div>
      </main>

      <nav
        ref={menuRef}
        className="md:hidden fixed bottom-0 left-0 z-50 w-full border-t border-red-100 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around gap-2">
          <MobileNavButton
            label="Gallery"
            icon={FaImages}
            active={activeTab === 'gallery'}
            onClick={() => handleTabChange('gallery')}
          />

          <MobileNavButton
            label="Banner"
            icon={FaBullhorn}
            active={activeTab === 'promo'}
            onClick={() => handleTabChange('promo')}
          />

          <div className="relative flex flex-1 justify-center">
            <MobileNavButton
              label="Services"
              icon={FaConciergeBell}
              active={activeTab === 'services'}
              hasMenu
              menuOpen={openMenu === 'services'}
              onClick={() =>
                setOpenMenu((prev) =>
                  prev === 'services' ? null : 'services'
                )
              }
            />

            {openMenu === 'services' && (
              <MobileDropdown>
                <MobileDropdownButton
                  active={activeTab === 'services' && servicesSubTab === 'services'}
                  onClick={() => {
                    setActiveTab('services');
                    setServicesSubTab('services');
                    setOpenMenu(null);
                    localStorage.setItem('adminTab', 'services');
                    scrollToDashboardTop();
                  }}
                >
                  Edit Services
                </MobileDropdownButton>

                <MobileDropdownButton
                  active={
                    activeTab === 'services' && servicesSubTab === 'categories'
                  }
                  onClick={() => {
                    setActiveTab('services');
                    setServicesSubTab('categories');
                    setOpenMenu(null);
                    localStorage.setItem('adminTab', 'services');
                    scrollToDashboardTop();
                  }}
                >
                  Categories
                </MobileDropdownButton>
              </MobileDropdown>
            )}
          </div>

          <div className="relative flex flex-1 justify-center">
            <MobileNavButton
              label="Customers"
              icon={FaUsers}
              active={activeTab === 'customers'}
              hasMenu
              menuOpen={openMenu === 'customers'}
              onClick={() =>
                setOpenMenu((prev) =>
                  prev === 'customers' ? null : 'customers'
                )
              }
            />

            {openMenu === 'customers' && (
              <MobileDropdown>
                <MobileDropdownButton
                  active={
                    activeTab === 'customers' &&
                    customersSubTab === 'appointments'
                  }
                  onClick={() => {
                    setActiveTab('customers');
                    setCustomersSubTab('appointments');
                    setOpenMenu(null);
                    localStorage.setItem('adminTab', 'customers');
                    scrollToDashboardTop();
                  }}
                >
                  Appointments
                </MobileDropdownButton>

                <MobileDropdownButton
                  active={
                    activeTab === 'customers' && customersSubTab === 'customers'
                  }
                  onClick={() => {
                    setActiveTab('customers');
                    setCustomersSubTab('customers');
                    setOpenMenu(null);
                    localStorage.setItem('adminTab', 'customers');
                    scrollToDashboardTop();
                  }}
                >
                  Customers
                </MobileDropdownButton>

                <MobileDropdownButton
                  active={
                    activeTab === 'customers' && customersSubTab === 'messages'
                  }
                  onClick={() => {
                    setActiveTab('customers');
                    setCustomersSubTab('messages');
                    setOpenMenu(null);
                    localStorage.setItem('adminTab', 'customers');
                    scrollToDashboardTop();
                  }}
                >
                  Messages
                </MobileDropdownButton>
              </MobileDropdown>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 border-b border-red-100 pb-5 text-center">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function MobileNavButton({
  label,
  icon: Icon,
  active,
  hasMenu = false,
  menuOpen = false,
  onClick,
}: {
  label: string;
  icon: IconType;
  active: boolean;
  hasMenu?: boolean;
  menuOpen?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'flex flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-semibold transition-all duration-300',
        active
          ? 'bg-red-50 text-red-600'
          : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'
      )}
    >
      <Icon className="mb-1 text-xl" />

      <span className="flex items-center gap-1">
        {label}
        {hasMenu && (
          <FaChevronUp
            className={cx(
              'text-[10px] transition-transform duration-300',
              menuOpen ? 'rotate-180' : 'rotate-0'
            )}
          />
        )}
      </span>
    </button>
  );
}

function MobileDropdown({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bottom-20 left-1/2 w-56 -translate-x-1/2 rounded-2xl border border-red-100 bg-white p-2 text-base shadow-2xl">
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function MobileDropdownButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all',
        active
          ? 'bg-red-600 text-white'
          : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
      )}
    >
      {children}
    </button>
  );
}