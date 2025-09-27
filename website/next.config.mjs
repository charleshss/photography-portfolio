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
}

export default nextConfig