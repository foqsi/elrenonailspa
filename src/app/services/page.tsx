export const dynamic = 'force-dynamic';

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

async function getServices(): Promise<{ categories: Category[]; services: Service[] }> {
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

  return {
    categories: categoriesRaw ?? [],
    services: servicesRaw ?? [],
  };
}


export default async function ServicesPage() {
  const { categories, services } = await getServices();

  const grouped = categories.map((cat) => ({
    ...cat,
    services: services
      .filter((s) => s.category_id === cat.id)
      .sort((a, b) => a.price - b.price),
  }));

  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      <FadeInDown>
        <h1 className="text-4xl font-bold text-center text-red-600 mb-16">
          Our Services
        </h1>
      </FadeInDown>

      <div className="space-y-16">
        {grouped.map((category) => (
          <section key={category.id}>
            <FadeInUp>
              <h2 className="text-2xl font-bold text-red-700 mb-4 border-b border-red-200 pb-1">
                {category.name}
              </h2>
            </FadeInUp>

            {category.services.length === 0 ? (
              <p className="text-gray-500 italic">No services listed.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {category.services.map((service, index) => (
                  <FadeInRight key={service.id} delay={index * 0.05}>
                    <li className="py-4 flex flex-col md:flex-row justify-between gap-2">
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
          </section>
        ))}
      </div>
    </main>
  );
}
