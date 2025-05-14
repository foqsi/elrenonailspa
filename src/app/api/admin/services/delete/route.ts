import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { id } = await req.json();

  const { error } = await supabaseAdmin
    .from('services')
    .delete()
    .eq('id', id);

  if (error) return new Response('Failed to delete service', { status: 500 });
  return new Response('Service deleted');
}
