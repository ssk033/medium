"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  followed: boolean;
}

interface FollowersFollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
  title: string;
}

export default function FollowersFollowingModal({
  isOpen,
  onClose,
  userId,
  type,
  title,
}: FollowersFollowingModalProps) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState<Set<string>>(new Set());

  const loadUsers = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/follow/list?userId=${userId}&type=${type}`);
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [userId, type]);

  useEffect(() => {
    if (isOpen && userId) {
      loadUsers();
    }
  }, [isOpen, userId, loadUsers]);

  const toggleFollow = async (targetUserId: string, currentFollowed: boolean) => {
    if (followLoading.has(targetUserId)) return;

    setFollowLoading((prev) => new Set(prev).add(targetUserId));

    // Optimistic update
    setUsers((prev) =>
      prev.map((user) =>
        user.id === targetUserId ? { ...user, followed: !currentFollowed } : user
      )
    );

    try {
      const res = await axios.post("/api/follow", { userId: targetUserId });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === targetUserId ? { ...user, followed: res.data.followed } : user
        )
      );
    } catch (error) {
      // Revert on error
      setUsers((prev) =>
        prev.map((user) =>
          user.id === targetUserId ? { ...user, followed: currentFollowed } : user
        )
      );
      console.error("Failed to toggle follow:", error);
    } finally {
      setFollowLoading((prev) => {
        const next = new Set(prev);
        next.delete(targetUserId);
        return next;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md flex justify-center items-center z-[100]"
      onClick={onClose}
    >
      <div
        className="
          p-6 rounded-2xl w-[90%] max-w-[500px] max-h-[80vh] overflow-hidden
          backdrop-blur-[20px]
          bg-gradient-to-br from-white/95 via-white/90 to-white/95
          dark:from-[#0B0E10]/90 dark:via-[#0B0E10]/85 dark:to-[#0B0E10]/90
          border border-[#27B4F5]/50
          shadow-[0_0_45px_rgba(39,180,245,0.3),inset_0_1px_0_rgba(0,0,0,0.05)]
          dark:shadow-[0_0_45px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#27B4F5]/40">
          <h2 className="text-2xl font-bold text-[#27B4F5] drop-shadow-[0_0_12px_#27B4F5]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="
              text-2xl hover:text-red-400 hover:scale-110 transition-all duration-200
              text-gray-600 dark:text-gray-300
            "
          >
            ✖
          </button>
        </div>

        {/* Users List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-8 h-8 border-2 border-[#27B4F5] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center mt-6 opacity-75">
              No {type} yet...
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="
                  flex items-center justify-between p-4 rounded-lg
                  border border-[#27B4F5]/30
                  bg-gradient-to-br from-gray-100 to-gray-50 dark:from-black/20 dark:to-black/10
                  backdrop-blur-sm
                  hover:bg-[#27B4F5]/10 hover:border-[#27B4F5]/50
                  hover:shadow-[0_0_15px_rgba(39,180,245,0.6)]
                  transition-all duration-300
                "
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div
                    className="
                      relative inline-flex items-center justify-center
                      w-12 h-12 rounded-full flex-shrink-0
                      bg-gradient-to-br from-[#27B4F5]/20 to-[#27B4F5]/10
                      ring-2 ring-[#27B4F5]
                      shadow-[0_0_15px_rgba(39,180,245,0.4)]
                    "
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover"
                        unoptimized={user.image.startsWith('data:')}
                      />
                    ) : (
                      <Image
                        src="/icons/blankuser.svg"
                        alt="Default avatar"
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                      {user.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{user.username || "unknown"}
                    </p>
                  </div>
                </div>

                {/* Follow Button - Only show if logged in and not own profile */}
                {session?.user?.id && session.user.id !== user.id && (
                  <button
                    onClick={() => toggleFollow(user.id, user.followed)}
                    disabled={followLoading.has(user.id)}
                    className={`
                      px-4 py-2 text-xs font-semibold rounded-lg border
                      transition-all duration-300 ease-out flex-shrink-0
                      ${
                        user.followed
                          ? "bg-gray-100 dark:bg-black/20 text-gray-700 dark:text-gray-200 border-[#27B4F5]/50 hover:bg-red-500 hover:text-white hover:border-red-500"
                          : "bg-[#27B4F5] text-black border-transparent hover:shadow-[0_0_15px_rgba(39,180,245,0.8)]"
                      }
                      hover:scale-105 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {user.followed ? "Unfollow" : "+ Follow"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

