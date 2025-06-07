import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';

export async function POST(req: Request) {
    const { id } = await req.json();

    const { error } = await supabaseAdmin
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('salon_id', SALON_ID);

    if (error) {
        return new Response('Failed to delete appointment', { status: 500 });
    }

    return new Response('Appointment deleted');
}
