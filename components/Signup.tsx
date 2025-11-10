"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
        password,
      });

      if (response.status === 201) router.push("/signin");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* ✅ Neon Glass Card */}
      <div
        className="
          relative z-10 p-10 w-[400px] rounded-2xl
          bg-[#0B0E10]/70 backdrop-blur-2xl
          border border-[#27B4F5]/40
          shadow-[0_0_40px_rgba(39,180,245,0.6)]
          hover:shadow-[0_0_70px_rgba(39,180,245,1)]
          transition-all duration-300
        "
      >
        <h2
          className="text-4xl font-bold text-center mb-6 tracking-[0.10em] text-[#27B4F5]
          drop-shadow-[0_0_20px_#27B4F5]"
        >
          Sign Up
        </h2>

        {errorMsg && (
          <p className="text-red-400 text-sm mb-3 text-center">{errorMsg}</p>
        )}

        {/* NAME */}
        <label className="block mb-2 text-sm font-semibold text-[#27B4F5]">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
          className="
            w-full p-3 rounded-lg outline-none text-white
            bg-transparent border border-[#27B4F5]/40
            focus:border-[#27B4F5] focus:shadow-[0_0_20px_#27B4F5]
            transition-all duration-300
          "
        />

        {/* USERNAME */}
        <label className="block mt-4 mb-2 text-sm font-semibold text-[#27B4F5]">
          Username
        </label>
        <input
          type="text"
          placeholder="Pick a username"
          onChange={(e) => setUsername(e.target.value)}
          className="
            w-full p-3 rounded-lg outline-none text-white
            bg-transparent border border-[#27B4F5]/40
            focus:border-[#27B4F5] focus:shadow-[0_0_20px_#27B4F5]
            transition-all duration-300
          "
        />

        {/* PASSWORD */}
        <label className="block mt-4 mb-2 text-sm font-semibold text-[#27B4F5]">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full p-3 rounded-lg outline-none text-white
            bg-transparent border border-[#27B4F5]/40
            focus:border-[#27B4F5] focus:shadow-[0_0_20px_#27B4F5]
            transition-all duration-300
          "
        />

        {/* CREATE ACCOUNT BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="
            mt-6 w-full py-3 text-black font-semibold rounded-lg
            bg-[#27B4F5] hover:shadow-[0_0_45px_#27B4F5]
            hover:scale-[1.05] transition-all duration-300
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-[#27B4F5]/20"></div>
          <span className="px-2 text-gray-400 text-sm">or</span>
          <div className="flex-1 border-t border-[#27B4F5]/20"></div>
        </div>

        {/* Google login */}
        <button
          onClick={() => signIn("google")}
          className="
            w-full py-2.5 flex items-center justify-center gap-3 rounded-lg
            border border-[#27B4F5]/40 text-[#27B4F5]
            hover:bg-[#27B4F5] hover:text-black
            hover:shadow-[0_0_30px_#27B4F5]
            transition-all duration-300
          "
        >
          <img src="/icons/google-gmail-svgrepo-com.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* LinkedIn login */}
        <button
          onClick={() => signIn("linkedin")}
          className="
            w-full py-2.5 flex items-center justify-center gap-3 rounded-lg mt-3
            border border-[#27B4F5]/40 text-[#27B4F5]
            hover:bg-[#27B4F5] hover:text-black
            hover:shadow-[0_0_30px_#27B4F5]
            transition-all duration-300
          "
        >
          <img src="/icons/linkedin-svgrepo-com.svg" alt="LinkedIn" className="w-5 h-5" />
          Continue with LinkedIn
        </button>

        <p className="text-sm text-center mt-5 text-gray-300">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-[#27B4F5] hover:text-white">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
