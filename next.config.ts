import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    /* config options here */
    // config images
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cbqknxrtiutdktcpcljx.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
};

export default nextConfig;
