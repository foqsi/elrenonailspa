import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return new Response('Missing category ID', { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete error:', error);
    return new Response('Failed to delete category', { status: 500 });
  }

  return new Response('Category deleted', { status: 200 });
}
