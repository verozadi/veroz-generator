import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt, style, ai } = await req.json();

        const systemPrompt = `Kamu adalah AI ahli membuat prompt gambar stiker. 
Tugasmu adalah mengubah ide sederhana pengguna menjadi deskripsi visual yang sangat detail dalam bahasa Inggris untuk model AI gambar.
Sertakan: gaya seni (${style}), warna dominan, ekspresi karakter, detail latar belakang (jika ada), pencahayaan, dan komposisi.
Gunakan kata kunci yang relevan untuk model diffusion. Buat dalam 1-2 paragraf padat. Jangan jelaskan, langsung berikan promptnya saja.`;

        if (ai === 'gemini' && process.env.GEMINI_API_KEY) {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `${systemPrompt}\n\nIde: "${prompt}"` }] }],
                        generationConfig: { maxOutputTokens: 500, temperature: 0.8 },
                    }),
                },
            );
            const data = await res.json();
            if (!res.ok) {
                console.error('Gemini Error:', data);
                return NextResponse.json({ error: data.error?.message || 'Gemini API failed' }, { status: res.status });
            }
            const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            return NextResponse.json({ result });
        }

        if (ai === 'groq' && process.env.GROQ_API_KEY) {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'llama3-8b-8192',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Ide: "${prompt}"` },
                    ],
                    max_tokens: 500,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('Groq Error:', data);
                return NextResponse.json({ error: data.error?.message || 'Groq API failed' }, { status: res.status });
            }
            const result = data.choices?.[0]?.message?.content || '';
            return NextResponse.json({ result });
        }

        // Fallback: simple template
        const fallback = `A high-quality ${style.toLowerCase()} style sticker illustration of: ${prompt}. 
    Vibrant colors, clean design, sticker-ready with bold outlines, white background, centered composition, 
    professional digital art style, full detail, 4k quality.`;
        return NextResponse.json({ result: fallback });
    } catch (err) {
        console.error('Optimize error:', err);
        return NextResponse.json({ error: 'Gagal melakukan optimasi prompt.' }, { status: 500 });
    }
}
