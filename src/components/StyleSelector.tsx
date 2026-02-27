'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { Style } from '@/lib/types';

const styles: { name: Style; emoji: string; gradient: string; description: string }[] = [
    {
        name: '2D Flat',
        emoji: '🎨',
        gradient: 'from-orange-500/20 to-yellow-500/20',
        description: 'Warna solid, desain datar',
    },
    {
        name: '3D Render',
        emoji: '🔮',
        gradient: 'from-cyan-500/20 to-blue-500/20',
        description: 'Tampilan tiga dimensi',
    },
    {
        name: 'Animated',
        emoji: '✨',
        gradient: 'from-purple-500/20 to-pink-500/20',
        description: 'Bergerak & dinamis',
    },
    {
        name: 'Kawaii',
        emoji: '🌸',
        gradient: 'from-pink-500/20 to-rose-500/20',
        description: 'Imut ala Jepang',
    },
    {
        name: 'Pixel Art',
        emoji: '👾',
        gradient: 'from-green-500/20 to-emerald-500/20',
        description: 'Retro piksel klasik',
    },
    {
        name: 'Neon Glow',
        emoji: '💫',
        gradient: 'from-violet-500/20 to-purple-500/20',
        description: 'Cahaya neon bersinar',
    },
    {
        name: 'Watercolor',
        emoji: '🎭',
        gradient: 'from-sky-500/20 to-indigo-500/20',
        description: 'Cat air artistik',
    },
    {
        name: 'Comic',
        emoji: '💥',
        gradient: 'from-yellow-500/20 to-orange-500/20',
        description: 'Gaya komik & manga',
    },
    {
        name: 'Minimalist',
        emoji: '⬜',
        gradient: 'from-slate-500/20 to-gray-500/20',
        description: 'Bersih & sederhana',
    },
    {
        name: 'Retro',
        emoji: '🕹️',
        gradient: 'from-amber-500/20 to-yellow-500/20',
        description: 'Estetika jadoel',
    },
    {
        name: 'Holographic',
        emoji: '🌈',
        gradient: 'from-teal-500/20 to-cyan-500/20',
        description: 'Kilap hologram',
    },
    {
        name: 'Emoji',
        emoji: '😄',
        gradient: 'from-rose-500/20 to-orange-500/20',
        description: 'Ekspresif emoji',
    },
];

export default function StyleSelector() {
    const { form, setForm } = useStore();

    return (
        <div>
            <p className="section-label">Gaya Stiker</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {styles.map((style, i) => {
                    const isActive = form.style === style.name;
                    return (
                        <motion.button
                            key={style.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setForm({ style: style.name })}
                            className={cn(
                                'relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200',
                                isActive
                                    ? 'border-purple-500/60 bg-purple-500/10'
                                    : 'border-white/[0.07] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]',
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="style-glow"
                                    className={cn('absolute inset-0 rounded-xl bg-gradient-to-br', style.gradient)}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10 text-2xl">{style.emoji}</span>
                            <span
                                className={cn(
                                    'relative z-10 text-[11px] font-semibold leading-tight',
                                    isActive ? 'text-purple-200' : 'text-slate-300',
                                )}
                            >
                                {style.name}
                            </span>
                            <span className="relative z-10 hidden text-[9px] leading-tight text-slate-500 sm:block">
                                {style.description}
                            </span>
                            {isActive && (
                                <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-purple-400" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
