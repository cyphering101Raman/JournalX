"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { validateSignup, validateLogin } from "@/app/utils/validators";
import api from "@/app/lib/axios";

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

    const errors = type === "signup" ? validateSignup(form) : validateLogin(form);
    if (errors) {
      setFieldErrors(errors as Record<string, string>);
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(`/auth/${type}`, form);
      document.cookie = "auth-session=true; path=/; max-age=604800; SameSite=Lax";
      toast.success(type === "login" ? "Logged in successfully!" : "Account created successfully!");
      window.location.href = "/";
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Authentication failed.";
      const msg = typeof errorMsg === "object" ? (Object.values(errorMsg)[0] as string) : errorMsg;
      setMessage(msg || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-screen h-[100dvh] max-h-screen w-full bg-[#07080E] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Background image container - crisp, full-screen artwork */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={type === "signup" ? "/signup-page.png" : "/login-page.png"}
          alt="JournalX Ambient Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle vignette overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center pt-16 sm:pt-20 pb-4 overflow-hidden">
        {/* Left Column Spacer */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7" />

        {/* Right Column - Auth Form Card */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-[#101222]/85 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative">
            {/* Card Header Icon & Title */}
            <div className="flex flex-col items-center text-center mb-6">
              <Image
                src="/JournalX-icon.png"
                alt="JournalX Logo"
                width={48}
                height={48}
                className="object-contain mb-3 hover:scale-105 transition-transform drop-shadow-md"
              />
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {type === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {type === "login" ? "Continue your journaling journey with JournalX" : "Start your journaling journey with JournalX"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {/* Name Field (Signup) */}
              {type === "signup" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-zinc-300">Name</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181a2e] border ${fieldErrors.name ? 'border-red-500/60' : 'border-zinc-800 focus:border-indigo-500/80'} text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all`}
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-xs text-red-400 font-medium px-1 mt-0.5">{fieldErrors.name}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-zinc-300">Email</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181a2e] border ${fieldErrors.email ? 'border-red-500/60' : 'border-zinc-800 focus:border-indigo-500/80'} text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-400 font-medium px-1 mt-0.5">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-zinc-300">Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#181a2e] border ${fieldErrors.password ? 'border-red-500/60' : 'border-zinc-800 focus:border-indigo-500/80'} text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all`}
                    placeholder={type === "signup" ? "Create a password" : "Enter your password"}
                    value={form.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.97 8.97 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 00-4.243-4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-400 font-medium px-1 mt-0.5">{fieldErrors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              {type === "login" && (
                <div className="flex justify-end text-xs text-zinc-400">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast("Password reset feature coming soon!", { icon: "ℹ️" });
                    }}
                    className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.99] shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>
                  {loading
                    ? "Please wait..."
                    : type === "login"
                      ? "Sign in"
                      : "Create account"}
                </span>
                {!loading && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>

              {/* Error / Feedback Message */}
              {message && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-center animate-in fade-in">
                  <p className="text-xs font-medium text-red-400">{message}</p>
                </div>
              )}

              {/* Bottom Switch Link */}
              <p className="mt-2 text-xs text-center text-zinc-400">
                {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <Link
                  href={type === "login" ? "/signup" : "/login"}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-colors"
                >
                  {type === "login" ? "Sign up" : "Log in"}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-2.5 text-center text-[11px] text-zinc-500">
        © {new Date().getFullYear()} JournalX. All rights reserved.
      </footer>
    </div>
  );
}
