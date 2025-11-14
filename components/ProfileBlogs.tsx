"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Blog = {
  id: number;
  title: string;
  createdAt: string | null;
};

type ProfileBlogsProps = {
  blogs: Blog[];
};

export default function ProfileBlogs({ blogs: initialBlogs }: ProfileBlogsProps) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);

  const handleDelete = async (blogId: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`/api/blog?blogId=${blogId}`);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      alert("✅ Blog deleted successfully!");
      router.refresh();
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      alert(err?.response?.data?.error || "Failed to delete blog");
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {blogs.length === 0 ? (
        <div className="p-6 rounded-xl border border-[#27B4F5]/20 bg-black/20 backdrop-blur-sm">
          <p className="text-gray-500 italic text-center">You haven&apos;t posted any blogs yet.</p>
        </div>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog.id}
            className="
              relative overflow-hidden
              p-5 rounded-xl
              border border-[#27B4F5]/40 
              bg-gradient-to-br from-black/30 to-black/20
              backdrop-blur-sm
              hover:border-[#27B4F5] hover:bg-[#27B4F5]/10
              shadow-[0_0_20px_rgba(39,180,245,0.4)]
              hover:shadow-[0_0_35px_rgba(39,180,245,0.8)]
              transition-all duration-300 ease-out
              hover:scale-[1.02]
              before:absolute before:inset-0 before:bg-gradient-to-r
              before:from-transparent before:via-[#27B4F5]/5 before:to-transparent
              before:translate-x-[-100%] hover:before:translate-x-[100%]
              before:transition-transform before:duration-700
            "
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white 
                  hover:text-[#27B4F5] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-IN") : ""}
                </p>
              </div>
              <button
                onClick={() => handleDelete(blog.id)}
                className="
                  ml-4 px-4 py-2 rounded-lg
                  bg-red-600/20 border border-red-500/50 text-red-400
                  hover:bg-red-500 hover:text-white hover:border-red-400
                  hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]
                  transition-all duration-300 ease-out
                  hover:scale-105 active:scale-95
                "
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

