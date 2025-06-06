import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';

export async function POST(req: Request) {
  const { text } = await req.json();

  const { error } = await supabaseAdmin
    .from('promo_banner')
    .insert([{ text, enabled: false, salon_id: SALON_ID }]);

  if (error) return new Response('Failed to create', { status: 500 });
  return new Response('Created', { status: 200 });
}