"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Add from "@/components/AddBlog";

export default function NavBar() {
  const router = useRouter();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  return (
    <>
      {/* ================= PREMIUM NAVBAR ================= */}
      <nav
        className={`
          fixed top-0 w-full z-50 transition-transform duration-500 ease-out
          ${navVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div
          className="
            relative backdrop-blur-[20px]
            bg-gradient-to-b from-[#0B0E10]/80 via-[#0B0E10]/70 to-[#0B0E10]/80
            border-b border-[#27B4F5]/40
            shadow-[0_0_30px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
            px-8 pt-5 pb-5 flex justify-between items-center
            before:absolute before:inset-0 before:bg-gradient-to-r 
            before:from-[#27B4F5]/5 before:via-transparent before:to-transparent
            before:pointer-events-none before:opacity-50
          "
        >
          {/* ================= PREMIUM LOGO SECTION ================= */}
          <div
            onClick={() => router.push("/")}
            className="relative flex items-center cursor-pointer group select-none z-10"
          >
            {/* Premium ZINGG Text with Enhanced Styling */}
            <div className="relative">
              <h1
                className="
                  text-[32px] font-extrabold tracking-[0.15em]
                  transition-all duration-500 ease-out
                  group-hover:tracking-[0.25em]
                  relative z-10
                "
                style={{
                  background: "linear-gradient(90deg, #ff005d, #ff8c00, #ffee00, #2aff00, #00eeff, #7a00ff, #ff00b8)",
                  backgroundSize: "400% 400%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "rgbGlow 4s linear infinite",
                  textShadow: "0 0 30px rgba(39, 180, 245, 0.5)",
                }}
              >
                ZINGG
              </h1>
              {/* Subtle glow behind text */}
              <div 
                className="absolute inset-0 blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(90deg, #ff005d, #ff8c00, #ffee00, #2aff00, #00eeff, #7a00ff, #ff00b8)",
                  backgroundSize: "400% 400%",
                  animation: "rgbGlow 4s linear infinite",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              />
            </div>

            {/* Bolt Icon with Premium Effects */}
            <div className="relative ml-3">
              <div className="absolute inset-0 bg-[#27B4F5]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="/icons/bolt.svg" 
                alt="Bolt Icon"
                className="relative h-8 w-8 transition-all duration-300 
                  group-hover:scale-110 group-hover:rotate-12
                  drop-shadow-[0_0_10px_rgba(39,180,245,0.5)]
                  filter brightness-110" 
              />
            </div>
          </div>

          {/* ================= PREMIUM NAV BUTTONS ================= */}
          <div className="flex items-center space-x-8 z-10">
            <button className="relative text-[17px] font-semibold text-white/90 group
              hover:text-white transition-all duration-300">
              <span className="relative z-10">Our Story</span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-[#27B4F5] to-[#00eeff] 
                transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#27B4F5]" />
              <span className="absolute inset-0 bg-[#27B4F5]/5 rounded-lg opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 -z-10" />
            </button>

            <button
              onClick={() => router.push("/blogs")}
              className="relative text-[17px] font-semibold text-white/90 group
                hover:text-white transition-all duration-300"
            >
              <span className="relative z-10">Blogs</span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-[#27B4F5] to-[#00eeff] 
                transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#27B4F5]" />
              <span className="absolute inset-0 bg-[#27B4F5]/5 rounded-lg opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 -z-10" />
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="
                relative overflow-hidden
                bg-gradient-to-r from-[#27B4F5]/20 to-[#27B4F5]/10
                border border-[#27B4F5]/70 text-[#27B4F5]
                px-7 py-2.5 rounded-full font-semibold
                shadow-[0_0_15px_rgba(39,180,245,0.4)]
                hover:bg-[#27B4F5] hover:text-black hover:border-[#27B4F5]
                hover:shadow-[0_0_30px_rgba(39,180,245,0.8)]
                hover:-translate-y-[2px] active:translate-y-0
                transition-all duration-300 ease-out
                before:absolute before:inset-0 before:bg-gradient-to-r
                before:from-transparent before:via-white/20 before:to-transparent
                before:translate-x-[-100%] hover:before:translate-x-[100%]
                before:transition-transform before:duration-700
              "
            >
              <span className="relative z-10">Sign Up</span>
            </button>

            <div className="relative group">
              <div className="absolute inset-0 bg-[#27B4F5]/20 rounded-full blur-lg opacity-0 
                group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src="/icons/prof.svg"
                alt="Profile"
                onClick={() => setOpenSidebar(true)}
                className="relative w-11 h-11 cursor-pointer 
                  hover:scale-110 transition-all duration-300
                  drop-shadow-[0_0_10px_rgba(39,180,245,0.4)]
                  group-hover:drop-shadow-[0_0_20px_rgba(39,180,245,0.8)]
                  filter brightness-110" 
              />
            </div>
          </div>
        </div>

        {/* ✅ PREMIUM RGB ANIMATED LIGHT STRIP */}
        <div className="h-[3px] w-full animate-rgbGlow shadow-[0_2px_10px_rgba(255,0,93,0.5)]" />
      </nav>

      {/* ✅ PREMIUM TOGGLE BUTTON */}
      <button
        onClick={() => setNavVisible(!navVisible)}
        className={`
          fixed left-1/2 -translate-x-1/2 z-[999]
          w-14 h-7 flex justify-center items-center
          rounded-full backdrop-blur-xl
          border border-[#27B4F5]/60 bg-gradient-to-r from-[#27B4F5]/15 to-[#27B4F5]/10
          hover:bg-gradient-to-r hover:from-[#27B4F5]/40 hover:to-[#27B4F5]/30
          hover:border-[#27B4F5] hover:shadow-[0_0_20px_rgba(39,180,245,0.6)]
          transition-all duration-500 ease-out
          ${navVisible ? "top-[calc(64px+3px)]" : "top-3"}
        `}
      >
        {navVisible ? (
          <span className="text-[#27B4F5] text-lg font-bold drop-shadow-[0_0_10px_#27B4F5]">▲</span>
        ) : (
          <span className="text-[#27B4F5] text-lg font-bold drop-shadow-[0_0_10px_#27B4F5]">▼</span>
        )}
      </button>


      {/* ================= PREMIUM OVERLAY & SIDEBAR ================= */}
      {openSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 transition-opacity duration-300" 
          onClick={() => setOpenSidebar(false)} 
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-72 z-50
          transform transition-transform duration-300 ease-out
          ${openSidebar ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Premium blur glass */}
        <div className="absolute inset-0 
          bg-gradient-to-br from-[#0B0E10]/90 via-[#0B0E10]/85 to-[#0B0E10]/90
          backdrop-blur-2xl 
          border-l border-[#27B4F5]/40 
          shadow-[0_0_40px_rgba(39,180,245,0.5),inset_0_0_50px_rgba(39,180,245,0.1)]" />

        <div className="relative z-10 p-6 space-y-4 text-white">
          <h2 className="text-3xl font-extrabold mb-6 
            bg-gradient-to-r from-[#27B4F5] to-[#00eeff]
            bg-clip-text text-transparent
            drop-shadow-[0_0_20px_rgba(39,180,245,0.6)]">
            Profile Menu
          </h2>

          <button
            onClick={() => {
              setOpenSidebar(false);
              router.push("/profile");
            }}
            className="relative w-full py-3.5 rounded-lg font-semibold 
              bg-[#27B4F5]/10 border border-[#27B4F5]/40 text-white 
              hover:bg-[#27B4F5] hover:text-black hover:border-[#27B4F5]
              hover:shadow-[0_0_25px_rgba(39,180,245,0.8)]
              transition-all duration-300 ease-out
              flex items-center gap-4 pl-4
              overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-r
              before:from-transparent before:via-white/10 before:to-transparent
              before:translate-x-[-100%] hover:before:translate-x-[100%]
              before:transition-transform before:duration-700"
          >
            <img src="/icons/profile.svg" alt="Profile" className="w-6 h-6 relative z-10 filter brightness-110" />
            <span className="relative z-10">View Profile</span>
          </button>

          <button
            onClick={() => {
              setOpenSidebar(false);
              router.push("/blogs");
            }}
            className="relative w-full py-3.5 rounded-lg font-semibold 
              bg-[#27B4F5]/10 border border-[#27B4F5]/40 text-white 
              hover:bg-[#27B4F5] hover:text-black hover:border-[#27B4F5]
              hover:shadow-[0_0_25px_rgba(39,180,245,0.8)]
              transition-all duration-300 ease-out
              flex items-center gap-4 pl-4
              overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-r
              before:from-transparent before:via-white/10 before:to-transparent
              before:translate-x-[-100%] hover:before:translate-x-[100%]
              before:transition-transform before:duration-700"
          >
            <img src="/icons/blogs.svg" alt="Blogs" className="w-6 h-6 relative z-10 filter brightness-110" />
            <span className="relative z-10">Blogs</span>
          </button>

          <button
            onClick={() => {
              setOpenSidebar(false);
              setOpenAddModal(true);
            }}
            className="relative w-full py-3.5 rounded-lg font-semibold 
              bg-[#27B4F5]/10 border border-[#27B4F5]/40 text-white 
              hover:bg-[#27B4F5] hover:text-black hover:border-[#27B4F5]
              hover:shadow-[0_0_25px_rgba(39,180,245,0.8)]
              transition-all duration-300 ease-out
              flex items-center gap-4 pl-4
              overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-r
              before:from-transparent before:via-white/10 before:to-transparent
              before:translate-x-[-100%] hover:before:translate-x-[100%]
              before:transition-transform before:duration-700"
          >
            <img src="/icons/create.svg" alt="Create" className="w-6 h-6 relative z-10 filter brightness-110" />
            <span className="relative z-10">Create Blog</span>
          </button>

          <button
            onClick={() => {
              setOpenSidebar(false);
              router.push("/api/auth/signout");
            }}
            className="relative w-full py-3.5 rounded-lg font-semibold 
              bg-red-600/80 border border-red-500/50 text-white
              hover:bg-red-500 hover:border-red-400
              hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]
              transition-all duration-300 ease-out
              flex items-center gap-4 pl-4
              overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-r
              before:from-transparent before:via-white/10 before:to-transparent
              before:translate-x-[-100%] hover:before:translate-x-[100%]
              before:transition-transform before:duration-700"
          >
            <img src="/icons/logout.svg" alt="Logout" className="w-6 h-6 relative z-10 filter brightness-110" />
            <span className="relative z-10">Logout</span>
          </button>
        </div>
      </div>

      {/* ✅ BLOG MODAL */}
      {openAddModal && (
        <Add onClose={() => setOpenAddModal(false)} onBlogAdded={() => console.log("Blog added ✅")} />
      )}
    </>
  );
}
