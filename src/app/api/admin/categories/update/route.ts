import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { id, name } = await req.json();

  if (!id || !name) {
    return new Response('Missing id or name', { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('categories')
    .update({ name })
    .eq('id', id);

  if (error) {
    console.error('Update error:', error);
    return new Response('Failed to update category', { status: 500 });
  }

  return new Response('Category updated', { status: 200 });
}
