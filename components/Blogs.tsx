"use client";

import { Blogcard } from "./blogcard";
import axios from "axios";
import { useState } from "react";

type Blog = {
  id: number;
  author: { name: string; id?: string };
  authorID?: string;
  title: string;
  content: string;
  createdAt: string;
  _count: { likes: number };
};

type BlogsProps = {
  blogs: Blog[];
  onBlogDeleted?: () => void;
};

export const Blogs = ({ blogs }: BlogsProps) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);

  const loadComments = async (blogId: number) => {
    const selected = blogs.find((b: Blog) => b.id === blogId) || null;
    setSelectedBlog(selected);
    setCommentsOpen(true);
    setLoadingComments(true);
    
    try {
      const res = await axios.get(`/api/blog/comment?blogId=${blogId}`);
      setComments(res.data.comments || []);
    } catch (error) {
      console.error("Failed to load comments:", error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <div className="relative flex bg-black text-white pt-[95px] min-h-screen">
      {/* ✅ Premium Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0B0E10] via-black to-[#0B0E10] z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(39,180,245,0.1),transparent_70%)] z-0" />
      
      {/* ✅ Animated Grid Background */}
      <div className="fixed inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] opacity-20 z-0">
        {Array.from({ length: 300 }).map((_, i) => (
          <div 
            key={i} 
            className="border border-[#27B4F5]/10 hover:border-[#27B4F5]/30 transition-colors duration-300" 
          />
        ))}
      </div>

      {/* LEFT SIDE — BLOGS */}
      <div className="relative z-10 w-[70%] min-h-screen px-10 py-10 flex flex-col items-center gap-6">
        <h1 className="text-6xl font-black italic mb-10 
          bg-gradient-to-r from-[#27B4F5] to-[#00eeff]
          bg-clip-text text-transparent
          drop-shadow-[0_0_45px_rgba(39,180,245,0.8)]">
          Explore Blogs
        </h1>

        {blogs.length === 0 ? (
          <div className="text-3xl text-gray-400 italic">No blogs here yet...</div>
        ) : (
          blogs.map((blog) => (
            <Blogcard
              key={blog.id}
              blogId={blog.id}
              authorname={blog.author.name}
              authorId={blog.authorID || blog.author.id}
              title={blog.title}
              content={blog.content}
              initialLikes={blog._count.likes}
              onViewComments={() => loadComments(blog.id)}
              onDeleteBlog={onBlogDeleted}
            />
          ))
        )}
      </div>

      {/* RIGHT SIDE — PREMIUM FLOATING COMMENT CARD */}
      {commentsOpen && selectedBlog && (
        <div
          className="
            fixed right-6 top-[110px]
            w-[380px] max-h-[600px]
            rounded-2xl p-6 z-[100]
            backdrop-blur-[20px]
            bg-gradient-to-br from-[#0B0E10]/90 via-[#0B0E10]/85 to-[#0B0E10]/90
            border border-[#27B4F5]/50
            shadow-[0_0_40px_rgba(39,180,245,0.7),inset_0_1px_0_rgba(255,255,255,0.1)]
            transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(39,180,245,0.9)]
          "
        >
          {/* BLOG INFO ON TOP */}
          <div className="mb-5 pb-4 border-b border-[#27B4F5]/40">
            <h3 className="text-lg font-bold text-[#27B4F5] leading-tight mb-2
              drop-shadow-[0_0_10px_#27B4F5/50] line-clamp-2">
              {selectedBlog.title}
            </h3>
            <p className="text-sm text-gray-300">by {selectedBlog.author.name}</p>
            <p className="text-[11px] text-gray-500 mt-1">
              {new Date(selectedBlog.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>

          {/* CARD HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#27B4F5] drop-shadow-[0_0_8px_#27B4F5]">
              Comments 💬
            </h2>
            <button
              onClick={() => {
                setCommentsOpen(false);
                setComments([]);
              }}
              className="text-xl hover:text-red-400 hover:scale-110 transition-all duration-200"
            >
              ✖
            </button>
          </div>

          {/* COMMENTS LIST (scrollable inside card with proper overflow) */}
          <div className="max-h-[420px] overflow-y-auto space-y-3 pr-2 
            scrollbar-thin scrollbar-thumb-[#27B4F5]/60 scrollbar-track-transparent
            custom-scrollbar">
            {loadingComments ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-8 h-8 border-2 border-[#27B4F5] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-gray-400 text-center mt-6 opacity-75">No comments yet...</p>
            ) : (
              comments.map((comment: { id?: string; text: string; createdAt: string; user?: { username?: string } }, index) => (
                <div
                  key={comment.id || index}
                  className="
                    p-3 rounded-lg border border-[#27B4F5]/30 
                    bg-gradient-to-br from-black/20 to-black/10
                    backdrop-blur-sm
                    hover:bg-[#27B4F5]/10 hover:border-[#27B4F5]/50
                    hover:shadow-[0_0_15px_rgba(39,180,245,0.6)]
                    transition-all duration-300
                    break-words
                  "
                >
                  <p className="text-sm text-[#27B4F5] font-semibold mb-1">
                    @{comment.user?.username || "Unknown"}
                  </p>
                  <p className="text-gray-200 text-sm break-words whitespace-pre-wrap">
                    {comment.text}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-2">
                    {new Date(comment.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
