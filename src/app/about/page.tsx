import { type Metadata } from "next";
import { config } from "@/lib/config";
import Link from "next/link";

export const metadata: Metadata = {
    title: `About | ${config.site.title}`,
    description: `About ${config.author.name} - ${config.author.bio}`,
};

export default function AboutPage() {
    return (
        <main className="max-w-5xl mx-auto px-2 py-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-lg font-medium text-black">
                    {config.author.name}
                </h1>
                <p className="text-[#828282] text-sm mt-1">
                    {config.author.email}
                </p>
            </div>

            {/* Bio */}
            <div className="mb-6">
                <p className="text-sm text-black leading-relaxed">
                    {config.author.bio}
                </p>
            </div>

            {/* Links */}
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-[#828282]">github:</span>
                    <Link 
                        href={config.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline"
                    >
                        {config.social.github.replace('https://github.com/', '')}
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#828282]">email:</span>
                    <a 
                        href={`mailto:${config.author.email}`}
                        className="text-black hover:underline"
                    >
                        {config.author.email}
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#828282]">location:</span>
                    <span className="text-black">Wuxi - Shenzhen - Hong Kong - Ningbo</span>
                </div>
            </div>

            {/* Separator */}
            <div className="my-6 border-t border-[#e5e5e5]"></div>

            {/* Back to blogs */}
            <Link 
                href="/blog"
                className="text-[#828282] text-sm hover:underline"
            >
                &lt; back to blogs
            </Link>
        </main>
    );
}
