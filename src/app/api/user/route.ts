import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET: Retrieve current user profile and quota
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({
                user: null,
                isGuest: true,
            });
        }

        // Fetch user profile from our custom table
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                generationsUsed: profile?.generations_used ?? 0,
                generationsLimit: profile?.generations_limit ?? 1000,
            },
            isGuest: false,
        });
    } catch {
        return NextResponse.json({ user: null, isGuest: true });
    }
}

// POST: Increment generation count for authenticated user
export async function POST(request: Request) {
    try {
        const { count } = await request.json();
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Fetch current usage
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('generations_used, generations_limit')
            .eq('id', user.id)
            .single();

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const newUsed = (profile.generations_used ?? 0) + (count ?? 1);

        if (newUsed > profile.generations_limit) {
            return NextResponse.json({ error: 'Quota exceeded', remaining: profile.generations_limit - (profile.generations_used ?? 0) }, { status: 429 });
        }

        // Increment usage
        await supabase
            .from('user_profiles')
            .update({ generations_used: newUsed })
            .eq('id', user.id);

        return NextResponse.json({
            generationsUsed: newUsed,
            generationsLimit: profile.generations_limit,
            remaining: profile.generations_limit - newUsed,
        });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
