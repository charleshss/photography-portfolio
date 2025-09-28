// components/Footer.jsx
import { Instagram, Mail } from 'lucide-react';
import { serverClient } from '@/lib/sanity';

async function getSiteInfo() {
    try {
        const [contactData, homeData] = await Promise.all([
            serverClient.fetch(
                `*[_type == "contactPageNew"][0]{
          email,
          instagramUsername
        }`,
                {},
                { next: { revalidate: 60 } }
            ),
            serverClient.fetch(
                `*[_type == "homePage"][0]{
          businessName
        }`,
                {},
                { next: { revalidate: 60 } }
            ),
        ]);

        return {
            email: contactData?.email || 'contact@samuelss.photography',
            instagram: contactData?.instagramUsername || 'samuelss_photography',
            businessName: homeData?.businessName || 'SamuelSS. Photography',
        };
    } catch (error) {
        console.log('Sanity CMS not available, using fallback site info');
        return {
            email: 'contact@samuelss.photography',
            instagram: 'samuelss_photography',
            businessName: 'SamuelSS. Photography',
        };
    }
}

export default async function Footer() {
    const siteInfo = await getSiteInfo();

    return (
        <footer className="border-t py-8 text-center text-sm text-gray-500">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
                <p>
                    © {new Date().getFullYear()} {siteInfo.businessName} | All
                    rights reserved.
                </p>
                <div className="flex gap-6">
                    <a
                        href={`https://instagram.com/${siteInfo.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 transition"
                        aria-label="Instagram"
                    >
                        <Instagram className="h-5 w-5" />
                    </a>
                    <a
                        href={`mailto:${siteInfo.email}`}
                        className="text-gray-500 hover:text-gray-900 transition"
                        aria-label="Email"
                    >
                        <Mail className="h-5 w-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
