import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { DeviceProvider } from '@/contexts/DeviceContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: "Samuel's Photography Portfolio",
    description: 'Professional wildlife and landscape photography',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body className={inter.className}>
                <DeviceProvider>
                    <Navigation />
                    {children}
                    <Footer />
                </DeviceProvider>
            </body>
        </html>
    );
}
