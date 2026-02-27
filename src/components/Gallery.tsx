'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, List, Heart, Download, Trash2, Plus, Eye, FolderPlus, Package } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useStore } from '@/store/useStore';
import { cn, upscaleImage } from '@/lib/utils';
import type { Sticker } from '@/lib/types';

function StickerCard({ sticker, onEdit, onStyleTransfer }: { sticker: Sticker; onEdit: (s: Sticker) => void; onStyleTransfer: (s: Sticker) => void }) {
    const { removeSticker, toggleFavorite, packs, addStickerToPack } = useStore();
    const [showPackMenu, setShowPackMenu] = useState(false);
    const [isUpscaling, setIsUpscaling] = useState(false);

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = sticker.url;
        a.download = `${sticker.name || 'stiker'}-${sticker.id.slice(0, 6)}.png`;
        a.click();
    };

    const handleUpscale = async () => {
        try {
            setIsUpscaling(true);
            const hdUrl = await upscaleImage(sticker.url, 5000);
            const a = document.createElement('a');
            a.href = hdUrl;
            a.download = `${sticker.name || 'stiker'}-HD-${sticker.id.slice(0, 6)}.png`;
            a.click();
        } catch (e) {
            console.error('Upscale failed', e);
            alert('Gagal membesarkan resolusi.');
        } finally {
            setIsUpscaling(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]"
            style={{ aspectRatio: '1/1' }}
        >
            <img
                src={sticker.url}
                alt={sticker.name || 'Stiker'}
                className="h-full w-full object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end gap-1 rounded-2xl bg-black/65 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                {/* Top actions */}
                <div className="absolute left-1.5 right-1.5 top-1.5 flex justify-between">
                    <button onClick={() => toggleFavorite(sticker.id)} className="rounded-full bg-black/40 p-1.5 transition hover:bg-red-500/60">
                        <Heart className={cn('h-3.5 w-3.5', sticker.favorite ? 'fill-red-400 text-red-400' : 'text-white')} />
                    </button>
                    <button onClick={() => removeSticker(sticker.id)} className="rounded-full bg-black/40 p-1.5 transition hover:bg-red-700/70">
                        <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                </div>
                {/* Bottom actions */}
                <div className="flex w-full gap-1">
                    <button onClick={() => window.open(sticker.url, '_blank')} className="flex items-center justify-center p-2 rounded-lg bg-white/10 text-white hover:bg-white/20" title="Lihat">
                        <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={handleDownload} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-600/50 py-1.5 text-[11px] font-medium text-white hover:bg-green-600/70">
                        <Download className="h-3 w-3" /> Unduh
                    </button>
                    <button onClick={handleUpscale} disabled={isUpscaling} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-500/50 py-1.5 text-[11px] font-medium text-white hover:bg-amber-500/70 disabled:opacity-50">
                        {isUpscaling ? 'Wait...' : '✨ 5K'}
                    </button>
                </div>
                <div className="flex w-full gap-1 mt-0.5">
                    <button onClick={() => onStyleTransfer(sticker)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-pink-600/50 py-1.5 text-[11px] font-medium text-white hover:bg-pink-600/70" title="Gunakan sbg referensi gaya AI">
                        🎨 Style
                    </button>
                    <button onClick={() => { useStore.getState().setEditorImage(sticker.url); onEdit(sticker); }} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600/50 py-1.5 text-[11px] font-medium text-white hover:bg-blue-600/70">
                        ✏️ Edit
                    </button>
                    <div className="relative flex-1">
                        <button onClick={() => setShowPackMenu(!showPackMenu)} className="flex w-full items-center justify-center gap-1 rounded-lg bg-purple-600/50 py-1.5 text-[11px] font-medium text-white hover:bg-purple-600/70">
                            <Plus className="h-3 w-3" /> Pack
                        </button>
                        {showPackMenu && (
                            <div className="absolute bottom-full left-0 mb-1 w-40 overflow-auto rounded-xl border border-white/10 bg-slate-900 py-1 shadow-2xl">
                                {packs.length === 0 ? (
                                    <p className="px-3 py-2 text-[11px] text-slate-500">Belum ada pack</p>
                                ) : (
                                    packs.map((pack) => (
                                        <button
                                            key={pack.id}
                                            onClick={() => { addStickerToPack(sticker.id, pack.id); setShowPackMenu(false); }}
                                            className="flex w-full items-center gap-2 px-3 py-1.5 text-[11px] text-slate-300 hover:bg-white/[0.08]"
                                        >
                                            <Package className="h-3 w-3 text-purple-400" />
                                            {pack.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Favorite badge */}
            {sticker.favorite && (
                <div className="absolute left-2 top-2 text-sm">❤️</div>
            )}
        </motion.div>
    );
}

export default function Gallery() {
    const { stickers, packs, addPack, removePack, setActiveTab } = useStore();
    const [search, setSearch] = useState('');
    const [isGrid, setIsGrid] = useState(true);
    const [activeSection, setActiveSection] = useState<'stickers' | 'packs'>('stickers');
    const [newPackName, setNewPackName] = useState('');

    const filtered = stickers.filter(
        (s) =>
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.prompt?.toLowerCase().includes(search.toLowerCase()) ||
            s.style?.toLowerCase().includes(search.toLowerCase()),
    );

    const handleDownloadPack = async (packId: string) => {
        const pack = packs.find((p) => p.id === packId);
        if (!pack) return;
        const zip = new JSZip();
        const packStickers = stickers.filter((s) => s.packIds.includes(packId));
        const folder = zip.folder(pack.name)!;
        await Promise.all(
            packStickers.map(async (s, i) => {
                try {
                    const res = await fetch(s.url);
                    const blob = await res.blob();
                    folder.file(`stiker-${i + 1}.png`, blob);
                } catch { }
            }),
        );
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `${pack.name}.zip`);
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 w-fit">
                {(['stickers', 'packs'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveSection(tab)}
                        className={cn(
                            'rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200',
                            activeSection === tab ? 'bg-purple-600/30 text-purple-300' : 'text-slate-400 hover:text-white',
                        )}
                    >
                        {tab === 'stickers' ? `🖼️ Stiker (${stickers.length})` : `📦 Packs (${packs.length})`}
                    </button>
                ))}
            </div>

            {activeSection === 'stickers' && (
                <>
                    {/* Search + Layout row */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, gaya, atau deskripsi..."
                                className="input-field pl-10 text-sm"
                            />
                        </div>
                        <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                            <button onClick={() => setIsGrid(true)} className={cn('rounded-lg p-2 transition', isGrid ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white')}>
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button onClick={() => setIsGrid(false)} className={cn('rounded-lg p-2 transition', !isGrid ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white')}>
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Sticker Grid */}
                    {filtered.length === 0 ? (
                        <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 text-4xl">📭</div>
                            <p className="text-sm font-medium text-slate-300">Koleksi masih kosong</p>
                            <p className="mt-1 text-xs text-slate-500">Generate stiker dulu lalu simpan ke koleksi</p>
                            <button
                                onClick={() => setActiveTab('generator')}
                                className="btn-primary mt-4 px-5 py-2 text-sm"
                            >
                                ✨ Buat Stiker Sekarang
                            </button>
                        </div>
                    ) : (
                        <div className={cn('grid gap-4', isGrid ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3')}>
                            <AnimatePresence>
                                {filtered.map((sticker) => (
                                    <StickerCard
                                        key={sticker.id}
                                        sticker={sticker}
                                        onEdit={() => setActiveTab('editor')}
                                        onStyleTransfer={(s) => {
                                            useStore.getState().setForm({ referenceImage: s.url });
                                            setActiveTab('generator');
                                            // Scroll to top
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            )}

            {activeSection === 'packs' && (
                <div className="space-y-4">
                    {/* Create Pack */}
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newPackName}
                            onChange={(e) => setNewPackName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newPackName.trim()) {
                                    addPack(newPackName.trim());
                                    setNewPackName('');
                                }
                            }}
                            placeholder="Nama pack baru..."
                            className="input-field flex-1 text-sm"
                        />
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { if (newPackName.trim()) { addPack(newPackName.trim()); setNewPackName(''); } }}
                            className="btn-primary flex items-center gap-2 px-4 text-sm"
                        >
                            <FolderPlus className="h-4 w-4" /> Buat Pack
                        </motion.button>
                    </div>

                    {/* Pack List */}
                    {packs.length === 0 ? (
                        <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-3 text-4xl">📦</div>
                            <p className="text-sm text-slate-400">Belum ada Sticker Pack</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {packs.map((pack) => {
                                const packStickers = stickers.filter((s) => s.packIds.includes(pack.id));
                                return (
                                    <div key={pack.id} className="glass-card p-4">
                                        <div className="mb-3 flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-white">{pack.name}</h3>
                                                <p className="text-xs text-slate-500">{packStickers.length} stiker</p>
                                            </div>
                                            <button onClick={() => removePack(pack.id)} className="text-slate-600 hover:text-red-400">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        {/* Mini preview */}
                                        <div className="grid grid-cols-4 gap-1 mb-3">
                                            {packStickers.slice(0, 8).map((s) => (
                                                <img key={s.id} src={s.url} alt="" className="aspect-square rounded-lg object-cover" />
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleDownloadPack(pack.id)}
                                            className="btn-secondary flex w-full items-center justify-center gap-2 py-2 text-sm"
                                        >
                                            <Download className="h-4 w-4" /> Unduh Pack ZIP
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
