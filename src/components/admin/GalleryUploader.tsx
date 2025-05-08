'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { applyLogoToImage } from '@/utils/applyLogoToImage';

const logoPath = '/logo.png';

export default function GalleryUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

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
        alert('Upload failed: ' + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('gallery').insert([
        {
          image_url: urlData.publicUrl,
          caption,
          featured: false,
        },
      ]);

      if (insertError) {
        console.error('Insert error:', insertError);
        alert('Failed to save to database: ' + insertError.message);
      } else {
        alert('Image uploaded successfully!');
        setFile(null);
        setCaption('');
      }
    } catch (err) {
      console.error('Processing error:', err);
      alert('Failed to process image.');
    }

    setUploading(false);
  };

  return (
    <div className="max-w-md bg-white p-6 shadow rounded">
      <h2 className="text-lg font-bold mb-4">Upload Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
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
