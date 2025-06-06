import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';

export async function POST(req: Request) {
  const { id } = await req.json();

  const { error } = await supabaseAdmin
    .from('gallery')
    .delete()
    .eq('id', id)
    .eq('salon_id', SALON_ID);

  if (error) {
    console.error('Delete gallery error:', error.message);
    return new Response(error.message, { status: 500 });
  }

  return new Response('Deleted', { status: 200 });
}
