"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { validateSignup, validateLogin } from "@/app/utils/validators";

export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field when user types
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setMessage("");

    // Frontend Validation
    const errors = type === "signup" ? validateSignup(form) : validateLogin(form);
    if (errors) {
      setFieldErrors(errors as Record<string, string>);
      return;
    }

    setLoading(true);

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
        const err = data.error || data.message;
        const msg = typeof err === "object" ? Object.values(err)[0] as string : err;
        setMessage(msg || "Authentication failed.");
      }
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black px-4 sm:px-6 lg:px-8 py-12 md:py-20">
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
              className={`px-4 py-3 rounded-xl bg-white/5 border ${fieldErrors.name ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all`}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {fieldErrors.name && (
              <p className="text-[11px] text-red-400 font-medium px-1 mt-0.5 animate-in fade-in slide-in-from-top-1">
                {fieldErrors.name}
              </p>
            )}
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm font-medium text-zinc-300">Email</label>
          <input
            className={`px-4 py-3 rounded-xl bg-white/5 border ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all`}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          {fieldErrors.email && (
            <p className="text-[11px] text-red-400 font-medium px-1 mt-0.5 animate-in fade-in slide-in-from-top-1">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 mb-8">
          <label className="text-sm font-medium text-zinc-300">Password</label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all pr-12`}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-[11px] text-red-400 font-medium px-1 mt-0.5 animate-in fade-in slide-in-from-top-1">
              {fieldErrors.password}
            </p>
          )}
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
          <Link 
            href={type === "login" ? "/signup" : "/login"}
            className="text-indigo-400 font-medium cursor-pointer hover:text-indigo-300 hover:underline transition-colors"
          >
            {type === "login" ? "Sign up" : "Log in"}
          </Link>
        </p>
      </form>
    </div>
  );
}