"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await axios.post("/api/user", {
        name,
        username,
        email,
        password,
      });

      if (response.status === 201) {
        // Auto sign in after successful signup
        const signInResult = await signIn("credentials", {
          redirect: false,
          username,
          password,
        });

        if (signInResult?.ok) {
          router.push("/blogs");
          router.refresh();
        } else {
          router.push("/signin");
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setErrorMsg(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Glassmorphic card with neon border effects */}
      <div
        className="
          relative z-10 p-4 sm:p-6 md:p-10 w-[calc(100%-2rem)] sm:w-[90vw] md:w-[400px] max-w-[400px] rounded-xl sm:rounded-2xl mx-4
          bg-gradient-to-br from-white/90 via-white/85 to-white/90
          dark:from-[#0B0E10]/80 dark:via-[#0B0E10]/75 dark:to-[#0B0E10]/80
          backdrop-blur-[20px]
          border border-[#27B4F5]/40
          shadow-[0_0_40px_rgba(39,180,245,0.3),inset_0_1px_0_rgba(0,0,0,0.05)]
          dark:shadow-[0_0_40px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
          hover:shadow-[0_0_70px_rgba(39,180,245,0.5),inset_0_1px_0_rgba(0,0,0,0.1)]
          dark:hover:shadow-[0_0_70px_rgba(39,180,245,1),inset_0_1px_0_rgba(255,255,255,0.15)]
          transition-all duration-500 ease-out
          before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl
          before:bg-gradient-to-br before:from-[#27B4F5]/5 before:via-transparent before:to-transparent
          before:pointer-events-none before:opacity-0 hover:before:opacity-100
          before:transition-opacity before:duration-500
        "
      >
        {/* Animated title with premium glow */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 tracking-[0.08em] sm:tracking-[0.10em] text-[#27B4F5]
          drop-shadow-[0_0_20px_#27B4F5,0_0_40px_#27B4F5/50]
          animate-pulse-slow"
        >
          Sign Up
        </h2>

        {/* Enhanced error message */}
        {errorMsg && (
          <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
            <p className="text-red-400 text-sm text-center drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              {errorMsg}
            </p>
          </div>
        )}

        {/* NAME */}
        <label className="block mb-2 text-sm font-semibold text-[#27B4F5] drop-shadow-[0_0_8px_#27B4F5/50]">
          Full Name
        </label>
        <div className="relative group">
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full p-3 rounded-lg outline-none text-gray-800 dark:text-white placeholder:text-gray-500
              bg-gray-100 dark:bg-black/20 backdrop-blur-sm
              border border-[#27B4F5]/40
              focus:border-[#27B4F5] focus:shadow-[0_0_20px_#27B4F5,inset_0_0_20px_#27B4F5/10]
              focus:bg-gray-200 dark:focus:bg-black/30
              transition-all duration-300 ease-out
              hover:border-[#27B4F5]/60
            "
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#27B4F5]/0 via-[#27B4F5]/0 to-[#27B4F5]/0 
            group-focus-within:from-[#27B4F5]/10 group-focus-within:via-[#27B4F5]/5 group-focus-within:to-[#27B4F5]/10
            pointer-events-none transition-all duration-500 -z-10 blur-sm" />
        </div>

        {/* USERNAME */}
        <label className="block mt-4 mb-2 text-sm font-semibold text-[#27B4F5] drop-shadow-[0_0_8px_#27B4F5/50]">
          Username
        </label>
        <div className="relative group">
          <input
            type="text"
            placeholder="Pick a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full p-3 rounded-lg outline-none text-gray-800 dark:text-white placeholder:text-gray-500
              bg-gray-100 dark:bg-black/20 backdrop-blur-sm
              border border-[#27B4F5]/40
              focus:border-[#27B4F5] focus:shadow-[0_0_20px_#27B4F5,inset_0_0_20px_#27B4F5/10]
              focus:bg-gray-200 dark:focus:bg-black/30
              transition-all duration-300 ease-out
              hover:border-[#27B4F5]/60
            "
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#27B4F5]/0 via-[#27B4F5]/0 to-[#27B4F5]/0 
            group-focus-within:from-[#27B4F5]/10 group-focus-within:via-[#27B4F5]/5 group-focus-within:to-[#27B4F5]/10
            pointer-events-none transition-all duration-500 -z-10 blur-sm" />
        </div>

        {/* EMAIL */}
        <label className="block mt-4 mb-2 text-sm font-semibold text-[#27B4F5] drop-shadow-[0_0_8px_#27B4F5/50]">
          Email
        </label>
        <div className="relative group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full p-3 rounded-lg outline-none text-gray-800 dark:text-white placeholder:text-gray-500
              bg-gray-100 dark:bg-black/20 backdrop-blur-sm
              border border-[#27B4F5]/40
              focus:border-[#27B4F5] focus:shadow-[0_0_20px_#27B4F5,inset_0_0_20px_#27B4F5/10]
              focus:bg-gray-200 dark:focus:bg-black/30
              transition-all duration-300 ease-out
              hover:border-[#27B4F5]/60
            "
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#27B4F5]/0 via-[#27B4F5]/0 to-[#27B4F5]/0 
            group-focus-within:from-[#27B4F5]/10 group-focus-within:via-[#27B4F5]/5 group-focus-within:to-[#27B4F5]/10
            pointer-events-none transition-all duration-500 -z-10 blur-sm" />
        </div>

        {/* PASSWORD */}
        <label className="block mt-4 mb-2 text-sm font-semibold text-[#27B4F5] drop-shadow-[0_0_8px_#27B4F5/50]">
          Password
        </label>
        <div className="relative group">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full p-3 rounded-lg outline-none text-gray-800 dark:text-white placeholder:text-gray-500
              bg-gray-100 dark:bg-black/20 backdrop-blur-sm
              border border-[#27B4F5]/40
              focus:border-[#27B4F5] focus:shadow-[0_0_20px_#27B4F5,inset_0_0_20px_#27B4F5/10]
              focus:bg-gray-200 dark:focus:bg-black/30
              transition-all duration-300 ease-out
              hover:border-[#27B4F5]/60
            "
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#27B4F5]/0 via-[#27B4F5]/0 to-[#27B4F5]/0 
            group-focus-within:from-[#27B4F5]/10 group-focus-within:via-[#27B4F5]/5 group-focus-within:to-[#27B4F5]/10
            pointer-events-none transition-all duration-500 -z-10 blur-sm" />
        </div>

        {/* CREATE ACCOUNT BUTTON - Premium Enhanced */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="
            relative mt-6 w-full py-3 text-black font-semibold rounded-lg overflow-hidden
            bg-[#27B4F5] 
            hover:shadow-[0_0_45px_#27B4F5,0_0_90px_#27B4F5/50]
            hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300 ease-out
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
            before:absolute before:inset-0 before:bg-gradient-to-r 
            before:from-transparent before:via-white/20 before:to-transparent
            before:translate-x-[-100%] hover:before:translate-x-[100%]
            before:transition-transform before:duration-700
          "
        >
          <span className="relative z-10">
            {loading ? "Creating..." : "Create Account"}
          </span>
        </button>

        {/* Premium Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#27B4F5]/20 to-[#27B4F5]/40"></div>
          <span className="px-3 text-gray-400 text-sm font-medium">or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#27B4F5]/20 to-[#27B4F5]/40"></div>
        </div>

        {/* Google login - Premium Enhanced */}
        <button
          onClick={() => signIn("google")}
          className="
            relative w-full py-2.5 flex items-center justify-center gap-3 rounded-lg overflow-hidden
            border border-[#27B4F5]/40 text-[#27B4F5]
            bg-black/10 backdrop-blur-sm
            hover:bg-[#27B4F5] hover:text-black hover:border-[#27B4F5]
            hover:shadow-[0_0_30px_#27B4F5,inset_0_0_20px_#27B4F5/20]
            hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300 ease-out
            before:absolute before:inset-0 before:bg-gradient-to-r 
            before:from-transparent before:via-white/10 before:to-transparent
            before:translate-x-[-100%] hover:before:translate-x-[100%]
            before:transition-transform before:duration-700
          "
          >
          <Image src="/icons/google-gmail-svgrepo-com.svg" alt="Google" width={20} height={20} className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Continue with Google</span>
        </button>

        {/* LinkedIn login - Premium Enhanced */}
        <button
          onClick={() => signIn("linkedin")}
          className="
            relative w-full py-2.5 flex items-center justify-center gap-3 rounded-lg mt-3 overflow-hidden
            border border-[#27B4F5]/40 text-[#27B4F5]
            bg-black/10 backdrop-blur-sm
            hover:bg-[#27B4F5] hover:text-black hover:border-[#27B4F5]
            hover:shadow-[0_0_30px_#27B4F5,inset_0_0_20px_#27B4F5/20]
            hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300 ease-out
            before:absolute before:inset-0 before:bg-gradient-to-r 
            before:from-transparent before:via-white/10 before:to-transparent
            before:translate-x-[-100%] hover:before:translate-x-[100%]
            before:transition-transform before:duration-700
          "
        >
          <Image src="/icons/linkedin-svgrepo-com.svg" alt="LinkedIn" width={20} height={20} className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Continue with LinkedIn</span>
        </button>

        {/* Enhanced link */}
        <p className="text-sm text-center mt-5 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link 
            href="/signin" 
            className="
              font-semibold text-[#27B4F5] 
              hover:text-white hover:drop-shadow-[0_0_10px_#27B4F5]
              transition-all duration-300 ease-out
              underline underline-offset-2 decoration-[#27B4F5]/50 hover:decoration-[#27B4F5]
            "
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
