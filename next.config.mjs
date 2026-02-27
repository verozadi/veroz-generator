/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'image.pollinations.ai' },
            { protocol: 'https', hostname: 'api-inference.huggingface.co' },
            { protocol: 'https', hostname: '**.huggingface.co' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        ],
    },
};

export default nextConfig;
