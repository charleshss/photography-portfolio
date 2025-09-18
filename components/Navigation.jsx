// components/Navigation.jsx
import Link from 'next/link';

export default function Navigation() {
    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold">
                        SamuelSS.Photography
                    </Link>
                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className="hover:text-gray-600 transition">Home</Link>
                        <Link href="/portfolio" className="hover:text-gray-600 transition">Portfolio</Link>
                        <Link href="/about" className="hover:text-gray-600 transition">About</Link>
                        <Link href="/contact" className="hover:text-gray-600 transition">Contact</Link>
                    </div>
                    {/* Mobile menu button */}
                    <button className="md:hidden">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}