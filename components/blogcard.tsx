"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Dialog } from "./Dialog";

interface BlogCardProps {
  blogId: number;
  authorname: string;
  authorId?: string;
  authorImage?: string | null;
  title: string;
  content: string;
  initialLikes: number;
  mediaUrls?: string[];
  onViewComments: () => void;
  onDeleteBlog?: () => void;
}

export const Blogcard = ({
  blogId,
  authorname,
  authorId,
  authorImage,
  title,
  content,
  initialLikes,
  mediaUrls = [],
  onViewComments,
  onDeleteBlog,
}: BlogCardProps) => {
  const { data: session } = useSession();
  const isAuthor = session?.user?.id === authorId;
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Menu state for hover popup
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Full content view state
  const [showFullContent, setShowFullContent] = useState(false);
  const contentLength = content.length;
  const shouldTruncate = contentLength > 150;

  // Dialog state
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "alert" | "confirm";
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  // Check if the current user has already liked this blog post
  useEffect(() => {
    axios
      .get(`/api/blog/like?blogId=${blogId}`)
      .then((res) => setLiked(res.data.liked))
      .catch((err) => console.error("❌ Error checking like:", err));
  }, [blogId]);

  // Check if the current user is following the blog author
  // Only runs if user is logged in and viewing someone else's post
  useEffect(() => {
    if (!authorId || isAuthor || !session?.user?.id) return;
    
    axios
      .get(`/api/follow?userId=${authorId}`)
      .then((res) => setFollowed(res.data.followed))
      .catch((err) => console.error("❌ Error checking follow:", err));
  }, [authorId, isAuthor, session?.user?.id]);

  // Toggle like with optimistic UI update
  // Updates UI immediately, then syncs with server
  // Reverts on error for consistency
  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    axios
      .post("/api/blog/like", { blogId })
      .then((res) => setLiked(!!res.data.liked))
      .catch(() => {
        setLiked((prev) => !prev);
        setLikes((prev) => (liked ? prev + 1 : prev - 1));
      });
  };

  // Toggle follow status with optimistic UI update
  // Updates UI immediately, then syncs with server
  // Reverts on error for consistency
  const toggleFollow = () => {
    if (!authorId || isAuthor || followLoading) return;

    const prevFollowed = followed;
    setFollowed(!prevFollowed);
    setFollowLoading(true);

    axios
      .post("/api/follow", { userId: authorId })
      .then((res) => setFollowed(res.data.followed))
      .catch(() => {
        setFollowed(prevFollowed);
      })
      .finally(() => setFollowLoading(false));
  };

  const submitComment = () => {
    if (!commentText.trim()) return;

    axios
      .post("/api/blog/comment", {
        blogId,
        content: commentText,
      })
      .then(() => {
        setCommentText("");
        setCommentOpen(false);
        setDialog({
          isOpen: true,
          title: "Success",
          message: "Comment added successfully!",
          type: "alert",
          onConfirm: () => setDialog((prev) => ({ ...prev, isOpen: false })),
        });
      });
  };

  const handleDelete = () => {
    setDialog({
      isOpen: true,
      title: "Delete Blog",
      message: "Are you sure you want to delete this blog?",
      type: "confirm",
      onConfirm: async () => {
        setDialog((prev) => ({ ...prev, isOpen: false }));
        try {
          await axios.delete(`/api/blog?blogId=${blogId}`);
          setDialog({
            isOpen: true,
            title: "Success",
            message: "Blog deleted successfully!",
            type: "alert",
            onConfirm: () => {
              setDialog((prev) => ({ ...prev, isOpen: false }));
              if (onDeleteBlog) onDeleteBlog();
            },
          });
        } catch (error) {
          const err = error as { response?: { data?: { error?: string } } };
          setDialog({
            isOpen: true,
            title: "Error",
            message: err?.response?.data?.error || "Failed to delete blog",
            type: "alert",
            onConfirm: () => setDialog((prev) => ({ ...prev, isOpen: false })),
          });
        }
      },
      onCancel: () => setDialog((prev) => ({ ...prev, isOpen: false })),
    });
  };

  return (
    <>
      <div className="relative w-full max-w-3xl mx-auto group">

        {/* ⭐ Neon behind card */}
        <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl flex justify-center">
          <div
            className="w-[90%] h-[90%] opacity-40 rounded-3xl group-hover:opacity-90 transition"
            style={{
              background: "radial-gradient(circle, rgba(39,180,245,0.35), transparent 70%)",
              filter: "blur(55px)",
            }}
          />
        </div>

        {/* ⭐ Premium Card */}
        <div
          className="
            border p-7 rounded-2xl
            backdrop-blur-[10px]
            bg-gradient-to-br from-white/95 via-white/90 to-white/95
            dark:from-[#0B0E10]/90 dark:via-[#0B0E10]/85 dark:to-[#0B0E10]/90
            border-[#27B4F5]/50
            shadow-[0_0_30px_rgba(39,180,245,0.3),inset_0_1px_0_rgba(0,0,0,0.05)]
            dark:shadow-[0_0_30px_rgba(39,180,245,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]
            transition-all duration-500 ease-out
            group-hover:shadow-[0_0_50px_rgba(39,180,245,0.5),inset_0_1px_0_rgba(0,0,0,0.1)]
            dark:group-hover:shadow-[0_0_50px_rgba(39,180,245,0.8),inset_0_1px_0_rgba(255,255,255,0.15)]
            group-hover:scale-[1.02] group-hover:border-[#27B4F5]
          "
        >

          {/* ================= PREMIUM HEADER ================= */}
          <div className="flex justify-between items-start relative">

            {/* LEFT → AUTHOR */}
            <div className="flex items-center space-x-4">
              <div
                className="
                  relative inline-flex items-center justify-center
                  w-12 h-12 rounded-full overflow-hidden
                  bg-gradient-to-br from-[#27B4F5]/20 to-[#27B4F5]/10
                  ring-2 ring-[#27B4F5]
                  shadow-[0_0_25px_rgba(39,180,245,0.6)]
                  group-hover:shadow-[0_0_35px_rgba(39,180,245,0.9)]
                  transition-all duration-300
                "
              >
                {authorImage ? (
                  <Image
                    src={authorImage}
                    alt={authorname}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized={authorImage.startsWith('data:')}
                  />
                ) : (
                  <span className="font-semibold text-[#27B4F5] tracking-wide">
                    {authorname.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium group-hover:text-[#27B4F5] transition-colors">
                  {authorname}
                </div>
                {/* Follow Button - Only show if logged in and not own post */}
                {session?.user?.id && !isAuthor && authorId && (
                  <button
                    onClick={toggleFollow}
                    disabled={followLoading}
                    className={`
                      px-3 py-1 text-xs font-semibold rounded-lg border
                      transition-all duration-300 ease-out
                      ${
                        followed
                          ? "bg-gray-100 dark:bg-black/20 text-gray-700 dark:text-gray-200 border-[#27B4F5]/50 hover:bg-red-500 hover:text-white hover:border-red-500"
                          : "bg-[#27B4F5] text-black border-transparent hover:shadow-[0_0_15px_rgba(39,180,245,0.8)]"
                      }
                      hover:scale-105 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {followed ? "Unfollow" : "+ Follow"}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT → 3 DOTS MENU */}
            <div
              className="relative"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                className="px-2 py-1 text-[#27B4F5] hover:bg-[#27B4F5]/20 rounded-full transition"
              >
                ⋮
              </button>

              {/* ⭐ POPUP MENU (glassmorphic) */}
              {menuOpen && (
                <div
                  className="
                    absolute right-0 top-6 w-40 rounded-xl px-3 py-2 z-50
                    backdrop-blur-xl
                    bg-white/95 dark:bg-[#0B0E10]/80
                    border border-[#27B4F5]/40
                    shadow-[0_0_20px_rgba(39,180,245,0.3)] dark:shadow-[0_0_20px_rgba(39,180,245,0.6)]
                    animate-fadeSlideIn
                  "
                >
                  <button
                    onClick={() => {
                      setShowFullContent(true);
                      setMenuOpen(false);
                    }}
                    className="
                      w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200
                      hover:bg-[#27B4F5] hover:text-black transition mb-1
                    "
                  >
                    {showFullContent ? 'Show Less' : 'Read Full Blog 📖'}
                  </button>
                  <button
                    onClick={() => {
                      onViewComments();
                      setMenuOpen(false); // auto close
                    }}
                    className="
                      w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200
                      hover:bg-[#27B4F5] hover:text-black transition mb-1
                    "
                  >
                    Show Comments 💬
                  </button>
                  {isAuthor && onDeleteBlog && (
                    <button
                      onClick={() => {
                        handleDelete();
                        setMenuOpen(false);
                      }}
                      className="
                        w-full text-left px-3 py-2 rounded-lg text-red-500 dark:text-red-400
                        hover:bg-red-500 hover:text-white transition
                      "
                    >
                      Delete Blog 🗑️
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ================= PREMIUM TITLE ================= */}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-5 
            group-hover:text-[#27B4F5] 
            drop-shadow-[0_0_10px_rgba(39,180,245,0.3)]
            group-hover:drop-shadow-[0_0_20px_rgba(39,180,245,0.6)]
            transition-all duration-300">
            {title}
          </h2>

          {/* ================= PREMIUM CONTENT ================= */}
          <div className="mt-3">
            <p className={`text-base text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors ${
              !showFullContent && shouldTruncate ? 'line-clamp-3' : ''
            }`}>
              {content}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="mt-2 text-[#27B4F5] hover:text-[#00eeff] text-sm font-semibold transition-colors"
              >
                {showFullContent ? 'Show Less' : 'Read More...'}
              </button>
            )}
            
            {/* Media Display - Images and Videos */}
            {mediaUrls && mediaUrls.length > 0 && (
              <div className={`mt-4 grid gap-2 ${
                mediaUrls.length === 1 ? 'grid-cols-1' : 
                mediaUrls.length === 2 ? 'grid-cols-2' : 
                'grid-cols-2'
              }`}>
                {mediaUrls.map((url, idx) => {
                  const isImage = url.startsWith('data:image/');
                  const isVideo = url.startsWith('data:video/');
                  
                  return (
                    <div
                      key={idx}
                      className="relative rounded-lg overflow-hidden bg-black/50 border border-[#27B4F5]/20 group/media"
                    >
                      {isImage ? (
                        <Image
                          src={url}
                          alt={`Media ${idx + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-auto object-cover group-hover/media:scale-105 transition-transform duration-300"
                          unoptimized={url.startsWith('data:')}
                        />
                      ) : isVideo ? (
                        <video
                          src={url}
                          controls
                          className="w-full h-auto"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================= FOOTER ================= */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-500">{today}</div>

            <div className="flex items-center gap-3">
              {/* ❤️ PREMIUM LIKE */}
              <button
                onClick={toggleLike}
                className={`
                  relative overflow-hidden
                  flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg border
                  transition-all duration-300 ease-out
                  ${
                    liked
                      ? "bg-[#27B4F5] text-black shadow-[0_0_20px_rgba(39,180,245,0.8)] border-transparent hover:shadow-[0_0_30px_rgba(39,180,245,1)]"
                      : "bg-gray-100 dark:bg-black/20 backdrop-blur-sm text-gray-700 dark:text-gray-200 border-[#27B4F5]/50 hover:bg-[#27B4F5] hover:text-black hover:border-[#27B4F5] hover:shadow-[0_0_20px_rgba(39,180,245,0.6)]"
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                <span className="relative z-10">
                  {liked ? "❤️ Liked" : "🤍 Like"} ({likes})
                </span>
              </button>

              {/* 💬 PREMIUM COMMENT BUTTON */}
              <button
                onClick={() => setCommentOpen(true)}
                className="
                  relative overflow-hidden
                  flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg
                  border border-[#27B4F5]/50 text-gray-700 dark:text-gray-200
                  bg-gray-100 dark:bg-black/20 backdrop-blur-sm
                  hover:bg-[#27B4F5] hover:text-black hover:border-[#27B4F5]
                  hover:shadow-[0_0_20px_rgba(39,180,245,0.6)]
                  transition-all duration-300 ease-out
                  hover:scale-105 active:scale-95
                  before:absolute before:inset-0 before:bg-gradient-to-r
                  before:from-transparent before:via-white/10 before:to-transparent
                  before:translate-x-[-100%] hover:before:translate-x-[100%]
                  before:transition-transform before:duration-700
                "
              >
                <Image src="/icons/comment.svg" alt="Comment" width={20} height={20} className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Comment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PREMIUM COMMENT MODAL ================= */}
      {commentOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md flex justify-center items-center z-50">
          <div
            className="p-8 rounded-2xl w-[450px]
            backdrop-blur-[20px]
            bg-gradient-to-br from-white/95 via-white/90 to-white/95
            dark:from-[#0B0E10]/90 dark:via-[#0B0E10]/85 dark:to-[#0B0E10]/90
            border border-[#27B4F5]/50
            shadow-[0_0_45px_rgba(39,180,245,0.3),inset_0_1px_0_rgba(0,0,0,0.05)]
            dark:shadow-[0_0_45px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add Comment 💬</h2>

            <textarea
              className="
                w-full h-32 mt-5 p-4 text-gray-800 dark:text-gray-200 rounded-lg outline-none
                bg-gray-100 dark:bg-transparent border border-[#27B4F5]/40
                focus:border-[#27B4F5] focus:shadow-[0_0_12px_rgba(39,180,245,0.6)]
              "
              placeholder="Write comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            <div className="flex justify-end gap-4 mt-5">
              <button
                onClick={() => setCommentOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#27B4F5]/50 text-gray-700 dark:text-gray-300 hover:bg-[#27B4F5]/20 transition"
              >
                Cancel
              </button>

              <button
                onClick={submitComment}
                className="px-4 py-2 rounded-lg bg-[#27B4F5] text-black font-semibold hover:scale-105 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
        confirmText={dialog.type === "confirm" ? "Delete" : "OK"}
        cancelText="Cancel"
      />
    </>
  );
};
