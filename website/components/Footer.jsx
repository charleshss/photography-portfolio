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
        <footer
            className="border-t text-center"
            style={{
                padding: `var(--spacing-xl) var(--spacing-md)`,
                fontSize: 'var(--text-sm)',
                color: 'var(--color-mid-grey)',
                borderColor: 'var(--color-light-grey)',
            }}
        >
            <div
                className="mx-auto flex max-w-7xl flex-col items-center justify-between sm:flex-row"
                style={{ gap: 'var(--spacing-md)' }}
            >
                <p style={{ fontSize: 'var(--text-sm)' }}>
                    © {new Date().getFullYear()} {siteInfo.businessName} | All
                    rights reserved.
                </p>
                <div className="flex" style={{ gap: 'var(--spacing-lg)' }}>
                    <a
                        href={`https://instagram.com/${siteInfo.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all duration-200 hover:-translate-y-0.5 hover:text-gray-900"
                        style={{
                            color: 'var(--color-mid-grey)',
                        }}
                        aria-label="Instagram"
                    >
                        <Instagram
                            style={{
                                height: 'var(--spacing-lg)',
                                width: 'var(--spacing-lg)',
                            }}
                        />
                    </a>
                    <a
                        href={`mailto:${siteInfo.email}`}
                        className="transition-all duration-200 hover:-translate-y-0.5 hover:text-gray-900"
                        style={{
                            color: 'var(--color-mid-grey)',
                        }}
                        aria-label="Email"
                    >
                        <Mail
                            style={{
                                height: 'var(--spacing-lg)',
                                width: 'var(--spacing-lg)',
                            }}
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}
