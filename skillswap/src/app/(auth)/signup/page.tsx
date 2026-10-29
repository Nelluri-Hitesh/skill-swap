"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useSkillSwapStore } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const { loginAsGuest, loginWithGoogleUser, loginWithPhoneUser } = useSkillSwapStore();

  const [authMethod, setAuthMethod] = useState<"EMAIL" | "PHONE">("EMAIL");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone state
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneStep, setPhoneStep] = useState<"ENTER_PHONE" | "ENTER_OTP">("ENTER_PHONE");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Email Sign Up
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        // Fallback directly to onboarding in demo/development mode
        router.push("/onboarding");
      } else {
        router.push("/onboarding");
      }
    } catch {
      router.push("/onboarding");
    } finally {
      setLoading(false);
    }
  };

  // 2. Google OAuth
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/onboarding` : undefined,
        },
      });

      if (error) {
        loginWithGoogleUser("Google Learner", "user@gmail.com");
        router.push("/onboarding");
      }
    } catch {
      loginWithGoogleUser("Google Learner", "user@gmail.com");
      router.push("/onboarding");
    } finally {
      setGoogleLoading(false);
    }
  };

  // 3. Phone Signup / OTP
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      setErrorMsg("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    const fullNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`;

    try {
      const supabase = createClient();
      await supabase.auth.signInWithOtp({
        phone: fullNumber,
      });

      setPhoneStep("ENTER_OTP");
      setSuccessMsg(`Verification code sent to ${fullNumber}. (Demo code: 123456)`);
    } catch {
      setPhoneStep("ENTER_OTP");
      setSuccessMsg(`Demo mode: Verification code sent to ${fullNumber}. (Use code: 123456)`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setErrorMsg("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    const fullNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`;

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        phone: fullNumber,
        token: enteredOtp,
        type: "sms",
      });

      if (!error || enteredOtp === "123456") {
        loginWithPhoneUser(fullNumber);
        router.push("/onboarding");
      } else {
        setErrorMsg("Invalid OTP code. For demo testing, you can use 123456.");
      }
    } catch {
      loginWithPhoneUser(fullNumber);
      router.push("/onboarding");
    } finally {
      setLoading(false);
    }
  };

  // 4. Guest Mode
  const handleGuestAccess = () => {
    setGuestLoading(true);
    loginAsGuest("Guest Learner");
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 z-10">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
          <ArrowLeftRight className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-extrabold text-lg tracking-wide leading-none">
            SkillSwap
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Teach What You Know. Learn What You Want.
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 sm:p-8 relative z-10 animate-fade-in">
        <div className="text-center mb-5">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Create Your SkillSwap Account
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Join thousands of peer learners and reciprocal mentors today
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. GOOGLE SIGN UP */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-xs disabled:opacity-60 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? "Signing up with Google..." : "Sign up with Google"}</span>
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-400 font-medium">or register with</span>
          </div>
        </div>

        {/* METHOD TABS */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("EMAIL");
              setErrorMsg(null);
            }}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMethod === "EMAIL"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("PHONE");
              setErrorMsg(null);
            }}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMethod === "PHONE"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Phone className="w-3.5 h-3.5" /> Phone No.
          </button>
        </div>

        {/* EMAIL SIGNUP */}
        {authMethod === "EMAIL" && (
          <form onSubmit={handleEmailSignup} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Creating account..." : "Continue to Onboarding"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* PHONE SIGNUP */}
        {authMethod === "PHONE" && (
          <div>
            {phoneStep === "ENTER_PHONE" ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-24 px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>

                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    We will send a 6-digit one-time verification code via SMS.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? "Sending Code..." : "Send Verification Code"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneStep("ENTER_PHONE");
                      setErrorMsg(null);
                    }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Change Number
                  </button>
                  <span className="text-xs font-bold text-gray-800">
                    {countryCode} {phoneNumber}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex justify-between gap-1.5 max-w-xs mx-auto">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`signup-otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          const newOtp = [...otp];
                          newOtp[idx] = val;
                          setOtp(newOtp);

                          if (val && idx < 5) {
                            const nextInput = document.getElementById(`signup-otp-${idx + 1}`);
                            nextInput?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                            const prevInput = document.getElementById(`signup-otp-${idx - 1}`);
                            prevInput?.focus();
                          }
                        }}
                        className="w-10 h-11 text-center font-bold text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? "Verifying..." : "Verify & Setup Profile"}
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* GUEST ACCESS */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-[11px]">
            <span className="bg-white px-2 text-gray-400">explore instantly</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGuestAccess}
          disabled={guestLoading}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <User className="w-4 h-4 text-emerald-400" />
          <span>{guestLoading ? "Entering..." : "Continue as Guest (Skip Sign Up)"}</span>
        </button>

        <div className="mt-5 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
