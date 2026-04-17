"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch {
      toast.error("Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id="navbar-logout-btn"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <svg
            className="animate-spin"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="6"
              cy="6"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="20 8"
            />
          </svg>
          Signing out…
        </>
      ) : (
        <>
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-60"
          >
            <path
              d="M5 10.5H3a1 1 0 01-1-1v-7a1 1 0 011-1h2M8.5 9l3-3-3-3M11.5 6.5H5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Sign Out
        </>
      )}
    </button>
  );
}
