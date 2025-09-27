// components/Footer.jsx
import { Instagram, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t py-8 text-center text-sm text-gray-500">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
                <p>
                    © {new Date().getFullYear()} SamuelSS. Photography | All rights reserved.
                </p>
                <div className="flex gap-6">
                    <a
                        href="https://instagram.com/samuelwss_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 transition"
                        aria-label="Instagram"
                    >
                        <Instagram className="h-5 w-5" />
                    </a>
                    <a
                        href="mailto:youremail@example.com"
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
