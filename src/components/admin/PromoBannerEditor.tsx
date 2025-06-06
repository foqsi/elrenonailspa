'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { SALON_ID } from '@/lib/constants';

interface PromoBanner {
  id: string;
  text: string;
  enabled: boolean;
}

export default function PromoBannerEditor() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setLoading(true);
    const { data } = await supabase
      .from('promo_banner')
      .select('*')
      .eq('salon_id', SALON_ID)
      .order('updated_at', { ascending: false });
    if (data) setBanners(data);
    setLoading(false);
  }

  async function updateBanner(updated: PromoBanner) {
    const res = await fetch('/api/admin/promo/update', {
      method: 'POST',
      body: JSON.stringify({
        id: updated.id,
        text: updated.text,
        enabled: updated.enabled,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Update failed:', err);
      toast.error('Failed to update banner.');
      return;
    }

    toast.success('Banner updated!');
    fetchBanners();
  }

  async function deleteBanner(id: string) {
    const res = await fetch('/api/admin/promo/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Delete failed:', err);
      toast.error('Failed to delete banner.');
      return;
    }

    toast.success('Banner deleted.');
    fetchBanners();
  }

  async function createBanner() {
    if (!newText.trim()) {
      toast.error('Enter a banner message first.');
      return;
    }

    const res = await fetch('/api/admin/promo/create', {
      method: 'POST',
      body: JSON.stringify({ text: newText }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Create failed:', err);
      toast.error('Failed to create banner.');
      return;
    }

    toast.success('Banner created!');
    setNewText('');
    fetchBanners();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-bold mb-4">Create New Promo Banner</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Promo message"
            className="border p-2 rounded w-full"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button
            onClick={createBanner}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-bold mb-4">All Promo Banners</h3>
        <p className='text-md font-bold text-gray-500'>
          <span className='text-lg font-bold text-red-600'>*** </span>
          If you want to change the order, simply click save to move one to the top and refresh the page.
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : banners.length === 0 ? (
          <p className="text-sm text-gray-500">No banners found.</p>
        ) : (
          <div className="space-y-4">
            {banners.map((banner) => (
              <div key={banner.id} className="border p-4 rounded flex flex-col sm:flex-row sm:items-center gap-4">
                <input
                  type="text"
                  value={banner.text}
                  onChange={(e) =>
                    setBanners((prev) =>
                      prev.map((b) =>
                        b.id === banner.id ? { ...b, text: e.target.value } : b
                      )
                    )
                  }
                  className="flex-1 border p-2 rounded"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={banner.enabled}
                    onChange={(e) =>
                      setBanners((prev) =>
                        prev.map((b) =>
                          b.id === banner.id ? { ...b, enabled: e.target.checked } : b
                        )
                      )
                    }
                  />
                  Show
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateBanner(banner)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
