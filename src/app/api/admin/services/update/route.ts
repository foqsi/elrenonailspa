import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { id, name, price, description } = await req.json();

  const { error } = await supabaseAdmin
    .from('services')
    .update({ name, price, description })
    .eq('id', id);

  if (error) return new Response('Failed to update service', { status: 500 });
  return new Response('Service updated');
}
