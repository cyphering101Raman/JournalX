"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const hasToken =
      document.cookie.includes("token=") ||
      document.cookie.includes("auth-session=");
    setIsLoggedIn(hasToken);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#07080e]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3 active:scale-95 transition-transform">
          <Image
            src="/JournalX-icon.png"
            alt="JournalX Icon"
            width={34}
            height={34}
            className="rounded-xl object-contain group-hover:scale-105 transition-transform"
          />
          <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-300 bg-clip-text text-transparent">
            JournalX
          </span>
        </Link>

        {/* Navigation Links & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              <NavLink href="/journal">Journal</NavLink>
              <NavLink href="/insights">Insights</NavLink>
              <div className="w-px h-4 bg-white/10 mx-1 sm:mx-2" />
              <LogoutButton />
            </>
          ) : (
            <>
              <NavLink href="/login">Log in</NavLink>

              {/* Get Started CTA */}
              <Link
                href="/signup"
                id="navbar-cta-signup"
                className="relative group ml-1"
              >
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                <span className="relative flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 shadow-lg transition-all active:scale-95">
                  Get Started
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Reusable NavLink with active state detection
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 rounded-full ${
        isActive
          ? "text-white bg-indigo-500/20 border border-indigo-500/35 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
          : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </Link>
  );
}
