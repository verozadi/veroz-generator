import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Veroz Generator — AI Sticker, Banner & Wallpaper Creator',
    description:
        'Generate stickers, banners, and wallpapers with AI. Supports 12 art styles, high-res 5000px export, prompt optimizer, and transparent background.',
    keywords: ['AI sticker generator', 'ai image generator', 'banner generator', 'wallpaper AI'],
    openGraph: {
        title: 'Veroz Generator',
        description: 'AI-powered sticker, banner & wallpaper generator.',
        type: 'website',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" className="dark">
            <body className={inter.className}>
                {/* Animated Background Blobs */}
                <div className="bg-blob-purple" />
                <div className="bg-blob-pink" />
                <div className="bg-blob-blue" />

                {/* App Shell */}
                <AuthProvider>
                    <div className="relative z-10 flex min-h-screen flex-col">
                        <Navbar />
                        <main className="relative flex-1">{children}</main>
                        <footer className="border-t border-white/[0.05] py-4 text-center text-xs text-slate-600">
                            © 2025 Veroz Generator — Dibuat dengan ❤️ &amp; AI
                        </footer>
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
