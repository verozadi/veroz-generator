import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // After login, ensure user profile exists in our table
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Upsert into user_profiles — if the row exists, do not overwrite generations_used
                await supabase.from('user_profiles').upsert(
                    {
                        id: user.id,
                        email: user.email,
                        generations_limit: 1000,
                    },
                    { onConflict: 'id', ignoreDuplicates: true },
                );
            }
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return to homepage if there's an error
    return NextResponse.redirect(`${origin}/?auth_error=true`);
}
