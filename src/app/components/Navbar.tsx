import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth-session");
  const isLoggedIn = !!session?.value;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Subtle top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(10,10,18,0.9) 100%)",
          backdropFilter: "blur(20px) saturate(1.5)",
          WebkitBackdropFilter: "blur(20px) saturate(1.5)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "0 1px 0 0 rgba(99,102,241,0.08), 0 8px 32px -8px rgba(0,0,0,0.5)",
        }}
      >
        <nav className="flex items-center justify-between px-8 md:px-20 py-3.5 max-w-[1440px] mx-auto w-full">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            {/* Wordmark */}
            <span
              className="text-[17px] font-bold tracking-tight"
              style={{
                background:
                  "linear-gradient(90deg, #e0e7ff 0%, #a5b4fc 50%, #c4b5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}
            >
              JournalX
            </span>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <NavLink href="/journal">Journal</NavLink>
                <NavLink href="/insights">Insights</NavLink>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <LogoutButton />
              </>
            ) : (
              <>
                <NavLink href="/login">Log in</NavLink>

                {/* CTA Button */}
                <Link
                  href="/signup"
                  id="navbar-cta-signup"
                  className="relative ml-1 group"
                >
                  <div
                    className="absolute -inset-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #6366f1, #a855f7)",
                    }}
                  />
                  <span
                    className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.9) 0%, rgba(139,92,246,0.9) 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    Get Started
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200"
                    >
                      <path
                        d="M2.5 6h7M6.5 3l3 3-3 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

// Reusable nav link with subtle hover state
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-200 rounded-lg hover:bg-white/[0.05] group"
    >
      {children}
      <span
        className="absolute bottom-1 left-3 right-3 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
        }}
      />
    </Link>
  );
}
