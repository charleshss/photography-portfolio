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
        <footer className="border-t border-border bg-charcoal">
            <div className="mx-auto max-w-7xl px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-foreground mb-2">
                            {siteInfo.businessName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Wildlife & Nature Photography
                        </p>
                    </div>

                    {/* Social Links - Large & Prominent */}
                    <div className="flex items-center justify-center gap-6">
                        <a
                            href={`https://instagram.com/${siteInfo.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center w-14 h-14 rounded-full bg-slate border border-border transition-all duration-300 hover:bg-accent hover:border-accent hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/30"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-6 h-6 text-muted-foreground group-hover:text-midnight transition-colors" />
                        </a>
                        <a
                            href={`mailto:${siteInfo.email}`}
                            className="group flex items-center justify-center w-14 h-14 rounded-full bg-slate border border-border transition-all duration-300 hover:bg-accent hover:border-accent hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/30"
                            aria-label="Email"
                        >
                            <Mail className="w-6 h-6 text-muted-foreground group-hover:text-midnight transition-colors" />
                        </a>
                    </div>

                    {/* Contact Info */}
                    <div className="text-center md:text-right">
                        <p className="text-sm text-muted-foreground mb-1">
                            {siteInfo.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            @{siteInfo.instagram}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border mb-6" />

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {siteInfo.businessName}. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
