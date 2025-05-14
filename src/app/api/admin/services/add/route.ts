import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const body = await req.json();

  console.log('📥 Backend received:', body);

  const { id: _id, ...safeBody } = body;

  console.log('🧼 Inserting (safeBody):', safeBody);

  const { error } = await supabaseAdmin
    .from('services')
    .insert([safeBody]);

  if (error) {
    console.error('🔥 Add service error:', error.message);
    return new Response(error.message, { status: 500 });
  }

  return new Response('Service added', { status: 200 });
}
