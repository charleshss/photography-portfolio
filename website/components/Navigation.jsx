// components/Navigation.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
    const [logoError, setLogoError] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        {!logoError ? (
                            <Image
                                src="/logo.png"
                                alt="SamuelSS Photography Logo"
                                width={200}
                                height={48}
                                className="h-12 transition-transform duration-200 group-hover:scale-105"
                                style={{ width: 'auto', height: '3rem' }}
                                priority
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            /* Text fallback when logo fails to load */
                            <span className="text-xl font-bold text-gray-900 transition-colors group-hover:text-gray-700">
                                SamuelSS. Photography
                            </span>
                        )}
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm">
                        <Link href="/" className="transition hover:text-gray-600">Home</Link>
                        <Link href="/portfolio" className="transition hover:text-gray-600">Portfolio</Link>
                        <Link href="/about" className="transition hover:text-gray-600">About</Link>
                        <Link href="/contact" className="transition hover:text-gray-600">Contact</Link>
                    </div>

                    {/* Mobile menu button (placeholder) */}
                    <button className="md:hidden" aria-label="Open menu">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
