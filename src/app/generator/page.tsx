'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/components/AuthProvider';
import { generateId } from '@/lib/utils';
import StyleSelector from '@/components/StyleSelector';
import PromptArea from '@/components/PromptArea';
import StickerTextInput from '@/components/StickerTextInput';
import ReferenceUpload from '@/components/ReferenceUpload';
import BackgroundToggle from '@/components/BackgroundToggle';
import GenerateControls from '@/components/GenerateControls';
import PreviewGrid from '@/components/PreviewGrid';
import Gallery from '@/components/Gallery';
import dynamic from 'next/dynamic';

const ImageEditor = dynamic(() => import('@/components/ImageEditor'), { ssr: false });

function GeneratorView() {
    const { form, results, setResults, updateResult, incrementGenerations, user } = useStore();
    const { user: authUser, refreshProfile } = useAuth();
    const [isGenerating, setIsGenerating] = useState(false);

    const generateAll = useCallback(async () => {
        if (isGenerating) return;
        const remaining = user.generationsLimit - user.generationsUsed;
        if (remaining < form.generateCount) return;

        setIsGenerating(true);

        // Initialize placeholders
        const initial = Array.from({ length: form.generateCount }, () => ({
            id: generateId(),
            url: null,
            status: 'loading' as const,
        }));
        setResults(initial);

        // Generate all in parallel
        await Promise.all(
            initial.map(async (_, i) => {
                try {
                    const res = await fetch('/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            prompt: form.optimizedPrompt || form.prompt || `${form.style} sticker art`,
                            style: form.style,
                            aiModel: form.aiModel,
                            width: form.customWidth,
                            height: form.customHeight,
                            isTransparent: form.isTransparent,
                        }),
                    });
                    const data = await res.json();
                    updateResult(i, { status: data.url ? 'done' : 'error', url: data.url || null });
                } catch {
                    updateResult(i, { status: 'error' });
                }
            }),
        );

        // Update quota locally
        incrementGenerations(form.generateCount);

        // Sync quota to server if authenticated
        if (authUser) {
            try {
                await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ count: form.generateCount }),
                });
                await refreshProfile();
            } catch {
                // Silently fail — local quota is already updated
            }
        }

        setIsGenerating(false);
    }, [form, isGenerating, user, authUser, setResults, updateResult, incrementGenerations, refreshProfile]);

    const regenerateSingle = useCallback(async (index: number) => {
        updateResult(index, { status: 'loading', url: null });
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: form.optimizedPrompt || form.prompt || `${form.style} sticker art`,
                    style: form.style,
                    aiModel: form.aiModel,
                    width: form.customWidth,
                    height: form.customHeight,
                    isTransparent: form.isTransparent,
                }),
            });
            const data = await res.json();
            updateResult(index, { status: data.url ? 'done' : 'error', url: data.url || null });
        } catch {
            updateResult(index, { status: 'error' });
        }
    }, [form, updateResult]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
            {/* Left: Form Column */}
            <div className="space-y-5">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                    <StyleSelector />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
                    <PromptArea />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                    <ReferenceUpload />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
                    <StickerTextInput />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
                    <BackgroundToggle />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
                    <GenerateControls onGenerate={generateAll} isGenerating={isGenerating} />
                </motion.div>
            </div>

            {/* Right: Preview + Collection Column */}
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                    <PreviewGrid onRegenerate={regenerateSingle} />
                </motion.div>
            </div>
        </div>
    );
}

export default function GeneratorPage() {
    const { activeTab } = useStore();

    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            {/* Page Header */}
            <AnimatePresence mode="wait">
                {activeTab === 'generator' && (
                    <motion.div
                        key="generator"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                ✨ <span className="gradient-text">Generator Stiker AI</span>
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Buat stiker unik dengan AI — 12 gaya seni, ekspor hingga 5000px
                            </p>
                        </div>
                        <GeneratorView />
                    </motion.div>
                )}

                {activeTab === 'gallery' && (
                    <motion.div
                        key="gallery"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                🖼️ <span className="gradient-text">Koleksi & Sticker Packs</span>
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Semua stiker yang sudah kamu buat — atur, favorit, dan unduh dalam ZIP
                            </p>
                        </div>
                        <Gallery />
                    </motion.div>
                )}

                {activeTab === 'editor' && (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                ✏️ <span className="gradient-text">Editor Gambar Lanjutan</span>
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Edit stiker, hapus background, tambah teks & tumpuk dengan stiker lain
                            </p>
                        </div>
                        <ImageEditor />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
