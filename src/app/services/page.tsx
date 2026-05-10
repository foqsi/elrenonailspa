'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import FadeInDown from '@/components/animations/FadeInDown';
import FadeInUp from '@/components/animations/FadeInUp';
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
      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-16" />
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
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
    <main className="max-w-4xl mx-auto px-4 py-20">
      <FadeInDown>
        <h1 className="text-4xl font-bold text-center text-red-600 mb-16">
          Our Services
        </h1>
      </FadeInDown>

      <div className="space-y-4">
        {grouped.map((category) => (
          <section key={category.id}>
            <FadeInUp>
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                aria-expanded={expandedCategories.has(category.id)}
              >
                <h2 className="text-2xl font-bold text-red-700">
                  {category.name}
                </h2>
                <span
                  className={`text-2xl text-red-600 transition-transform ${expandedCategories.has(category.id) ? 'rotate-180' : ''
                    }`}
                >
                  ▼
                </span>
              </button>
            </FadeInUp>

            <div
              className={`border border-t-0 border-red-200 rounded-b-lg bg-white overflow-hidden transition-all duration-300 ${expandedCategories.has(category.id)
                  ? 'max-h-[2000px] opacity-100'
                  : 'max-h-0 opacity-0'
                }`}
            >
              {category.services.length === 0 ? (
                <p className="text-gray-500 italic p-4">No services listed.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {category.services.map((service, index) => (
                    <FadeInRight key={service.id} delay={index * 0.05}>
                      <li className="py-4 px-4 flex flex-col md:flex-row justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <div className="text-red-600 text-lg font-bold md:ml-4 mt-1 md:mt-0 w-24 text-left font-mono">
                          ${service.price.toFixed(2)}{service.price_modifier ? '+' : ''}
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
    </main>
  );
}
