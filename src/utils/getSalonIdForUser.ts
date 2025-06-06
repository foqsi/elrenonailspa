// import { supabaseServer } from '@/lib/supabaseServer';

// export async function getSalonIdForUser(userId: string): Promise<string | null> {
//   const { data, error } = await supabaseServer
//     .from('admins')
//     .select('salon_id')
//     .eq('user_id', userId)
//     .single();

//   if (error || !data) {
//     console.error('Failed to get salon_id for user:', error?.message);
//     return null;
//   }

//   return data.salon_id;
// }
