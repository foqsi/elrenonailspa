import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';

export async function POST(req: Request) {
  const { id, text, enabled } = await req.json();

  const { error } = await supabaseAdmin
    .from('promo_banner')
    .update({ text, enabled, updated_at: new Date() })
    .eq('id', id)
    .eq('salon_id', SALON_ID);

  if (error) return new Response('Failed to update', { status: 500 });
  return new Response('Updated', { status: 200 });
}
