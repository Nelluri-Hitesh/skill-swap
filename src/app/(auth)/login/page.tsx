"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Phone,
  ArrowsLeftRight,
  Check,
  Sparkle,
  EyeClosed,
  Eye,
  EnvelopeSimple,
  ArrowRight,
  User
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("you@example.com");
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.user) {
        login(data.user);
      } else {
        login({ email: email.includes("@") ? email : "alex@skillswap.dev", name: "Alex Mercer" });
      }
      // router.push("/dashboard");
    } catch (e) {
      console.error(e);
      login({ email: "alex@skillswap.dev", name: "Alex Mercer" });
      // router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (userEmail = "alex@skillswap.dev", name = "Alex Mercer") => {
    login({
      id: "usr_current",
      name: name,
      username: "alexmercer",
      email: userEmail,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      headline: "Full-Stack Dev & React Specialist",
      credits: 140,
      rating: "4.9",
      reviewCount: 18,
    });
    // router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-center items-center p-4 sm:p-6 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Brand Logo Header */}
      <div className="flex flex-col items-center mb-6 text-center space-y-2">
        <div className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-200 border border-white/10 backdrop-blur-xs">
            <img src="/logo-icon.png" alt="SkillSwap Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-left">
            <span className="font-black text-white text-2xl tracking-tight block">
              SkillSwap
            </span>
            <span className="text-xs text-slate-400 font-medium block -mt-0.5">
              Teach What You Know. Learn What You Want.
            </span>
          </div>
        </div>
      </div>

      {/* Main White Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200/90 space-y-5 animate-in fade-in zoom-in-95 duration-300">
        {/* Card Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to SkillSwap
          </h1>
          <p className="text-xs text-slate-500 font-medium">

          </p>
        </div>



        {/* Tab Switcher (Email / Phone No.) */}
        <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-2 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === "email"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 font-semibold hover:text-slate-900"
              }`}
          >
            <EnvelopeSimple className="w-3.5 h-3.5" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("phone")}
            className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === "phone"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 font-semibold hover:text-slate-900"
              }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Phone No.
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "email" ? (
            <div>
              <label className="text-[10px] font-black text-slate-700 tracking-wider uppercase mb-1 block">
                GMAIL
              </label>
              <div className="relative">
                <EnvelopeSimple className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-medium transition-all"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-black text-slate-700 tracking-wider uppercase mb-1 block">
                PHONE NUMBER
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-medium transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-black text-slate-700 tracking-wider uppercase mb-1 block">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeClosed className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In with Email"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider 2 */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-200/90 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 absolute">
            instant access
          </span>
        </div>

        {/* Guest & Demo Instant Login Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("guest@skillswap.dev", "Guest User")}
            className="w-full py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <User className="w-4 h-4 text-cyan-400" />
            Continue as Guest (No Sign Up Needed)
          </button>
        </div>



        {/* Footer Create Account Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-extrabold">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
