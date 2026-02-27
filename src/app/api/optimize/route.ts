import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt, style, ai } = await req.json();

        const provider = ai.split(':')[0];
        const model = ai.substring(provider.length + 1) || ai;

        const systemPrompt = `Kamu adalah AI ahli membuat prompt gambar stiker untuk AI Generator. 
Tugasmu adalah mengubah ide sederhana pengguna menjadi deskripsi visual yang sangat detail.
Sertakan: gaya seni (${style}), warna dominan, ekspresi karakter, detail latar belakang (jika ada), pencahayaan, dan komposisi.
Buat dalam 1-2 paragraf padat. Jangan jelaskan atau menyapa, AWALI LANGSUNG DENGAN PROMPT GAMBARNYA SAJA.
PENTING: TULISKAN HASIL DESKRIPSI (PROMPT) DALAM BAHASA INDONESIA.`;

        // 1. Gemini
        if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `${systemPrompt}\n\nIde: "${prompt}"` }] }],
                        generationConfig: { maxOutputTokens: 500, temperature: 0.8 },
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Gemini API failed');
            return NextResponse.json({ result: data.candidates?.[0]?.content?.parts?.[0]?.text || '' });
        }

        // OpenAI-compatible providers (Groq, OpenRouter, Together, Mistral, DeepSeek)
        let apiUrl = '';
        let apiKey = '';

        if (provider === 'groq' && process.env.GROQ_API_KEY) {
            apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
            apiKey = process.env.GROQ_API_KEY;
        } else if (provider === 'openrouter' && process.env.OPENROUTER_API_KEY) {
            apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
            apiKey = process.env.OPENROUTER_API_KEY;
        } else if (provider === 'together' && process.env.TOGETHER_API_KEY) {
            apiUrl = 'https://api.together.xyz/v1/chat/completions';
            apiKey = process.env.TOGETHER_API_KEY;
        } else if (provider === 'mistral' && process.env.MISTRAL_API_KEY) {
            apiUrl = 'https://api.mistral.ai/v1/chat/completions';
            apiKey = process.env.MISTRAL_API_KEY;
        } else if (provider === 'deepseek' && process.env.DEEPSEEK_API_KEY) {
            apiUrl = 'https://api.deepseek.com/chat/completions';
            apiKey = process.env.DEEPSEEK_API_KEY;
        }

        if (apiUrl && apiKey) {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                    ...(provider === 'openrouter' && { 'HTTP-Referer': 'http://localhost:3000', 'X-Title': 'VerozGenerator' }),
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Ide: "${prompt}"` },
                    ],
                    max_tokens: 500,
                    temperature: 0.8,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || `${provider} API failed`);
            return NextResponse.json({ result: data.choices?.[0]?.message?.content || '' });
        }

        // Fallback: simple template (if no API keys match)
        const fallback = `A high-quality ${style.toLowerCase()} style sticker illustration of: ${prompt}. 
    Vibrant colors, clean design, sticker-ready with bold outlines, white background, centered composition, 
    professional digital art style, full detail, 4k quality.`;
        return NextResponse.json({ result: fallback });
    } catch (err: any) {
        console.error('Optimize error:', err);
        return NextResponse.json(
            { error: err.message || 'Terjadi kesalahan sistem saat menghubungi AI.' },
            { status: 500 }
        );
    }
}
