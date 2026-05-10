'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import FadeInDown from '@/components/animations/FadeInDown';
import FadeInUp from '@/components/animations/FadeInUp';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';
import { SALON_ID } from '@/lib/constants';

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  price_modifier?: string | null;
}

interface Category {
  id: number;
  name: string;
  sort_order?: number;
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchData() {
      const { data: categoriesRaw, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('salon_id', SALON_ID)
        .order('sort_order');

      if (catError) {
        console.error('Failed to fetch categories:', catError.message);
      }

      const { data: servicesRaw, error: servError } = await supabase
        .from('services')
        .select('id, name, description, price, price_modifier, category_id')
        .eq('salon_id', SALON_ID)
        .order('category_id');

      if (servError) {
        console.error('Failed to fetch services:', servError.message);
      }

      setCategories(categoriesRaw ?? []);
      setServices(servicesRaw ?? []);
      setLoading(false);
    }

    fetchData();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const grouped = categories.map((cat) => ({
    ...cat,
    services: services
      .filter((s) => s.category_id === cat.id)
      .sort((a, b) => a.price - b.price),
  }));

  if (loading) {
    return (
      <main className="min-h-screen pt-20 px-4 pb-20">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-6" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-16" />
          <div className="max-w-4xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-12 bg-gray-200 rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 px-4 pb-20">
      {/* Hero Section */}
      <FadeInDown>
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full">
            <span className="text-red-600 font-semibold text-sm">WHAT WE OFFER</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            From classic manicures to stunning nail art, we offer a wide range of professional
            services to keep your nails looking beautiful and healthy.
          </p>
        </div>
      </FadeInDown>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
        <FadeInLeft>
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">💅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Care</h3>
            <p className="text-gray-700 text-sm">Trained professionals using premium products</p>
          </div>
        </FadeInLeft>
        <FadeInUp>
          <div className="bg-gradient-to-br from-rose-50 to-red-50 p-6 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Affordable Pricing</h3>
            <p className="text-gray-700 text-sm">Quality services at competitive prices</p>
          </div>
        </FadeInUp>
        <FadeInRight>
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">😊</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Customer First</h3>
            <p className="text-gray-700 text-sm">Personalized service for your unique style</p>
          </div>
        </FadeInRight>
      </div>

      {/* Services Accordion */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {grouped.map((category) => (
            <section key={category.id}>
              <FadeInUp>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-red-50 hover:from-gray-100 hover:to-red-100 border-2 border-red-200 rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-lg group"
                  aria-expanded={expandedCategories.has(category.id)}
                >
                  <h2 className="text-2xl font-bold text-red-700 group-hover:text-red-800">
                    {category.name}
                  </h2>
                  <span
                    className={`text-3xl text-red-600 transition-transform duration-300 ${expandedCategories.has(category.id) ? 'rotate-180' : ''
                      }`}
                  >
                    ▼
                  </span>
                </button>
              </FadeInUp>

              <div
                className={`border-2 border-t-0 border-red-200 rounded-b-2xl bg-white overflow-hidden transition-all duration-300 ${expandedCategories.has(category.id)
                  ? 'max-h-[2000px] opacity-100'
                  : 'max-h-0 opacity-0'
                  }`}
              >
                {category.services.length === 0 ? (
                  <p className="text-gray-500 italic p-6">No services listed.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {category.services.map((service, index) => (
                      <FadeInRight key={service.id} delay={index * 0.05}>
                        <li className="py-5 px-6 flex flex-col md:flex-row justify-between gap-3 hover:bg-red-50 transition-colors">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {service.name}
                            </h3>
                            {service.description && (
                              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                {service.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 md:ml-4 mt-2 md:mt-0">
                            <span className="text-2xl font-bold text-red-600 font-mono">
                              ${service.price.toFixed(2)}
                            </span>
                            {service.price_modifier && (
                              <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                +
                              </span>
                            )}
                          </div>
                        </li>
                      </FadeInRight>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <FadeInUp>
        <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 rounded-2xl p-12 shadow-xl text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Pamper Your Nails?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Browse our services and book your appointment today. Our expert technicians
            are ready to transform your look!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/appointment"
              className="inline-block bg-white text-red-600 font-bold py-4 px-8 rounded-lg hover:bg-red-50 transition-colors"
            >
              Book Appointment
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 rounded-lg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </FadeInUp>
    </main>
  );
}
