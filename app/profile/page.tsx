// app/profile/page.tsx
import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileBlogs from "@/components/ProfileBlogs";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { username: session.user?.username },
    include: { blogs: true },
  });

  if (!user) redirect("/signin");

  return (
    <div className="flex bg-black min-h-screen text-white pt-[95px] relative">
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

      {/* ✅ Sidebar (NO onToggle prop now) */}
      <ProfileSidebar
        name={user.name ?? ""}
        username={user.username}
        totalBlogs={user.blogs.length}
      />

      {/* ✅ Premium Page Content */}
      <main className="relative z-10 flex-1 px-10 py-14 ml-64 transition-all duration-500">

        <div
          className="
            rounded-2xl p-10
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
          <h1 className="text-4xl font-extrabold text-[#27B4F5] 
            drop-shadow-[0_0_20px_#27B4F5,0_0_40px_#27B4F5/50]">
            Welcome, {user.name}
          </h1>

          <p className="text-gray-400 mt-2 text-lg font-medium">@{user.username}</p>

          <h2 className="text-2xl mt-10 font-semibold 
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
