'use client';

import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, Settings2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, ASPECT_RATIOS } from '@/lib/utils';
import type { AIModel } from '@/lib/types';

const generateCounts = [1, 2, 3, 4, 6, 8, 9, 12] as const;

const aiModels: { value: AIModel; label: string; badge: string }[] = [
    { value: 'pollinations', label: 'Pollinations.ai', badge: '🌸 Gratis' },
    { value: 'huggingface', label: 'Hugging Face', badge: '🤗 Gratis' },
    { value: 'together', label: 'Together.ai', badge: '⚡ Free Tier' },
];

interface GenerateControlsProps {
    onGenerate: () => void;
    isGenerating: boolean;
}

export default function GenerateControls({ onGenerate, isGenerating }: GenerateControlsProps) {
    const { form, setForm, user } = useStore();
    const remaining = Math.max(0, user.generationsLimit - user.generationsUsed);
    const canGenerate = remaining >= form.generateCount && !isGenerating;

    return (
        <div className="space-y-4">
            {/* Aspect Ratio Selector */}
            <div>
                <p className="section-label">Ukuran & Rasio</p>
                {/* Quick select ratio buttons */}
                <div className="mb-2 flex flex-wrap gap-1.5">
                    {[
                        { value: '1:1', label: '1:1', icon: '⬜' },
                        { value: '9:16', label: '9:16', icon: '📱' },
                        { value: '16:9', label: '16:9', icon: '🖥️' },
                        { value: '4:5', label: '4:5', icon: '📸' },
                        { value: '4:3', label: '4:3', icon: '🖼️' },
                    ].map(({ value, label, icon }) => (
                        <button
                            key={value}
                            onClick={() => {
                                const ratio = ASPECT_RATIOS.find((r) => r.value === value);
                                if (ratio) {
                                    setForm({
                                        aspectRatio: ratio.value,
                                        customWidth: ratio.width,
                                        customHeight: ratio.height,
                                    });
                                }
                            }}
                            className={cn(
                                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-150',
                                form.aspectRatio === value
                                    ? 'border-purple-500/60 bg-purple-600/20 text-purple-300'
                                    : 'border-white/[0.1] bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white',
                            )}
                        >
                            <span>{icon}</span> {label}
                        </button>
                    ))}
                </div>
                {/* Full dropdown for all ratios */}
                <div className="relative">
                    <select
                        value={form.aspectRatio}
                        onChange={(e) => {
                            const ratio = ASPECT_RATIOS.find((r) => r.value === e.target.value);
                            if (ratio) {
                                setForm({
                                    aspectRatio: ratio.value,
                                    customWidth: ratio.width,
                                    customHeight: ratio.height,
                                });
                            }
                        }}
                        className="input-field appearance-none pr-8 text-sm"
                    >
                        {ASPECT_RATIOS.reduce<{ category: string; items: { label: string; value: string; width: number; height: number; category: string }[] }[]>((acc, ratio) => {
                            const cat = acc.find((c) => c.category === ratio.category);
                            if (cat) cat.items.push(ratio);
                            else acc.push({ category: ratio.category, items: [ratio] });
                            return acc;
                        }, []).map(({ category, items }) => (
                            <optgroup key={category} label={`── ${category} ──`}>
                                {items.map((r) => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
                {/* Custom size inputs (shown when 'custom' selected) */}
                {form.aspectRatio === 'custom' && (
                    <div className="mt-2 flex items-center gap-2">
                        <input
                            type="number"
                            value={form.customWidth}
                            onChange={(e) => setForm({ customWidth: Number(e.target.value) })}
                            className="input-field text-sm"
                            placeholder="Lebar (px)"
                            min={64} max={2048} step={64}
                        />
                        <span className="text-slate-500">×</span>
                        <input
                            type="number"
                            value={form.customHeight}
                            onChange={(e) => setForm({ customHeight: Number(e.target.value) })}
                            className="input-field text-sm"
                            placeholder="Tinggi (px)"
                            min={64} max={2048} step={64}
                        />
                    </div>
                )}
            </div>

            {/* AI Model */}
            <div>
                <p className="section-label">Model AI Gambar</p>
                <div className="grid grid-cols-3 gap-2">
                    {aiModels.map(({ value, label, badge }) => (
                        <button
                            key={value}
                            onClick={() => setForm({ aiModel: value })}
                            className={cn(
                                'flex flex-col items-center gap-1 rounded-xl border py-2.5 text-center text-xs transition-all duration-200',
                                form.aiModel === value
                                    ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                                    : 'border-white/[0.07] bg-white/[0.03] text-slate-400 hover:border-white/20',
                            )}
                        >
                            <span className="font-semibold">{label}</span>
                            <span className="text-[10px] text-slate-500">{badge}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* GENERATE SECTION — Jumlah + Tombol Generate */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                {/* Jumlah Generate */}
                <div className="mb-4">
                    <p className="section-label flex items-center gap-1.5">
                        <Settings2 className="h-3 w-3" /> Jumlah Generate
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {generateCounts.map((n) => (
                            <button
                                key={n}
                                onClick={() => setForm({ generateCount: n })}
                                className={cn(
                                    'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition-all duration-150',
                                    form.generateCount === n
                                        ? 'border-purple-500/70 bg-purple-600/20 text-purple-300'
                                        : 'border-white/[0.1] bg-white/[0.04] text-slate-400 hover:border-white/25 hover:text-white',
                                )}
                            >
                                {n}
                            </button>
                        ))}
                        {/* Custom input */}
                        <input
                            type="number"
                            min={1} max={50}
                            placeholder="..."
                            className={cn(
                                'h-9 w-14 rounded-lg border px-2 text-center text-sm font-bold outline-none transition-all',
                                ![...generateCounts].includes(form.generateCount as typeof generateCounts[number])
                                    ? 'border-purple-500/70 bg-purple-600/20 text-purple-300'
                                    : 'border-white/[0.1] bg-white/[0.04] text-slate-400',
                            )}
                            value={![...generateCounts].includes(form.generateCount as typeof generateCounts[number]) ? form.generateCount : ''}
                            onChange={(e) => e.target.value && setForm({ generateCount: Math.max(1, Number(e.target.value)) })}
                        />
                    </div>
                </div>

                {/* Quota warning */}
                {remaining < form.generateCount && (
                    <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        ⚠️ Kuota tidak cukup. Tersisa {remaining} generate.{' '}
                        {user.isGuest && (
                            <span className="font-semibold underline cursor-pointer">Login untuk dapat 1000 generate gratis →</span>
                        )}
                    </div>
                )}

                {/* Generate Button */}
                <motion.button
                    whileHover={canGenerate ? { scale: 1.01 } : undefined}
                    whileTap={canGenerate ? { scale: 0.97 } : undefined}
                    onClick={onGenerate}
                    disabled={!canGenerate}
                    className={cn(
                        'btn-primary w-full py-4 text-base font-bold tracking-wide',
                        !canGenerate && 'cursor-not-allowed opacity-50',
                    )}
                >
                    {isGenerating ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Membuat {form.generateCount} Stiker...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Generate {form.generateCount} Stiker
                        </div>
                    )}
                </motion.button>

                {!user.isGuest ? (
                    <p className="mt-2 text-center text-[11px] text-slate-500">
                        Tersisa <span className="font-bold text-slate-300">{remaining}</span> dari {user.generationsLimit} generate
                    </p>
                ) : (
                    <p className="mt-2 text-center text-[11px] text-slate-500">
                        Mode tamu: Tersisa <span className="font-bold text-yellow-400">{remaining}</span> generate ·{' '}
                        <span className="cursor-pointer text-purple-400 hover:underline">Login untuk 1000 generate</span>
                    </p>
                )}
            </div>
        </div>
    );
}
