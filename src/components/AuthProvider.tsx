'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { setUser: setStoreUser } = useStore();
    const supabase = createClient();

    const refreshProfile = useCallback(async () => {
        try {
            const res = await fetch('/api/user');
            const data = await res.json();

            if (data.user && !data.isGuest) {
                setStoreUser({
                    id: data.user.id,
                    email: data.user.email,
                    generationsUsed: data.user.generationsUsed,
                    generationsLimit: data.user.generationsLimit,
                    isGuest: false,
                });
            } else {
                setStoreUser({
                    id: 'guest',
                    generationsUsed: useStore.getState().user.generationsUsed, // preserve local guest count
                    generationsLimit: 10,
                    isGuest: true,
                });
            }
        } catch {
            // Keep guest mode if API fails
        }
    }, [setStoreUser, supabase]);

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);

            // Sync profile from server
            await refreshProfile();
        };
        getSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);

                if (event === 'SIGNED_IN') {
                    await refreshProfile();
                } else if (event === 'SIGNED_OUT') {
                    setStoreUser({
                        id: 'guest',
                        email: undefined,
                        generationsUsed: 0,
                        generationsLimit: 10,
                        isGuest: true,
                    });
                }
            },
        );

        return () => subscription.unsubscribe();
    }, [supabase, refreshProfile, setStoreUser]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setStoreUser({
            id: 'guest',
            email: undefined,
            generationsUsed: 0,
            generationsLimit: 10,
            isGuest: true,
        });
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
