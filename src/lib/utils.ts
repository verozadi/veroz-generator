import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function generateId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
}

export const ASPECT_RATIOS = [
    // Stiker
    { label: '1:1 — Stiker / Instagram Square', value: '1:1', width: 1024, height: 1024, category: 'Stiker' },
    // Instagram
    { label: '4:5 — Instagram Portrait', value: '4:5', width: 1024, height: 1280, category: 'Instagram' },
    { label: '1.91:1 — Instagram Landscape', value: '1.91:1', width: 1024, height: 536, category: 'Instagram' },
    // Story / Wallpaper
    { label: '9:16 — Story / Wallpaper Portrait', value: '9:16', width: 576, height: 1024, category: 'Story & Wallpaper' },
    { label: '16:9 — Banner / Cover / Wallpaper Landscape', value: '16:9', width: 1024, height: 576, category: 'Banner & Wallpaper' },
    // Twitter / X
    { label: '16:9 — Twitter/X Header', value: '16:9-tw', width: 1500, height: 844, category: 'Twitter/X' },
    { label: '2:1 — Twitter/X Post', value: '2:1', width: 1024, height: 512, category: 'Twitter/X' },
    // Facebook
    { label: '1.91:1 — Facebook Cover', value: 'fb-cover', width: 1640, height: 859, category: 'Facebook' },
    { label: '1:1 — Facebook Post Square', value: 'fb-sq', width: 1080, height: 1080, category: 'Facebook' },
    // YouTube
    { label: '16:9 — YouTube Thumbnail', value: 'yt-thumb', width: 1280, height: 720, category: 'YouTube' },
    // TikTok / Reels
    { label: '9:16 — TikTok / Reels', value: 'tiktok', width: 1080, height: 1920, category: 'TikTok & Reels' },
    // Pinterest
    { label: '2:3 — Pinterest Pin', value: '2:3', width: 1000, height: 1500, category: 'Pinterest' },
    // LinkedIn
    { label: '1.91:1 — LinkedIn Banner', value: 'li-banner', width: 1584, height: 829, category: 'LinkedIn' },
    // Custom
    { label: '⚙️ Custom...', value: 'custom', width: 1024, height: 1024, category: 'Custom' },
] as const;

export type AspectRatioValue = typeof ASPECT_RATIOS[number]['value'];

export async function upscaleImage(imageUrl: string, targetSize = 5000): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Important for fetching external URLs (like Supabase storage or API responses)
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas 2D context not available'));

            // Calculate new dimensions maintaining aspect ratio
            const scale = Math.max(targetSize / img.width, targetSize / img.height);
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);

            // Use high quality image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw scaled image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Return as high-quality PNG
            resolve(canvas.toDataURL('image/png', 1.0));
        };
        img.onerror = () => reject(new Error('Failed to load image for upscaling'));
        img.src = imageUrl;
    });
}
