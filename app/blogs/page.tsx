"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import  Add  from "@/components/AddBlog";
import { Blogs } from "@/components/Blogs";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/blog");
      setBlogs(res.data.blogs);
    } catch (error) {
      console.error("Failed to load blogs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="relative">
      {loading ? (
        <div className="h-screen flex justify-center items-center bg-white dark:bg-black">
          <div className="w-14 h-14 border-4 border-gray-800 dark:border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <Blogs blogs={blogs} onBlogDeleted={loadBlogs} />
      )}

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-white dark:bg-black text-gray-800 dark:text-white text-sm sm:text-base font-semibold rounded-full border border-gray-300 dark:border-white/40 hover:scale-110 transition-all duration-300 shadow-lg dark:shadow-[0_0_20px_rgba(39,180,245,0.4)] z-40"
      >
        <span className="hidden sm:inline">+ Add Blog</span>
        <span className="sm:hidden">+</span>
      </button>

      {showAdd && (
        <Add onClose={() => setShowAdd(false)} onBlogAdded={loadBlogs} />
      )}
    </div>
  );
}
