/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingRoot: process.cwd(),
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
    // Fix for Vercel serverless function dependency issues
    experimental: {
        outputFileTracingIncludes: {
            '/api/**/*': ['./node_modules/styled-jsx/**/*'],
        },
    },
    serverExternalPackages: [],
}

export default nextConfig
