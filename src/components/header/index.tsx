"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { title: "about", href: "/about" },
    { title: "blogs", href: "/blog" },
  ];

  return (
    <header className="bg-[#ff6600]">
      <div className="max-w-5xl mx-auto px-2 py-0.5">
        <div className="flex items-center justify-between text-sm">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center gap-2">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-1.5 text-black hover:no-underline"
            >
              <span className="border border-white px-1 font-bold text-sm">G</span>
              <span className="font-bold">Gabriel&apos;s Blog</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1 ml-2">
              {navLinks.map((link, index) => (
                <span key={link.href} className="flex items-center">
                  {index > 0 && <span className="mx-1 text-black">|</span>}
                  <Link
                    href={link.href}
                    className={cn(
                      "text-black hover:underline",
                      pathname === link.href && "font-medium"
                    )}
                  >
                    {link.title}
                  </Link>
                </span>
              ))}
            </nav>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center gap-3">
            {config.social?.github && (
              <Link 
                href={config.social.github} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline"
              >
                github
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
