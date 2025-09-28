/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingRoot: process.cwd(),
    experimental: {
        devtoolSegmentExplorer: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                port: '',
                pathname: '/images/**',
            },
        ],
    },
    // Fix for Vercel deployment issues with Next.js 15
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push({
                'source-map': 'commonjs source-map'
            });
        }
        return config;
    },
}

export default nextConfig
