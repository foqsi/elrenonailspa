import { supabase } from '@/lib/supabaseClient';
import { GalleryItem } from './types';

export async function fetchGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }

  return data || [];
}
