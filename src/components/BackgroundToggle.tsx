'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export default function BackgroundToggle() {
    const { form, setForm } = useStore();

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="section-label mb-0">Latar Belakang</p>
                {/* Toggle */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Warna</span>
                    <button
                        onClick={() => setForm({ isTransparent: !form.isTransparent })}
                        className={cn(
                            'relative h-6 w-11 rounded-full border transition-all duration-300',
                            form.isTransparent
                                ? 'border-purple-500/60 bg-purple-600/30'
                                : 'border-white/[0.1] bg-white/[0.06]',
                        )}
                    >
                        <motion.div
                            animate={{ x: form.isTransparent ? 22 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={cn(
                                'h-[18px] w-[18px] rounded-full shadow-sm',
                                form.isTransparent ? 'bg-purple-400' : 'bg-slate-400',
                            )}
                        />
                    </button>
                    <span className="text-xs text-slate-400">Transparan PNG</span>
                </div>
            </div>

            {/* Color Picker (shown when not transparent) */}
            <motion.div
                initial={false}
                animate={{ opacity: form.isTransparent ? 0.3 : 1, height: form.isTransparent ? 'auto' : 'auto' }}
                className={cn(
                    'flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3',
                    form.isTransparent && 'pointer-events-none',
                )}
            >
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400">Warna Latar:</label>
                    <div className="relative">
                        <input
                            type="color"
                            value={form.bgColor}
                            onChange={(e) => setForm({ bgColor: e.target.value })}
                            className="h-8 w-8 cursor-pointer rounded-lg border border-white/10 bg-transparent p-0.5"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                    <span className="font-mono text-xs text-slate-400">{form.bgColor}</span>
                </div>
                {/* Color Presets */}
                <div className="flex items-center gap-1.5">
                    {['#ffffff', '#000000', '#ff6b6b', '#4ecdc4', '#ffd93d', '#a55eea', '#fd9644'].map((color) => (
                        <button
                            key={color}
                            onClick={() => setForm({ bgColor: color, isTransparent: false })}
                            className={cn(
                                'h-5 w-5 rounded-full border-2 transition-all duration-150',
                                form.bgColor === color ? 'border-white/80 scale-125' : 'border-white/20 hover:border-white/50',
                            )}
                            style={{ background: color }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
