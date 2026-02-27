'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Box, Monitor, Smartphone, Sparkles, ChevronRight, Wand2, Layers, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ASPECT_RATIOS } from '@/lib/utils';

export default function LandingPage() {
    const { setForm, setActiveTab } = useStore();

    const handleQuickSelect = (type: 'sticker' | 'banner' | 'wallpaper') => {
        setActiveTab('generator');
        if (type === 'sticker') {
            const ratio = ASPECT_RATIOS.find((r) => r.value === '1:1')!;
            setForm({ aspectRatio: ratio.value, customWidth: ratio.width, customHeight: ratio.height });
        } else if (type === 'banner') {
            const ratio = ASPECT_RATIOS.find((r) => r.value === '16:9')!;
            setForm({ aspectRatio: ratio.value, customWidth: ratio.width, customHeight: ratio.height });
        } else if (type === 'wallpaper') {
            const ratio = ASPECT_RATIOS.find((r) => r.value === '9:16')!;
            setForm({ aspectRatio: ratio.value, customWidth: ratio.width, customHeight: ratio.height });
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)] bg-[#0d0d1a] text-white overflow-hidden flex flex-col items-center">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[800px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />

            {/* Aesthetic Ornaments - Left */}
            <div className="absolute left-0 top-0 h-full w-48 hidden lg:flex flex-col justify-around items-center opacity-30 pointer-events-none py-32">
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                    <Box className="w-16 h-16 text-purple-400 rotate-12" />
                </motion.div>
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
                    <Layers className="w-12 h-12 text-pink-400 -rotate-12" />
                </motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
                    <Sparkles className="w-10 h-10 text-violet-300" />
                </motion.div>
            </div>

            {/* Aesthetic Ornaments - Right */}
            <div className="absolute right-0 top-0 h-full w-48 hidden lg:flex flex-col justify-around items-center opacity-30 pointer-events-none py-32">
                <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}>
                    <Monitor className="w-20 h-10 text-purple-400 -rotate-6" />
                </motion.div>
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}>
                    <Smartphone className="w-12 h-20 text-pink-400 rotate-12" />
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}>
                    <Zap className="w-10 h-10 text-violet-300" />
                </motion.div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-5xl px-6 py-20 mt-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-4 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Image Studio V2.0</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 drop-shadow-sm">
                            Veroz Generator
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-light mt-4">
                        Wujudkan imajinasi Anda menjadi kenyataan. Buat stiker unik, banner menawan, dan wallpaper estetik hanya dengan beberapa klik menggunakan kecerdasan buatan.
                    </p>

                    <div className="pt-8">
                        <Link href="/generator">
                            <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_50px_rgba(139,92,246,0.8)] hover:-translate-y-1 overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Wand2 className="w-6 h-6 z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="z-10">Mulai Sekarang</span>
                                <ChevronRight className="w-5 h-5 z-10 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Quick Select Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="w-full mt-32"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold mb-2">Pilih Format Anda</h2>
                        <p className="text-slate-400">Template siap pakai untuk berbagai kebutuhan kreatif</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Sticker Card */}
                        <Link href="/generator" onClick={() => handleQuickSelect('sticker')}>
                            <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 overflow-hidden h-full">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-colors" />

                                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 border border-purple-500/30 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <Box className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Stiker Custom</h3>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-4 border border-white/5">Rasio 1:1</div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Buat stiker ikonik dengan sudut melengkung dan background transparan untuk komunitas Anda.
                                </p>
                            </div>
                        </Link>

                        {/* Banner Card */}
                        <Link href="/generator" onClick={() => handleQuickSelect('banner')}>
                            <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 overflow-hidden h-full">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-colors" />

                                <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400 border border-pink-500/30 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <Monitor className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Banner Premium</h3>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-4 border border-white/5">Rasio 16:9</div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Desain banner bercahaya dan lanskap epik untuk profil, artikel, atau header media sosial.
                                </p>
                            </div>
                        </Link>

                        {/* Wallpaper Card */}
                        <Link href="/generator" onClick={() => handleQuickSelect('wallpaper')}>
                            <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 overflow-hidden h-full">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors" />

                                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 border border-blue-500/30 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <Smartphone className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Wallpaper Estetik</h3>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-4 border border-white/5">Rasio 9:16</div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Hasilkan wallpaper vertikal memukau untuk layar smartphone dengan detail yang luar biasa.
                                </p>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
