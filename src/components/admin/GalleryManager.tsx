'use client';

import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SALON_ID } from '@/lib/constants';

interface GalleryItem {
  id: number;
  image_url: string;
  caption: string | null;
  uploaded_at: string;
}

interface GalleryManagerProps {
  refreshKey?: boolean;
}

export default function GalleryManager({ refreshKey }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [refreshKey]);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('salon_id', SALON_ID)
      .order('uploaded_at', { ascending: false });

    if (!error && data) setImages(data);
    setLoading(false);
  };

  const handleDelete = async (id: number, url: string) => {
    const confirm = window.confirm('Are you sure you want to delete this image?');
    if (!confirm) return;

    const path = url.split('/gallery/')[1];

    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([`gallery/${path}`]);

    if (storageError) {
      toast.error('Failed to delete from storage.');
      console.error(storageError);
      return;
    }

    const res = await fetch('/api/admin/gallery/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      toast.error('Failed to delete from database: ' + errText);
      return;
    }

    toast.success('Image deleted.');
    await fetchImages();
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Manage Uploaded Images</h2>
      {loading ? (
        <p>Loading images...</p>
      ) : images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="max-h-[600px] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-white shadow rounded p-2 text-center">
              <img
                src={img.image_url}
                alt={img.caption ?? 'Uploaded image'}
                className="w-full h-40 object-contain bg-gray-100 rounded mb-2"
              />
              <p className="text-sm text-gray-700 mb-2 truncate">
                {img.caption || `Image ID: ${img.id}`}
              </p>
              <button
                onClick={() => handleDelete(img.id, img.image_url)}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
