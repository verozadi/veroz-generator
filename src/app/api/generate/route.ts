import { NextRequest, NextResponse } from 'next/server';

// Style to suffix mapping
const styleKeywords: Record<string, string> = {
    '2D Flat': 'flat design, vector art, bold outlines, solid colors, minimalistic 2D illustration',
    '3D Render': '3D render, ray tracing, volumetric lighting, depth of field, photorealistic 3D model',
    Animated: 'animated character, cartoon style, expressive, dynamic pose, colorful animation frame',
    Kawaii: 'kawaii style, cute chibi, pastel colors, big eyes, Japanese cute aesthetic, soft shading',
    'Pixel Art': 'pixel art, 16-bit style, retro pixels, isometric pixel, clean pixel grid',
    'Neon Glow': 'neon glow, synthwave, glowing outlines, dark background, neon colors, cyberpunk aesthetic',
    Watercolor: 'watercolor painting, soft edges, color bleeding, paper texture, artistic watercolor strokes',
    Comic: 'comic book style, halftone dots, bold lines, speech bubble, manga illustration',
    Minimalist: 'minimalist, simple shapes, limited palette, clean whitespace, geometric minimal design',
    Retro: 'retro style, vintage aesthetic, 80s colors, nostalgic, old school illustration',
    Holographic: 'holographic, iridescent, rainbow shimmer, metallic foil, futuristic hologram effect',
    Emoji: 'emoji style, expressive face, bright colors, simple icon, flat emoji design',
};

function buildPollinationsUrl(prompt: string, width: number, height: number): string {
    const encoded = encodeURIComponent(prompt + ', sticker white transparent background, high quality');
    return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;
}

async function generateWithHuggingFace(prompt: string, width: number, height: number): Promise<string | null> {
    if (!process.env.HF_API_KEY) return null;
    try {
        const res = await fetch(
            'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt + ', sticker art, transparent background, high quality',
                    parameters: { width: Math.min(width, 1024), height: Math.min(height, 1024) },
                }),
            },
        );
        if (!res.ok) return null;
        const blob = await res.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());
        return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { prompt, style, aiModel, width, height, isTransparent } = await req.json();

        const styleHint = styleKeywords[style] || '';
        const bgHint = isTransparent ? 'transparent PNG background, isolated character, no background' : '';
        const fullPrompt = `${prompt}, ${styleHint}, ${bgHint}, sticker design, high detail, 4k`.trim();

        if (aiModel === 'huggingface') {
            const dataUrl = await generateWithHuggingFace(fullPrompt, width, height);
            if (dataUrl) return NextResponse.json({ url: dataUrl });
            // Fallback to pollinations
        }

        // Default & fallback: Pollinations.ai
        const url = buildPollinationsUrl(fullPrompt, width, height);
        return NextResponse.json({ url });
    } catch (err) {
        console.error('Generate error:', err);
        return NextResponse.json({ error: 'Gagal membuat gambar.' }, { status: 500 });
    }
}
