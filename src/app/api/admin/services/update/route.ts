import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';

export async function POST(req: Request) {
  const { id, name, price, description } = await req.json();

  const { error } = await supabaseAdmin
    .from('services')
    .update({ name, price, description })
    .eq('id', id)
    .eq('salon_id', SALON_ID);

  if (error) return new Response('Failed to update service', { status: 500 });
  return new Response('Service updated');
}
