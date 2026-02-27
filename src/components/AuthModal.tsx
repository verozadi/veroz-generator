'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Chrome, Loader2, Sparkles, Shield, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const supabase = createClient();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setSuccess('📧 Cek email kamu untuk konfirmasi akun!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
                window.location.reload();
            }
        } catch (err: unknown) {
            setError((err as Error).message || 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: unknown) {
            setError((err as Error).message || 'Terjadi kesalahan');
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && onClose()}
                    >
                        <div className="glass-card-strong w-full max-w-md max-h-[90vh] overflow-y-auto overflow-hidden rounded-2xl border border-white/[0.1]">
                            {/* Header */}
                            <div className="relative px-6 pb-4 pt-6">
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-slate-400 transition-colors hover:bg-white/[0.12] hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                                        style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
                                    >
                                        <Zap className="h-5 w-5 text-white" fill="white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">
                                            {mode === 'login' ? 'Masuk ke Veroz' : 'Buat Akun Baru'}
                                        </h2>
                                        <p className="text-xs text-slate-400">Dapatkan 1000 generate gratis</p>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="mx-6 mb-4 rounded-xl border border-purple-500/20 bg-purple-900/10 p-3">
                                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                                    <div className="flex flex-col items-center gap-1">
                                        <Sparkles className="h-4 w-4 text-purple-400" />
                                        <span className="font-semibold text-purple-300">1000×</span>
                                        <span className="text-slate-500">Generate</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Shield className="h-4 w-4 text-blue-400" />
                                        <span className="font-semibold text-blue-300">Cloud</span>
                                        <span className="text-slate-500">Simpan</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Zap className="h-4 w-4 text-pink-400" />
                                        <span className="font-semibold text-pink-300">5000px</span>
                                        <span className="text-slate-500">Export HD</span>
                                    </div>
                                </div>
                            </div>

                            {/* Google Login */}
                            <div className="px-6">
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.06] py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/[0.1]"
                                >
                                    <Chrome className="h-5 w-5 text-blue-400" />
                                    {loading ? 'Mengarahkan...' : 'Lanjutkan dengan Google'}
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="my-4 flex items-center gap-3 px-6">
                                <div className="h-px flex-1 bg-white/[0.08]" />
                                <span className="text-xs text-slate-500">atau dengan email</span>
                                <div className="h-px flex-1 bg-white/[0.08]" />
                            </div>

                            {/* Email Form */}
                            <form onSubmit={handleEmailAuth} className="space-y-3 px-6 pb-6">
                                <div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        required
                                        className="input-field text-sm"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password (min. 6 karakter)"
                                        required
                                        minLength={6}
                                        className="input-field text-sm"
                                    />
                                </div>

                                {/* Error / Success Messages */}
                                {error && (
                                    <div className="rounded-lg border border-red-500/20 bg-red-900/20 px-3 py-2 text-xs text-red-300">
                                        ⚠️ {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="rounded-lg border border-green-500/20 bg-green-900/20 px-3 py-2 text-xs text-green-300">
                                        ✅ {success}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Mail className="h-4 w-4" />
                                    )}
                                    {mode === 'login' ? 'Masuk' : 'Daftar'}
                                </button>

                                {/* Toggle mode */}
                                <p className="text-center text-xs text-slate-500">
                                    {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
                                        className="font-semibold text-purple-400 hover:text-purple-300"
                                    >
                                        {mode === 'login' ? 'Daftar' : 'Masuk'}
                                    </button>
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
