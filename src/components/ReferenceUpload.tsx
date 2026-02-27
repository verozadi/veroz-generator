'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, User, Shirt, Maximize } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { ReferenceMode } from '@/lib/types';

const modes: { value: ReferenceMode; label: string; icon: typeof User; desc: string }[] = [
    { value: 'full', label: 'Full', icon: Maximize, desc: 'Seluruh gambar' },
    { value: 'face', label: 'Wajah', icon: User, desc: 'Hanya wajah' },
    { value: 'body', label: 'Badan', icon: Shirt, desc: 'Badan & pakaian' },
];

export default function ReferenceUpload() {
    const { form, setForm } = useStore();
    const fileRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => setForm({ referenceImage: e.target?.result as string });
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-3">
            <p className="section-label">Gambar Referensi Karakter (Opsional)</p>

            {/* Drop Zone */}
            {!form.referenceImage ? (
                <motion.div
                    whileHover={{ borderColor: 'rgba(139,92,246,0.5)' }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleFile(file);
                    }}
                    onClick={() => fileRef.current?.click()}
                    className={cn(
                        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-8 transition-all duration-200',
                        isDragging
                            ? 'border-purple-500/70 bg-purple-500/10'
                            : 'border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04]',
                    )}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.08]">
                        <Upload className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-300">Seret gambar ke sini</p>
                        <p className="text-xs text-slate-500">atau klik untuk pilih file · PNG, JPG, WEBP</p>
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                    />
                </motion.div>
            ) : (
                <div className="relative overflow-hidden rounded-xl border border-white/[0.1]">
                    <img
                        src={form.referenceImage}
                        alt="Reference"
                        className="h-40 w-full object-cover"
                    />
                    <button
                        onClick={() => setForm({ referenceImage: null })}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-500/80"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6">
                        <p className="text-xs text-white/70">Gambar referensi aktif</p>
                    </div>
                </div>
            )}

            {/* Mode Selector */}
            {form.referenceImage && (
                <div className="flex gap-2">
                    {modes.map(({ value, label, icon: Icon, desc }) => (
                        <button
                            key={value}
                            onClick={() => setForm({ referenceMode: value })}
                            className={cn(
                                'flex flex-1 flex-col items-center gap-1 rounded-xl border py-2.5 text-center transition-all duration-200',
                                form.referenceMode === value
                                    ? 'border-purple-500/60 bg-purple-500/10 text-purple-300'
                                    : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20',
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="text-xs font-semibold">{label}</span>
                            <span className="text-[10px] text-slate-500">{desc}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
