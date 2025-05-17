import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    const { id } = await req.json();

    const { error } = await supabaseAdmin
        .from('appointments')
        .delete()
        .eq('id', id);

    if (error) {
        return new Response('Failed to delete appointment', { status: 500 });
    }

    return new Response('Appointment deleted');
}
