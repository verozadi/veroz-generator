'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Images, Edit3, LogIn, LogOut, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/components/AuthProvider';
import AuthModal from '@/components/AuthModal';
import { cn } from '@/lib/utils';

const tabs = [
    { id: 'generator', label: 'Generator', icon: Sparkles },
    { id: 'gallery', label: 'Galeri & Pack', icon: Images },
    { id: 'editor', label: 'Editor', icon: Edit3 },
] as const;

export default function Navbar() {
    const { activeTab, setActiveTab, user: storeUser } = useStore();
    const { user: authUser, signOut, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const limitPercent = (storeUser.generationsUsed / storeUser.generationsLimit) * 100;
    const remaining = Math.max(0, storeUser.generationsLimit - storeUser.generationsUsed);

    return (
        <>
            <header
                className="sticky top-0 z-50 w-full border-b border-white/[0.06] backdrop-blur-xl"
                style={{ background: 'rgba(13,13,26,0.85)' }}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
                        >
                            <Zap className="h-5 w-5 text-white" fill="white" />
                        </div>
                        <div>
                            <span className="gradient-text text-lg font-bold">Veroz</span>
                            <span className="text-lg font-bold text-white"> Generator</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <nav className="hidden items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1 sm:flex">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={cn(
                                    'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                                    activeTab === id ? 'text-white' : 'text-slate-400 hover:text-slate-200',
                                )}
                            >
                                {activeTab === id && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute inset-0 rounded-lg"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(236,72,153,0.4))',
                                        }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <Icon className="relative z-10 h-4 w-4" />
                                <span className="relative z-10">{label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Right: Quota + Auth */}
                    <div className="flex items-center gap-3">
                        {/* Quota indicator */}
                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2">
                                <div className="text-xs text-slate-400">
                                    Generate:{' '}
                                    <span className={cn('font-bold', remaining <= 2 ? 'text-red-400' : 'gradient-text')}>
                                        {remaining}
                                    </span>
                                    <span className="text-slate-600"> / {storeUser.generationsLimit}</span>
                                </div>
                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: 'linear-gradient(90deg, #7c3aed, #ec4899)' }}
                                        animate={{ width: `${Math.min(100, limitPercent)}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Auth Button */}
                        {loading ? (
                            <div className="h-9 w-20 animate-pulse rounded-xl bg-white/[0.06]" />
                        ) : authUser ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.05] px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:border-purple-500/40 hover:bg-white/[0.08]"
                                >
                                    {authUser.user_metadata?.avatar_url ? (
                                        <img
                                            src={authUser.user_metadata.avatar_url}
                                            alt="avatar"
                                            className="h-6 w-6 rounded-full"
                                        />
                                    ) : (
                                        <User className="h-4 w-4 text-purple-400" />
                                    )}
                                    <span className="hidden max-w-[100px] truncate sm:block">
                                        {authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Akun'}
                                    </span>
                                </button>

                                {/* Dropdown */}
                                {showMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/[0.1] bg-slate-900 py-1 shadow-2xl"
                                    >
                                        <div className="border-b border-white/[0.06] px-3 py-2">
                                            <p className="truncate text-xs font-medium text-white">
                                                {authUser.email}
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                                Kuota: {remaining} / {storeUser.generationsLimit}
                                            </p>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                setShowMenu(false);
                                                await signOut();
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-white/[0.05]"
                                        >
                                            <LogOut className="h-3.5 w-3.5" />
                                            Keluar
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
                            >
                                <LogIn className="h-4 w-4" />
                                <span className="hidden sm:block">Masuk</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Tabs */}
                <div className="flex border-t border-white/[0.05] sm:hidden">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={cn(
                                'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
                                activeTab === id ? 'text-purple-400' : 'text-slate-500',
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Auth Modal */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
}
