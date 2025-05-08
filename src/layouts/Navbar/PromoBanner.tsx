'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PromoData {
  id: string;
  text: string;
  enabled: boolean;
}

export default function PromoBanner() {
  const [promos, setPromos] = useState<PromoData[]>([]);

  useEffect(() => {
    const fetchPromos = async () => {
      const { data } = await supabase
        .from('promo_banner')
        .select('*')
        .eq('enabled', true)
        .order('updated_at', { ascending: false });

      if (data) setPromos(data);
    };

    fetchPromos();
  }, []);

  if (!promos.length) return null;

  return (
    <div className="w-full bg-red-600 text-white overflow-hidden fixed z-[60]">
      <div className="animate-marquee flex py-2 md:text-base font-semibold whitespace-nowrap">
        {promos.map((promo) => (
          <span key={promo.id} className="mx-8 text-xl">
            {promo.text}
          </span>
        ))}
      </div>
    </div>
  );
}
