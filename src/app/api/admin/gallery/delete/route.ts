import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { id } = await req.json();

  const { error } = await supabaseAdmin
    .from('gallery')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete gallery error:', error.message);
    return new Response(error.message, { status: 500 });
  }

  return new Response('Deleted', { status: 200 });
}
