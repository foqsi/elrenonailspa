'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { applyLogoToImage } from '@/utils/applyLogoToImage';
import toast from 'react-hot-toast';

const logoPath = '/logo.png';

export default function GalleryUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }

    setUploading(true);

    try {
      const processedBlob = await applyLogoToImage(file, logoPath, 0.25);
      const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();
      const filePath = `gallery/${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, processedBlob);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Upload failed: ' + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const res = await fetch('/api/admin/gallery/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: urlData.publicUrl,
          caption,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Insert error:', errText);
        toast.error('Failed to save to database: ' + errText);
      } else {
        toast.success('Image uploaded successfully!');
        setFile(null);
        setCaption('');
        setPreviewUrl(null);
        uploaderRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Processing error:', err);
      toast.error('Failed to process image.');
    }

    setUploading(false);
  };

  return (
    <div
      ref={uploaderRef}
      className="max-w-md bg-white p-6 shadow rounded scroll-mt-24"
    >
      <h2 className="text-lg font-bold mb-4">Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-48 object-contain rounded border mb-4"
        />
      )}

      <input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
}
