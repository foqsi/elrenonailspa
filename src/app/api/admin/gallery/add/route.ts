import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';

export async function POST(req: Request) {
  const { image_url, caption } = await req.json();

  const { error } = await supabaseAdmin
    .from('gallery')
    .insert([{ image_url, caption, featured: false, salon_id: SALON_ID }]);

  if (error) {
    console.error('Add gallery error:', error.message);
    return new Response(error.message, { status: 500 });
  }

  return new Response('Added', { status: 200 });
}