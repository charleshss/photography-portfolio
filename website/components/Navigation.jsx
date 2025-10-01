// components/Navigation.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
    const [logoError, setLogoError] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm'
                    : 'bg-white/80 backdrop-blur-md border-b border-transparent'
            }`}
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div
                    className="flex items-center justify-between"
                    style={{ height: 'var(--spacing-4xl)' }}
                >
                    <Link href="/" className="flex items-center group">
                        {!logoError ? (
                            <Image
                                src="/logo.png"
                                alt="SamuelSS Photography Logo"
                                width={200}
                                height={48}
                                className="transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
                                style={{
                                    width: 'auto',
                                    height: 'var(--spacing-2xl)',
                                }}
                                priority
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            /* Text fallback when logo fails to load */
                            <span
                                className="font-bold transition-colors group-hover:text-gray-700"
                                style={{
                                    fontSize: 'var(--text-xl)',
                                    color: 'var(--color-rich-black)',
                                }}
                            >
                                SamuelSS. Photography
                            </span>
                        )}
                    </Link>

                    <div
                        className="hidden md:flex items-center"
                        style={{ gap: 'var(--spacing-xl)' }}
                    >
                        <Link
                            href="/"
                            className="font-medium transition-all duration-200 hover:text-gray-600 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gray-900 after:transition-all after:duration-200 hover:after:w-full"
                            style={{
                                fontSize: 'var(--text-base)',
                                letterSpacing: '0.01em',
                            }}
                        >
                            Home
                        </Link>
                        <Link
                            href="/portfolio"
                            className="font-medium transition-all duration-200 hover:text-gray-600 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gray-900 after:transition-all after:duration-200 hover:after:w-full"
                            style={{
                                fontSize: 'var(--text-base)',
                                letterSpacing: '0.01em',
                            }}
                        >
                            Portfolio
                        </Link>
                        <Link
                            href="/about"
                            className="font-medium transition-all duration-200 hover:text-gray-600 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gray-900 after:transition-all after:duration-200 hover:after:w-full"
                            style={{
                                fontSize: 'var(--text-base)',
                                letterSpacing: '0.01em',
                            }}
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="font-medium transition-all duration-200 hover:text-gray-600 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gray-900 after:transition-all after:duration-200 hover:after:w-full"
                            style={{
                                fontSize: 'var(--text-base)',
                                letterSpacing: '0.01em',
                            }}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden"
                        aria-label="Toggle menu"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
                    <div
                        className="space-y-1"
                        style={{
                            padding: 'var(--spacing-md)',
                        }}
                    >
                        <Link
                            href="/"
                            className="block font-medium hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            style={{
                                fontSize: 'var(--text-base)',
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                color: 'var(--color-rich-black)',
                            }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/portfolio"
                            className="block font-medium hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            style={{
                                fontSize: 'var(--text-base)',
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                color: 'var(--color-rich-black)',
                            }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Portfolio
                        </Link>
                        <Link
                            href="/about"
                            className="block font-medium hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            style={{
                                fontSize: 'var(--text-base)',
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                color: 'var(--color-rich-black)',
                            }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="block font-medium hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            style={{
                                fontSize: 'var(--text-base)',
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                color: 'var(--color-rich-black)',
                            }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
