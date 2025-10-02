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
            className={`sticky top-0 z-50 border-b border-transparent backdrop-blur-2xl transition-all duration-500 ${
                scrolled
                    ? 'bg-[rgba(8,10,15,0.9)] border-border/70 shadow-[var(--shadow-strong)]'
                    : 'bg-transparent'
            }`}
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <Link href="/" className="group flex items-center gap-3">
                        {!logoError ? (
                            <Image
                                src="/logo.png"
                                alt="SamuelSS Photography Logo"
                                width={200}
                                height={48}
                                className="h-11 w-auto transition-transform duration-500 group-hover:scale-105"
                                priority
                                onError={() => setLogoError(true)}
                                style={{ filter: 'brightness(0) invert(1)' }}
                            />
                        ) : (
                            /* Text fallback when logo fails to load */
                            <span className="text-xl font-semibold tracking-[0.24em] text-foreground transition-colors group-hover:text-primary">
                                SamuelSS. Photography
                            </span>
                        )}
                    </Link>

                    <div className="hidden items-center gap-10 md:flex">
                        <Link href="/" className="nav-link">
                            Home
                        </Link>
                        <Link href="/portfolio" className="nav-link">
                            Portfolio
                        </Link>
                        <Link href="/about" className="nav-link">
                            About
                        </Link>
                        <Link href="/contact" className="nav-link">
                            Contact
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-foreground"
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
                <div className="border-t border-border/60 bg-surface-alt/95 backdrop-blur-xl md:hidden">
                    <div className="space-y-1 p-4">
                        <Link
                            href="/"
                            className="block rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-200 hover:bg-white/5 hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/portfolio"
                            className="block rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-200 hover:bg-white/5 hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Portfolio
                        </Link>
                        <Link
                            href="/about"
                            className="block rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-200 hover:bg-white/5 hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="block rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-200 hover:bg-white/5 hover:text-foreground"
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
