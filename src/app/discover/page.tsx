"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  UserPlus,
  Sparkle,
  BookmarkSimple,
  GridFour,
  ShareNetwork,
  Funnel,
  ArrowSquareOut,
  SlidersHorizontal,
  ChatCircle,
  Fire,
  ArrowsLeftRight,
  Check,
  Camera,
  MapPin,
  Compass,
  CheckCircle,
  Star,
  UserCheck,
  MagnifyingGlass,
  Lightning
} from "@phosphor-icons/react";
import { CATEGORY_COLORS } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["All", "Coding", "Design", "Languages", "Music", "Marketing", "Photography", "Business"];

export default function DiscoverPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [followMap, setFollowMap] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({
    usr_sofia: true,
    usr_kenji: false,
  });

  // Modal State
  const [proposalModalUser, setProposalModalUser] = useState<any | null>(null);
  const [offeredSkill, setOfferedSkill] = useState("React & Next.js");
  const [wantedSkill, setWantedSkill] = useState("");
  const [proposalDate, setProposalDate] = useState("Tomorrow at 3:00 PM EST");
  const [proposalMsg, setProposalMsg] = useState("");
  const [sendingProposal, setSendingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // Active Story modal
  const [activeStoryUser, setActiveStoryUser] = useState<any | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [selectedCategory]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory !== "All" ? `&category=${selectedCategory}` : "";
      const qParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : "";
      const res = await fetch(`/api/users?userId=usr_current${categoryParam}${qParam}`);
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return;
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        const map: Record<string, boolean> = {};
        data.users.forEach((u: any) => {
          map[u.id] = u.isFollowing || false;
        });
        setFollowMap(map);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const toggleFollow = async (userId: string) => {
    const isNowFollowing = !followMap[userId];
    setFollowMap((prev) => ({ ...prev, [userId]: isNowFollowing }));

    try {
      await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: "usr_current", followingId: userId }),
      });
    } catch (e) {
      setFollowMap((prev) => ({ ...prev, [userId]: !isNowFollowing }));
    }
  };

  const toggleLike = (userId: string) => {
    setLikedPosts((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const openProposalModal = (user: any) => {
    setProposalModalUser(user);
    setWantedSkill(user.offeringSkills?.[0]?.skillName || "Any skill");
    setProposalMsg(
      `Hey ${user.name}! I love your work and would love to exchange my React / Full-Stack skills for your ${
        user.offeringSkills?.[0]?.skillName || "skill"
      }. Let's do a 45 min swap!`
    );
    setProposalSuccess(false);
  };

  const submitProposal = async () => {
    if (!proposalModalUser) return;
    setSendingProposal(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: "usr_current",
          receiverId: proposalModalUser.id,
          offeredSkill,
          wantedSkill,
          message: proposalMsg,
          proposedDate: proposalDate,
          durationMinutes: 45,
          matchScore: 94,
        }),
      });

      if (res.ok) {
        setProposalSuccess(true);
        setTimeout(() => {
          setProposalModalUser(null);
          setProposalSuccess(false);
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingProposal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Stories Carousel Bar */}
      <div className="bg-white border-none rounded-xl p-4 overflow-x-auto shadow-sm">
        <div className="flex items-center gap-4 min-w-max">
          {/* Current User Story Bubble */}
          <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="relative">
              <div className="w-14 h-14 rounded-full p-0.5 border-2 border-dashed border-zinc-300 group-hover:border-zinc-500 transition-colors">
                <img
                  src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt="You"
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                +
              </span>
            </div>
            <span className="text-[11px] font-medium text-zinc-700">Your Story</span>
          </div>

          {/* Peer Stories Bubbles */}
          {users.map((peer) => (
            <button
              key={peer.id}
              onClick={() => setActiveStoryUser(peer)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full p-0.5 story-ring-gradient group-hover:scale-105 transition-transform duration-200">
                <img
                  src={peer.avatarUrl}
                  alt={peer.name}
                  className="w-full h-full rounded-full object-cover bg-white ring-2 ring-white"
                />
              </div>
              <span className="text-[11px] font-medium text-zinc-700 max-w-[64px] truncate group-hover:text-zinc-950 transition-colors">
                {peer.username}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Discovery Search & Category Funnels */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
                Discover Skill Friends
                <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                  Social Feed
                </span>
              </h1>
              <p className="text-xs text-zinc-500 font-normal">
                Find peers with skills you need, follow their portfolio, and trade knowledge directly 1-on-1.
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlass className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by skill, name, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 w-60 font-normal"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-zinc-900 text-white shadow-2xs"
                  : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Feed Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-zinc-100 border-none" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="p-16 text-center bg-white border-none rounded-2xl space-y-3 shadow-sm">
          <MagnifyingGlass className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="text-base font-medium text-zinc-900">No skill partners found</h3>
          <p className="text-xs text-zinc-500 font-normal">Try searching for other topics or reset category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((peer) => {
            const isFollowing = followMap[peer.id];
            const isMe = peer.id === "usr_current";
            const isLiked = likedPosts[peer.id];

            return (
              <div
                key={peer.id}
                className="bg-white border-none rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Header: User avatar, name, follow button */}
                <div className="p-4 flex items-center justify-between border-b border-zinc-100/50 bg-white">
                  <Link href={`/profile/${peer.username}`} className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full p-0.5 border border-zinc-200">
                        <img
                          src={peer.avatarUrl}
                          alt={peer.name}
                          className="w-full h-full rounded-full object-cover bg-white"
                        />
                      </div>
                      {peer.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-zinc-900 truncate hover:text-zinc-600">
                          {peer.name}
                        </span>
                        <CheckCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      </div>
                      <span className="text-[10px] text-zinc-400 font-normal block truncate">@{peer.username}</span>
                    </div>
                  </Link>

                  {!isMe && (
                    <button
                      onClick={() => toggleFollow(peer.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                        isFollowing
                          ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-none"
                          : "bg-zinc-900 hover:bg-zinc-800 text-white"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3 h-3 text-emerald-600" /> Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" /> Follow
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Showcase Banner / Feature Container */}
                <div className="relative aspect-video bg-zinc-50 border-b border-zinc-100/50 p-6 flex flex-col justify-center items-center text-center">
                  <div className="space-y-2 z-10">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 border border-zinc-200 bg-white px-2.5 py-1 rounded-full">
                      Verified Peer
                    </span>
                    <h3 className="text-sm font-medium text-zinc-900 line-clamp-1">
                      {peer.headline || "Knowledge Enthusiast"}
                    </h3>
                    <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-400 font-normal">
                      <span className="flex items-center gap-0.5 text-zinc-600 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {peer.rating} ({peer.reviewCount})
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-zinc-400" /> {peer.location || "Remote"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Engagement icons (Like, Chat, Swap, Credits) */}
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(peer.id)}
                      className="text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform active:scale-125 ${
                          isLiked ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                      <span>{isLiked ? (peer.reviewCount || 10) + 1 : peer.reviewCount || 10}</span>
                    </button>

                    <Link
                      href={`/messages?partner=${peer.id}`}
                      className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-xs"
                    >
                      <ChatCircle className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => openProposalModal(peer)}
                      className="text-cyan-600 hover:text-cyan-700 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <ArrowsLeftRight className="w-4 h-4" />
                      Swap
                    </button>
                  </div>

                  <span className="text-[10px] font-black text-amber-800 flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                    <Lightning className="w-3 h-3 fill-amber-500 text-amber-500" /> {peer.credits || 100} pts
                  </span>
                </div>

                {/* Skills tags breakdown */}
                <div className="p-4 space-y-2.5 flex-1 bg-slate-50/50">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">
                      Ready to Teach:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {peer.offeringSkills?.length ? (
                        peer.offeringSkills.map((sk: any) => (
                          <span
                            key={sk.id}
                            className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"
                          >
                            {sk.skillName}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">General peer mentorship</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block mb-1">
                      Wants in Exchange:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {peer.wantedSkills?.length ? (
                        peer.wantedSkills.map((sk: any) => (
                          <span
                            key={sk.id}
                            className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200"
                          >
                            {sk.skillName}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">Open to any offer</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="p-3.5 bg-white border-t border-zinc-100/50 flex items-center justify-between gap-2">
                  <Link
                    href={`/profile/${peer.username}`}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    View Profile &rarr;
                  </Link>

                  {!isMe && (
                    <button
                      onClick={() => openProposalModal(peer)}
                      className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                    >
                      <ArrowsLeftRight className="w-3.5 h-3.5" />
                      Swap
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Propose Swap Modal */}
      {proposalModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ArrowsLeftRight className="w-5 h-5 text-cyan-600" />
                  Propose Peer Skill Swap
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Send exchange proposal to <span className="text-slate-900 font-bold">{proposalModalUser.name}</span>
                </p>
              </div>
              <button
                onClick={() => setProposalModalUser(null)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {proposalSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Proposal Sent! 🎉</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {proposalModalUser.name} received your request and can accept it directly from their dashboard.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    What skill will YOU teach?
                  </label>
                  <select
                    value={offeredSkill}
                    onChange={(e) => setOfferedSkill(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    <option value="React & Next.js">React & Next.js (Expert)</option>
                    <option value="TypeScript">TypeScript (Advanced)</option>
                    <option value="Node.js & Postgres">Node.js & Postgres (Advanced)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    What skill do you want from {proposalModalUser.name}?
                  </label>
                  <select
                    value={wantedSkill}
                    onChange={(e) => setWantedSkill(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    {proposalModalUser.offeringSkills?.map((s: any) => (
                      <option key={s.id} value={s.skillName}>
                        {s.skillName} ({s.proficiency})
                      </option>
                    ))}
                    <option value="General Mentorship">General Mentorship & Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Proposed Day & Time
                  </label>
                  <input
                    type="text"
                    value={proposalDate}
                    onChange={(e) => setProposalDate(e.target.value)}
                    placeholder="e.g. This Thursday at 5:00 PM EST"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Swap Agenda & Note
                  </label>
                  <textarea
                    rows={3}
                    value={proposalMsg}
                    onChange={(e) => setProposalMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setProposalModalUser(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={sendingProposal}
                    onClick={submitProposal}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-cyan-500/25"
                  >
                    {sendingProposal ? "Sending..." : "Submit Proposal"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
