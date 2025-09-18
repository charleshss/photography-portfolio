import Link from 'next/link';

export default function Navigation() {
    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold">
                        SamuelSS.Photography
                    </Link>
                    <div className="flex space-x-8">
                        <Link href="/" className="hover:text-gray-600">Home</Link>
                        <Link href="/portfolio" className="hover:text-gray-600">Portfolio</Link>
                        <Link href="/about" className="hover:text-gray-600">About</Link>
                        <Link href="/contact" className="hover:text-gray-600">Contact</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}