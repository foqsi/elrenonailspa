import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { id, text, enabled } = await req.json();

  const { error } = await supabaseAdmin
    .from('promo_banner')
    .update({ text, enabled, updated_at: new Date() })
    .eq('id', id);

  if (error) return new Response('Failed to update', { status: 500 });
  return new Response('Updated', { status: 200 });
}
