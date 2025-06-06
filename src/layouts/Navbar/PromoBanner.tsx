'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SALON_ID } from '@/lib/constants';

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
        .eq('salon_id', SALON_ID)
        .order('updated_at', { ascending: false });

      if (data) setPromos(data);
    };

    fetchPromos();
  }, []);

  if (!promos.length) {
    return (
      <div className="w-full bg-red-600 text-white py-2 fixed z-[60]">
        <div className="flex justify-center">
          <span className="text-xl animate-pulse">Loading promo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-red-600 text-white overflow-hidden fixed z-[60]">
      <div className="animate-marquee flex whitespace-nowrap font-semibold">
        {[...promos, ...promos].map((promo, index) => (
          <span key={`${promo.id}-${index}`} className="mx-8 text-xl">
            {promo.text}
          </span>
        ))}
      </div>
    </div>
  );
}
