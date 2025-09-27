// app/photo/[slug]/not-found.js
import Link from 'next/link';
import { Camera } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <Camera size={64} className="mx-auto text-gray-400 mb-6" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Photo Not Found
                </h1>
                <p className="text-gray-600 mb-8">
                    The photo you&apos;re looking for doesn&apos;t exist or may have been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                        Browse Portfolio
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </main>
    );
}