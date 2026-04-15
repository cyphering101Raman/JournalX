import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth-session");
  const isLoggedIn = !!session?.value;

  return (
    <div className="fixed top-0 left-0 w-full z-50 text-white bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 shadow-sm">
      <nav className="flex items-center justify-between px-20 py-4 max-w-[1440px] mx-auto w-full">
        <Link href="/" className="group">
          <h1 className="text-xl font-bold tracking-wide text-indigo-50 hover:text-white transition-colors">
            AI Journal
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/journal"
                className="text-sm font-medium hover:text-zinc-300 transition-colors"
              >
                Journal Editor
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-zinc-300 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
