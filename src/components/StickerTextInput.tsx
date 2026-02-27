'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Smile, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const fonts = [
    'Inter', 'Poppins', 'Montserrat', 'Roboto Slab', 'Pacifico', 'Bangers',
    'Fredoka One', 'Lilita One', 'Permanent Marker', 'Press Start 2P',
];

const textPositions = [
    { value: 'top', label: 'Atas Tengah' },
    { value: 'center', label: 'Tengah' },
    { value: 'bottom', label: 'Bawah Tengah' },
    { value: 'top-left', label: 'Atas Kiri' },
    { value: 'top-right', label: 'Atas Kanan' },
    { value: 'bottom-left', label: 'Bawah Kiri' },
    { value: 'bottom-right', label: 'Bawah Kanan' },
];

const textStyles = [
    { label: 'Normal', value: 'normal' },
    { label: 'Outline Tebal', value: 'outline' },
    { label: 'Bayangan', value: 'shadow' },
    { label: 'Neon Glow', value: 'neon' },
];

export default function StickerTextInput() {
    const { form, setForm } = useStore();
    const [showEmoji, setShowEmoji] = useState(false);

    return (
        <div className="space-y-3">
            {/* Name & Text row */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="section-label">Nama Stiker</p>
                    <input
                        type="text"
                        value={form.stickerName}
                        onChange={(e) => setForm({ stickerName: e.target.value })}
                        placeholder="Contoh: Kucing Astronaut"
                        className="input-field text-sm"
                    />
                </div>
                <div>
                    <p className="section-label">Teks / Kata pada Stiker</p>
                    <input
                        type="text"
                        value={form.stickerText}
                        onChange={(e) => setForm({ stickerText: e.target.value })}
                        placeholder="Contoh: Semangat!"
                        className="input-field text-sm"
                    />
                </div>
            </div>

            {/* Emoji Input */}
            <div>
                <p className="section-label">Emoji</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={form.stickerEmoji ?? ''}
                        onChange={(e) => setForm({ stickerEmoji: e.target.value })}
                        placeholder="Ketik atau pilih emoji... 😀🎨✨"
                        className="input-field flex-1 text-sm"
                    />
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="btn-secondary flex items-center gap-2 px-4 text-sm"
                    >
                        <Smile className="h-4 w-4 text-yellow-400" />
                        Pilih
                    </motion.button>
                    {(form.stickerEmoji ?? '') && (
                        <button
                            onClick={() => setForm({ stickerEmoji: '' })}
                            className="px-3 text-xs text-slate-500 hover:text-red-400"
                        >
                            Hapus
                        </button>
                    )}
                </div>
            </div>

            {/* Emoji Picker Modal — full-screen overlay */}
            <AnimatePresence>
                {showEmoji && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEmoji(false)}
                            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="pointer-events-auto rounded-2xl border border-white/[0.12] bg-[#1a1a2e] p-2 shadow-2xl">
                                <EmojiPicker
                                    onEmojiClick={(emojiData) => {
                                        setForm({ stickerEmoji: (form.stickerEmoji || '') + emojiData.emoji });
                                        setShowEmoji(false); // Auto close after selecting
                                    }}
                                    searchPlaceholder="Cari emoji..."
                                    theme={'dark' as Parameters<typeof EmojiPicker>[0]['theme']}
                                    height={400}
                                    width={350}
                                    style={{
                                        '--epr-emoji-size': '24px',
                                        '--epr-category-navigation-button-size': '24px',
                                        '--epr-search-input-padding': '0 20px 0 35px',
                                        '--epr-bg-color': '#1a1a2e',
                                        '--epr-category-icon-active-color': '#7c3aed',
                                        '--epr-text-color': '#e2e8f0',
                                        '--epr-search-input-bg-color': '#12122a',
                                        '--epr-hover-bg-color': '#7c3aed33',
                                        '--epr-focus-bg-color': '#7c3aed44',
                                        '--epr-category-label-bg-color': '#1a1a2e',
                                        '--epr-search-border-color': '#ffffff1a',
                                    } as React.CSSProperties}
                                />
                                <button
                                    onClick={() => setShowEmoji(false)}
                                    className="mt-2 w-full rounded-xl bg-purple-600/30 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-600/50"
                                >
                                    ✓ Selesai
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Font & Style & Position row */}
            <div className="grid grid-cols-3 gap-3">
                {/* Font */}
                <div>
                    <p className="section-label flex items-center gap-1"><Type className="h-3 w-3" /> Font</p>
                    <div className="relative">
                        <select
                            value={form.textFont}
                            onChange={(e) => setForm({ textFont: e.target.value })}
                            className="input-field appearance-none pr-8 text-xs"
                        >
                            {fonts.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                </div>

                {/* Text Style */}
                <div>
                    <p className="section-label">Gaya Teks</p>
                    <div className="relative">
                        <select className="input-field appearance-none pr-8 text-xs">
                            {textStyles.map((ts) => <option key={ts.value}>{ts.label}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                </div>

                {/* Text Position */}
                <div>
                    <p className="section-label">Posisi Teks</p>
                    <div className="relative">
                        <select
                            value={form.textPosition}
                            onChange={(e) => setForm({ textPosition: e.target.value as typeof form.textPosition })}
                            className="input-field appearance-none pr-8 text-xs"
                        >
                            {textPositions.map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
