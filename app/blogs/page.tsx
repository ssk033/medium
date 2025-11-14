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
        <div className="h-screen flex justify-center items-center bg-black">
          <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <Blogs blogs={blogs} onBlogDeleted={loadBlogs} />
      )}

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-10 right-10 px-6 py-3 bg-black text-white font-semibold rounded-full border border-white/40 hover:scale-110 transition-all duration-300"
      >
        + Add Blog
      </button>

      {showAdd && (
        <Add onClose={() => setShowAdd(false)} onBlogAdded={loadBlogs} />
      )}
    </div>
  );
}
