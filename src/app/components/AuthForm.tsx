"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success(type === "login" ? "Logged in successfully!" : "Account created successfully!");
        window.location.href = "/";
      } else {
        setMessage(data.message || data.error || "Authentication failed.");
      }
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all"
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white mb-8 tracking-tight">
          {type === "login" ? "Welcome back" : "Create your account"}
        </h2>

        {/* Name */}
        {type === "signup" && (
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-sm font-medium text-zinc-300">Name</label>
            <input
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              placeholder="John Doe"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm font-medium text-zinc-300">Email</label>
          <input
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
            placeholder="you@example.com"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 mb-8">
          <label className="text-sm font-medium text-zinc-300">Password</label>
          <input
            type="password"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
            placeholder="••••••••"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Please wait..."
            : type === "login"
              ? "Sign in"
              : "Create account"}
        </button>

        {/* Message */}
        {message && (
          <div className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-sm font-medium text-red-400">
              {message}
            </p>
          </div>
        )}

        {/* Switch */}
        <p className="mt-8 text-sm text-center text-zinc-400">
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span className="text-indigo-400 font-medium cursor-pointer hover:text-indigo-300 hover:underline transition-colors">
            {type === "login" ? "Sign up" : "Log in"}
          </span>
        </p>
      </form>
    </div>
  );
}