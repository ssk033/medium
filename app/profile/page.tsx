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
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  blogs: Blog[];
  followersCount?: number;
  followingCount?: number;
};

type TaggedBlog = {
  id: number;
  title: string;
  content: string;
  createdAt: Date | string | null;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [taggedBlogs, setTaggedBlogs] = useState<TaggedBlog[]>([]);
  const [taggedCount, setTaggedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTagged, setLoadingTagged] = useState(false);
  const [activeTab, setActiveTab] = useState<"blogs" | "tagged">("blogs");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleImageUpdate = (imageUrl: string) => {
    if (user) {
      setUser({ ...user, image: imageUrl });
    }
  };

  const loadTaggedBlogs = async (username: string) => {
    setLoadingTagged(true);
    try {
      const res = await fetch(`/api/user/tagged?username=${username}`);
      const data = await res.json();
      if (data.blogs) {
        setTaggedBlogs(data.blogs);
        setTaggedCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error loading tagged blogs:", error);
    } finally {
      setLoadingTagged(false);
    }
  };

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
            // Load tagged blogs
            loadTaggedBlogs(session.user.username);
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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-gray-800 dark:text-white">
        <div className="text-[#27B4F5] text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex bg-white dark:bg-black min-h-screen text-gray-800 dark:text-white relative">
      {/* Background gradient layers for visual depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0B0E10] dark:via-black dark:to-[#0B0E10] z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(39,180,245,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_30%,rgba(39,180,245,0.1),transparent_70%)] z-0" />
      
      {/* Animated grid pattern overlay */}
      <div className="fixed inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] opacity-10 dark:opacity-20 z-0">
        {Array.from({ length: 300 }).map((_, i) => (
          <div 
            key={i} 
            className="border border-gray-300 dark:border-[#27B4F5]/10 hover:border-[#27B4F5]/30 dark:hover:border-[#27B4F5]/30 transition-colors duration-300" 
          />
        ))}
      </div>

      {/* Profile sidebar with collapsible state */}
      <ProfileSidebar
        name={user.name ?? ""}
        username={user.username ?? ""}
        totalBlogs={user.blogs.length}
        userId={user.id}
        followersCount={user.followersCount ?? 0}
        followingCount={user.followingCount ?? 0}
        profileImage={user.image}
        onToggle={(isOpen) => setSidebarOpen(isOpen)}
        onImageUpdate={handleImageUpdate}
      />

      {/* Main content area with responsive margin based on sidebar visibility */}
      <main 
        className={`
          relative z-10 flex-1 
          px-3 sm:px-4 md:px-6 lg:px-10 
          py-4 sm:py-6 md:py-8 lg:py-10 xl:py-14
          transition-all duration-500 ease-out
          ${isMobile 
            ? 'ml-0' 
            : sidebarOpen 
              ? 'lg:ml-64' 
              : 'lg:ml-0'
          }
        `}
        style={{
          paddingTop: 'max(calc(var(--navbar-height, 67px) + 1rem), 4rem)',
        }}
      >
        <div
          className="
            rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10
            backdrop-blur-[20px]
            bg-gradient-to-br from-white/95 via-white/90 to-white/95
            dark:from-[#0B0E10]/80 dark:via-[#0B0E10]/75 dark:to-[#0B0E10]/80
            border border-[#27B4F5]/40
            shadow-[0_0_45px_rgba(39,180,245,0.3),inset_0_1px_0_rgba(0,0,0,0.05)]
            dark:shadow-[0_0_45px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
            hover:shadow-[0_0_65px_rgba(39,180,245,0.5),inset_0_1px_0_rgba(0,0,0,0.1)]
            dark:hover:shadow-[0_0_65px_rgba(39,180,245,0.9),inset_0_1px_0_rgba(255,255,255,0.15)]
            transition-all duration-500 ease-out
            before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl
            before:bg-gradient-to-br before:from-[#27B4F5]/5 before:via-transparent before:to-transparent
            before:pointer-events-none before:opacity-0 hover:before:opacity-100
            before:transition-opacity before:duration-500
            relative
          "
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#27B4F5] 
            drop-shadow-[0_0_20px_#27B4F5,0_0_40px_#27B4F5/50]">
            Welcome, {user.name}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg font-medium">@{user.username ?? "unknown"}</p>

          {/* Tabs */}
          <div className="flex gap-4 mt-8 sm:mt-10 border-b border-[#27B4F5]/30">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`
                px-4 py-2 font-semibold transition-colors
                ${activeTab === "blogs"
                  ? "text-[#27B4F5] border-b-2 border-[#27B4F5]"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#27B4F5]"
                }
              `}
            >
              Your Blogs ({user.blogs.length})
            </button>
            <button
              onClick={() => setActiveTab("tagged")}
              className={`
                px-4 py-2 font-semibold transition-colors
                ${activeTab === "tagged"
                  ? "text-[#27B4F5] border-b-2 border-[#27B4F5]"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#27B4F5]"
                }
              `}
            >
              Tagged In ({taggedCount})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "blogs" ? (
            <ProfileBlogs blogs={user.blogs} />
          ) : (
            <div className="mt-6">
              {loadingTagged ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : taggedBlogs.length === 0 ? (
                <div className="p-6 rounded-xl border border-[#27B4F5]/20 bg-gray-100 dark:bg-black/20 backdrop-blur-sm">
                  <p className="text-gray-500 dark:text-gray-500 italic text-center">
                    No tags yet. You haven&apos;t been tagged in any posts.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {taggedBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      onClick={() => router.push(`/blogs`)}
                      className="
                        relative overflow-hidden cursor-pointer
                        p-5 rounded-xl
                        border border-[#27B4F5]/40 
                        bg-gradient-to-br from-gray-100 to-gray-50 dark:from-black/30 dark:to-black/20
                        backdrop-blur-sm
                        hover:border-[#27B4F5] hover:bg-[#27B4F5]/10
                        shadow-[0_0_20px_rgba(39,180,245,0.3)] dark:shadow-[0_0_20px_rgba(39,180,245,0.4)]
                        hover:shadow-[0_0_35px_rgba(39,180,245,0.5)] dark:hover:shadow-[0_0_35px_rgba(39,180,245,0.8)]
                        transition-all duration-300 ease-out
                        hover:scale-[1.02]
                      "
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white 
                            hover:text-[#27B4F5] transition-colors">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                            {blog.content}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>By: {blog.author.name || blog.author.username || "Unknown"}</span>
                            <span>❤️ {blog._count.likes}</span>
                            <span>💬 {blog._count.comments}</span>
                            {blog.createdAt && (
                              <span>
                                {blog.createdAt instanceof Date
                                  ? blog.createdAt.toLocaleDateString("en-IN")
                                  : new Date(blog.createdAt).toLocaleDateString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
