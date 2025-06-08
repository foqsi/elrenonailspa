import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { name, sort_order, salon_id } = await req.json();

  if (!name || !salon_id) {
    return new Response('Missing category name or salon ID', { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('categories')
    .insert([{ name, sort_order, salon_id }]);

  if (error) {
    console.error('Insert error:', error);
    return new Response('Failed to add category', { status: 500 });
  }

  return new Response('Category added', { status: 200 });
}
