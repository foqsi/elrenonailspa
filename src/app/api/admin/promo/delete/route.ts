import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { id } = await req.json();

  const { error } = await supabaseAdmin
    .from('promo_banner')
    .delete()
    .eq('id', id);

  if (error) return new Response('Failed to delete', { status: 500 });
  return new Response('Deleted', { status: 200 });
}
