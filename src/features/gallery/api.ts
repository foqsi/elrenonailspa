import { supabase } from '@/lib/supabaseClient';
import { GalleryItem } from './types';
import { SALON_ID } from '@/lib/constants';

export async function fetchGallery(): Promise<GalleryItem[]> {
  return fetchGalleryById(SALON_ID);
}

export async function fetchGalleryById(salonId: string): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('salon_id', salonId)
    .order('uploaded_at', { ascending: false });

  return error ? [] : data || [];
}