// /src/api/admin/categories/sort.ts
import { NextRequest } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const updates = await req.json(); // expects: [{ id, sort_order }, ...]

  const results = await Promise.all(
    updates.map(({ id, sort_order }: { id: number; sort_order: number }) =>
      supabaseAdmin.from('categories').update({ sort_order }).eq('id', id)
    )
  );

  const hasError = results.some((r) => r.error);
  if (hasError) {
    console.error('Sort update error:', results);
    return new Response('Failed to update category order', { status: 500 });
  }

  return new Response('Order updated');
}
