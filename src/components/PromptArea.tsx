'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Dice5, Wand2, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const suggestions = [
    'Kucing lucu pakai topi astronaut',
    'Panda makan bambu dengan kacamata',
    'Anjing corgi berselancar di awan',
    'Rubah kecil pegang payung hujan warna-warni',
    'Karakter robot imut tersenyum',
    'Naga mini tidur di atas koin emas',
    'Kelinci ninja dengan pedang bambu',
    'Capybara relaksasi di kolam renang',
    'Kucing berpetualang ke luar angkasa',
    'Beruang barista membuat kopi latte',
];

const randomIdeas = [
    'Stroberi berkilap dengan mahkota',
    'Gurita bermain gitar di bawah laut',
    'Unicorn pixel art versi retro',
    'Bebek holografik pakai earphones',
    'Avatar astronot kawaii cantik',
    'Penguin rapper dengan mic emas',
    'Tupai DJ di turntable futuristik',
    'Kura-kura samurai berambut abu',
];

export default function PromptArea() {
    const { form, setForm, user } = useStore();
    const prompt = form.prompt ?? '';
    const [isOptimizing, setIsOptimizing] = useState(false);
    const textRef = useRef<HTMLTextAreaElement>(null);

    const handleRandomIdea = () => {
        const idea = randomIdeas[Math.floor(Math.random() * randomIdeas.length)];
        setForm({ prompt: idea });
    };

    const handleAIAssist = async () => {
        if (!prompt.trim() && !form.referenceImage) return;
        setIsOptimizing(true);
        try {
            const res = await fetch('/api/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: form.prompt,
                    style: form.style,
                    ai: form.promptAI,
                }),
            });
            const data = await res.json();
            if (res.ok && data.result) {
                setForm({ optimizedPrompt: data.result });
            } else {
                alert(`Gagal optimasi: ${data.error || 'Terjadi kesalahan pada AI'}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsOptimizing(false);
        }
    };

    const canGenerate = !!(prompt.trim() || form.referenceImage);

    return (
        <div className="space-y-3">
            {/* Prompt Textarea */}
            <div>
                <p className="section-label">Deskripsi Stiker</p>
                <div className="relative">
                    <textarea
                        ref={textRef}
                        value={prompt}
                        onChange={(e) => setForm({ prompt: e.target.value })}
                        placeholder="Deskripsikan stiker yang kamu inginkan... (opsional jika ada gambar referensi)"
                        rows={3}
                        className="input-field resize-none pr-10 text-sm leading-relaxed"
                    />
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1">
                        <span className={cn('text-[10px]', prompt.length > 400 ? 'text-red-400' : 'text-slate-600')}>
                            {prompt.length}/500
                        </span>
                    </div>
                </div>
            </div>

            {/* Suggestion Pills */}
            <div className="flex flex-wrap gap-1.5">
                {suggestions.slice(0, 6).map((s) => (
                    <button
                        key={s}
                        onClick={() => setForm({ prompt: s })}
                        className="pill text-[11px]"
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* AI Tools Row */}
            <div className="flex flex-wrap gap-2">
                {/* AI Provider Selector */}
                <select
                    value={form.promptAI}
                    onChange={(e) => setForm({ promptAI: e.target.value as typeof form.promptAI })}
                    className="input-field w-auto flex-1 py-2 text-xs"
                >
                    <optgroup label="Gemini AI">
                        <option value="gemini:gemini-2.0-flash">🤖 Gemini 2.0 Flash</option>
                    </optgroup>
                    <optgroup label="Groq (Super Cepat)">
                        <option value="groq:llama-3.1-8b-instant">⚡ Llama 3.1 8B</option>
                        <option value="groq:llama-3.3-70b-versatile">⚡ Llama 3.3 70B</option>
                    </optgroup>
                    <optgroup label="OpenRouter">
                        <option value="openrouter:openrouter/auto">🌐 Auto (Best Free)</option>
                        <option value="openrouter:meta-llama/llama-3-8b-instruct:free">🌐 Llama 3 8B (Free)</option>
                    </optgroup>
                    <optgroup label="Together AI">
                        <option value="together:meta-llama/Llama-3-8b-chat-hf">🤝 Llama 3 8B</option>
                        <option value="together:mistralai/Mixtral-8x7B-Instruct-v0.1">🤝 Mixtral 8x7B</option>
                    </optgroup>
                    <optgroup label="Mistral AI">
                        <option value="mistral:mistral-small-latest">🌪️ Mistral Small</option>
                    </optgroup>
                    <optgroup label="DeepSeek AI">
                        <option value="deepseek:deepseek-chat">🐋 DeepSeek Chat</option>
                    </optgroup>
                    <optgroup label="Lainnya">
                        <option value="huggingface:default">🤗 Hugging Face</option>
                    </optgroup>
                </select>

                {/* AI Assist Button */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleAIAssist}
                    disabled={isOptimizing || !canGenerate}
                    className={cn(
                        'btn-secondary flex flex-1 items-center justify-center gap-2 py-2 text-xs',
                        !canGenerate && 'cursor-not-allowed opacity-40',
                    )}
                >
                    {isOptimizing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Wand2 className="h-3.5 w-3.5 text-purple-400" />
                    )}
                    Bantuan AI
                </motion.button>

                {/* Random Idea Button */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleRandomIdea}
                    className="btn-secondary flex items-center gap-2 py-2 text-xs"
                >
                    <Dice5 className="h-3.5 w-3.5 text-pink-400" />
                    Ide Acak
                </motion.button>
            </div>

            {/* Optimized Prompt Preview */}
            <AnimatePresence>
                {form.optimizedPrompt && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden rounded-xl border border-purple-500/20 bg-purple-900/10 p-3"
                    >
                        <div className="mb-1 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                            <span className="text-[11px] font-semibold text-purple-300">Prompt Hasil Optimasi AI:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-4">
                            {form.optimizedPrompt}
                        </p>
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={() => setForm({ prompt: form.optimizedPrompt, optimizedPrompt: '' })}
                                className="text-[11px] font-medium text-purple-400 hover:text-purple-300"
                            >
                                Gunakan prompt ini
                            </button>
                            <span className="text-slate-600">·</span>
                            <button
                                onClick={() => setForm({ optimizedPrompt: '' })}
                                className="text-[11px] text-slate-500 hover:text-slate-300"
                            >
                                Tutup
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
