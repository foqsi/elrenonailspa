'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { applyLogoToImage } from '@/utils/applyLogoToImage';
import toast from 'react-hot-toast';

const logoPath = '/logo.png';

export default function GalleryUploader({ onUploadComplete }: { onUploadComplete?: () => void }) {

  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const uploaderRef = useRef<HTMLDivElement>(null);


  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image.');
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }

        const processedBlob = await applyLogoToImage(file, logoPath, 0.25);
        const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();
        const filePath = `gallery/${Date.now()}-${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, processedBlob);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
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
          toast.error(`Failed to save ${file.name}: ${errText}`);
        } else {
          toast.success(`${file.name} uploaded successfully!`);
        }
      }

      setFiles([]);
      setCaption('');
      uploaderRef.current?.scrollIntoView({ behavior: 'smooth' });
      onUploadComplete?.();
    } catch (err) {
      console.error('Processing error:', err);
      toast.error('Something went wrong while uploading.');
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
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        className="mb-4"
      />


      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {files.map((f, i) => (
            <div key={i} className="border rounded overflow-hidden">
              <img
                src={URL.createObjectURL(f)}
                alt="Preview"
                className="w-full h-24 object-contain"
              />
            </div>
          ))}
        </div>
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
