// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileBlogs from "@/components/ProfileBlogs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Blog = {
  id: number;
  title: string;
  createdAt: Date | string | null;
};

type User = {
  name: string | null;
  username: string | null;
  blogs: Blog[];
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (status === "authenticated" && session?.user?.username) {
      fetch(`/api/user?username=${session.user.username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            router.push("/signin");
          }
        })
        .catch(() => router.push("/signin"))
        .finally(() => setLoading(false));
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-[#27B4F5] text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex bg-black min-h-screen text-white relative">
      {/* ✅ Premium Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0B0E10] via-black to-[#0B0E10] z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(39,180,245,0.1),transparent_70%)] z-0" />
      
      {/* ✅ Animated Grid Background */}
      <div className="fixed inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] opacity-20 z-0">
        {Array.from({ length: 300 }).map((_, i) => (
          <div 
            key={i} 
            className="border border-[#27B4F5]/10 hover:border-[#27B4F5]/30 transition-colors duration-300" 
          />
        ))}
      </div>

      {/* ✅ Sidebar with dynamic state */}
      <ProfileSidebar
        name={user.name ?? ""}
        username={user.username ?? ""}
        totalBlogs={user.blogs.length}
        onToggle={(isOpen) => setSidebarOpen(isOpen)}
      />

      {/* ✅ Premium Page Content - Dynamic margin based on sidebar state */}
      <main 
        className={`
          relative z-10 flex-1 
          px-4 sm:px-6 lg:px-10 
          py-8 sm:py-10 lg:py-14
          transition-all duration-500 ease-out
          ${isMobile 
            ? 'ml-0' 
            : sidebarOpen 
              ? 'lg:ml-64' 
              : 'lg:ml-0'
          }
        `}
        style={{
          paddingTop: 'max(calc(var(--navbar-height, 67px) + 2rem), 6rem)',
        }}
      >
        <div
          className="
            rounded-2xl p-6 sm:p-8 lg:p-10
            backdrop-blur-[20px]
            bg-gradient-to-br from-[#0B0E10]/80 via-[#0B0E10]/75 to-[#0B0E10]/80
            border border-[#27B4F5]/40
            shadow-[0_0_45px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
            hover:shadow-[0_0_65px_rgba(39,180,245,0.9),inset_0_1px_0_rgba(255,255,255,0.15)]
            transition-all duration-500 ease-out
            before:absolute before:inset-0 before:rounded-2xl
            before:bg-gradient-to-br before:from-[#27B4F5]/5 before:via-transparent before:to-transparent
            before:pointer-events-none before:opacity-0 hover:before:opacity-100
            before:transition-opacity before:duration-500
            relative
          "
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#27B4F5] 
            drop-shadow-[0_0_20px_#27B4F5,0_0_40px_#27B4F5/50]">
            Welcome, {user.name}
          </h1>

          <p className="text-gray-400 mt-2 text-base sm:text-lg font-medium">@{user.username ?? "unknown"}</p>

          <h2 className="text-xl sm:text-2xl mt-8 sm:mt-10 font-semibold 
            bg-gradient-to-r from-[#27B4F5] to-[#00eeff]
            bg-clip-text text-transparent
            border-b border-[#27B4F5]/30 pb-3">
            Your Blogs
          </h2>

          <ProfileBlogs blogs={user.blogs} />
        </div>
      </main>
    </div>
  );
}
