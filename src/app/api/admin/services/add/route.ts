import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';

export async function POST(req: Request) {
  const { name, price, description, category_id, price_modifier } = await req.json();

  const { error } = await supabaseAdmin
    .from('services')
    .insert([{
      name,
      price,
      description,
      category_id,
      price_modifier: price_modifier ?? false,
      salon_id: SALON_ID,
    }]);

  if (error) {
    console.error('Add service error:', error.message);
    return new Response(error.message, { status: 500 });
  }

  return new Response('Service added', { status: 200 });
}
