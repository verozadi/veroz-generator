'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Download, Heart, Plus, Maximize2, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, upscaleImage } from '@/lib/utils';
import type { GenerationResult } from '@/lib/types';
import { useState } from 'react';

interface PreviewGridProps {
    onRegenerate: (index: number) => void;
}

function PreviewCard({
    result,
    index,
    onRegenerate,
}: {
    result: GenerationResult;
    index: number;
    onRegenerate: (i: number) => void;
}) {
    const { form, addSticker, toggleFavorite } = useStore();
    const [isUpscaling, setIsUpscaling] = useState(false);

    const handleSave = () => {
        if (!result.url) return;
        addSticker({
            url: result.url,
            prompt: form.optimizedPrompt || form.prompt,
            style: form.style,
            aspectRatio: form.aspectRatio,
            width: form.customWidth,
            height: form.customHeight,
            name: form.stickerName,
            text: form.stickerText,
            emoji: form.stickerEmoji,
            isTransparent: form.isTransparent,
            bgColor: form.bgColor,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]"
            style={{ aspectRatio: form.aspectRatio.startsWith('9:16') || form.aspectRatio === 'tiktok' ? '9/16' : form.aspectRatio === '4:5' ? '4/5' : '1/1' }}
        >
            {/* Loading State */}
            {result.status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="skeleton absolute inset-0 rounded-2xl" />
                    <Loader2 className="relative z-10 h-6 w-6 animate-spin text-purple-400" />
                    <span className="relative z-10 text-xs text-slate-500">Membuat stiker #{index + 1}...</span>
                </div>
            )}

            {/* Error State */}
            {result.status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-950/30 p-3 text-center">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                    <p className="text-xs text-red-300">Gagal membuat gambar</p>
                    <button
                        onClick={() => onRegenerate(index)}
                        className="btn-secondary py-1.5 text-xs"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* Image */}
            {result.status === 'done' && result.url && (
                <>
                    <img
                        src={result.url}
                        alt={`Generated sticker ${index + 1}`}
                        className="h-full w-full object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
                        <div className="flex gap-2">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onRegenerate(index)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-purple-600/80"
                                title="Generate ulang"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.open(result.url!, '_blank')}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-blue-600/80"
                                title="Lihat penuh"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = result.url!;
                                    a.download = `veroz-sticker-${index + 1}.png`;
                                    a.click();
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-green-600/80"
                                title="Unduh standar"
                            >
                                <Download className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                disabled={isUpscaling}
                                onClick={async () => {
                                    try {
                                        setIsUpscaling(true);
                                        const hd = await upscaleImage(result.url!, 5000);
                                        const a = document.createElement('a');
                                        a.href = hd;
                                        a.download = `veroz-sticker-HD-${index + 1}.png`;
                                        a.click();
                                    } catch (e) {
                                        alert('Gagal upscale');
                                    } finally {
                                        setIsUpscaling(false);
                                    }
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/50 text-white transition-colors hover:bg-amber-500/80 disabled:opacity-50"
                                title="Unduh Resolusi Tinggi (5000px)"
                            >
                                {isUpscaling ? '...' : '✨'}
                            </motion.button>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            className="btn-primary mt-1 px-4 py-1.5 text-xs"
                        >
                            <Plus className="mr-1 inline h-3 w-3" />
                            Simpan ke Koleksi
                        </motion.button>
                    </div>

                    {/* Index badge */}
                    <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] font-bold text-white">
                        {index + 1}
                    </div>
                </>
            )}

            {/* Empty placeholder */}
            {result.status === 'loading' && (
                <div className="absolute bottom-2 right-2 text-[10px] text-slate-600">#{index + 1}</div>
            )}
        </motion.div>
    );
}

export default function PreviewGrid({ onRegenerate }: PreviewGridProps) {
    const { results, form } = useStore();

    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] py-16 text-center">
                <div className="mb-4 text-5xl">🎨</div>
                <p className="text-sm font-medium text-slate-400">Preview stiker muncul di sini</p>
                <p className="mt-1 text-xs text-slate-600">Pilih gaya dan klik Generate untuk mulai</p>
            </div>
        );
    }

    const gridCols =
        form.generateCount <= 1
            ? 'grid-cols-1'
            : form.generateCount <= 2
                ? 'grid-cols-2'
                : form.generateCount <= 4
                    ? 'grid-cols-2 sm:grid-cols-2'
                    : form.generateCount <= 6
                        ? 'grid-cols-2 sm:grid-cols-3'
                        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

    return (
        <div>
            <p className="section-label mb-3">
                Hasil Generate
                <span className="ml-2 text-slate-500">{results.filter((r) => r.status === 'done').length}/{results.length}</span>
            </p>
            <div className={cn('grid gap-3', gridCols)}>
                <AnimatePresence>
                    {results.map((result, i) => (
                        <PreviewCard key={result.id} result={result} index={i} onRegenerate={onRegenerate} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
