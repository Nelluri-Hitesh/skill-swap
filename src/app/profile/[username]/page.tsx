"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Heart,
  UserPlus,
  Sparkle,
  BookmarkSimple,
  GridFour,
  ShareNetwork,
  ChatCircle,
  ArrowsLeftRight,
  Check,
  Clock,
  MapPin,
  VideoCamera,
  CheckCircle,
  Star,
  CalendarBlank,
  Medal,
  TrendUp,
  Globe,
  UserCheck,
  Lightning
} from "@phosphor-icons/react";
import { User, UserSkill, Review } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "skills" | "reviews">("grid");

  // Propose Swap Modal
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [offeredSkill, setOfferedSkill] = useState("React & Next.js");
  const [wantedSkill, setWantedSkill] = useState("");
  const [proposedDate, setProposedDate] = useState("Tomorrow at 4:00 PM EST");
  const [proposalMsg, setProposalMsg] = useState("");
  const [sendingProposal, setSendingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`/api/users/${username}`);
        const safeJson = async (r: Response) => {
          if (!r.ok || !r.headers.get("content-type")?.includes("application/json")) return {};
          return r.json().catch(() => ({}));
        };
        const data = await safeJson(res);

        if (data.user) {
          setProfileUser(data.user);
          setIsFollowing(data.user.isFollowing || false);
          setWantedSkill(data.user.offeringSkills?.[0]?.skillName || "UI/UX Design");
          setProposalMsg(`Hey ${data.user.name}! I'd love to swap my React / Full-Stack knowledge for your ${data.user.offeringSkills?.[0]?.skillName || "skill"}. Let's do a 45 min swap!`);
        } else {
          // Fallback to active current user / Alex Mercer profile if not found
          const fallbackUser = {
            id: currentUser?.id || "usr_current",
            name: currentUser?.name || "Alex Mercer",
            username: username || "alexmercer",
            email: currentUser?.email || "alex@skillswap.dev",
            avatarUrl: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            headline: "Full-Stack Engineer & React Specialist 🚀",
            bio: "Building high-performance web platforms and trading full-stack development skills for UI/UX design, Spanish, and music production!",
            location: "San Francisco, CA",
            credits: currentUser?.credits ?? 140,
            rating: currentUser?.rating ?? "4.9",
            reviewCount: currentUser?.reviewCount ?? 18,
            instagramHandle: "alexmercer_dev",
            isOnline: true,
            offeringSkills: [
              { id: "sk_1", skillName: "React & Next.js", category: "Coding", proficiency: "Expert", yearsExperience: 5, description: "Full-stack SSR architecture & Tailwind CSS" },
              { id: "sk_2", skillName: "TypeScript & Node.js", category: "Coding", proficiency: "Advanced", yearsExperience: 4, description: "Type-safe APIs & PostgreSQL database design" },
            ],
            wantedSkills: [
              { id: "sk_3", skillName: "Figma UI/UX Design", category: "Design", description: "Design systems & interactive prototypes" },
              { id: "sk_4", skillName: "Conversational Spanish", category: "Languages", description: "Practice speaking & listening comprehension" },
            ],
            reviews: [
              { id: "rv_1", author: { name: "Sofia Rodriguez", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" }, rating: 5, comment: "Alex is an incredible Next.js teacher! Explained Server Components super clearly.", skillName: "React & Next.js" },
              { id: "rv_2", author: { name: "Kenji Sato", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" }, rating: 5, comment: "Super punctual and knowledgeable. Great 1-on-1 swap!", skillName: "TypeScript" },
            ],
          };
          setProfileUser(fallbackUser);
          setWantedSkill("Figma UI/UX Design");
          setProposalMsg(`Hey Alex! I'd love to swap my skills for your React / Full-Stack knowledge. Let's schedule a 45 min session!`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [username, currentUser]);

  const toggleFollow = async () => {
    if (!profileUser) return;
    const newState = !isFollowing;
    setIsFollowing(newState);

    try {
      await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: "usr_current",
          followingId: profileUser.id,
        }),
      });
    } catch (e) {
      setIsFollowing(!newState);
    }
  };

  const handleSendProposal = async () => {
    if (!profileUser) return;
    setSendingProposal(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: "usr_current",
          receiverId: profileUser.id,
          offeredSkill,
          wantedSkill,
          message: proposalMsg,
          proposedDate,
          durationMinutes: 45,
          matchScore: 96,
        }),
      });

      if (res.ok) {
        setProposalSuccess(true);
        setTimeout(() => {
          setShowSwapModal(false);
          setProposalSuccess(false);
        }, 1600);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingProposal(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 font-medium">Loading creator profile...</div>;
  }

  const isSelf = profileUser?.id === currentUser?.id || profileUser?.username === "alexmorgan" || profileUser?.username === "alexmercer";

  // Simulated portfolio posts
  const portfolioPosts = [
    {
      title: "Interactive Workshop",
      desc: `Hands-on 1-on-1 session on ${profileUser?.offeringSkills?.[0]?.skillName || "Expertise"}`,
      likes: 42,
      category: profileUser?.offeringSkills?.[0]?.category || "Coding",
    },
    {
      title: "Project Teardown",
      desc: "Live code & design review with actionable feedback and optimization.",
      likes: 29,
      category: "Mentorship",
    },
    {
      title: "Skill Roadmap 2026",
      desc: "Step-by-step masterclass syllabus for peer exchange sessions.",
      likes: 38,
      category: "Education",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm border-none">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Avatar Ring */}
          <div className="relative shrink-0">
            <img
              src={profileUser.avatarUrl}
              alt={profileUser.name}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover bg-zinc-100 ring-1 ring-zinc-200"
            />
            {profileUser.isOnline && (
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-3 text-center md:text-left min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-1.5">
                  <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900">{profileUser.name}</h1>
                  <CheckCircle className="w-4 h-4 text-zinc-600" />
                </div>
                <p className="text-xs text-zinc-400 font-medium">@{profileUser.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center md:justify-end gap-2">
                {!isSelf ? (
                  <>
                    <button
                      onClick={toggleFollow}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isFollowing
                          ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200"
                          : "bg-zinc-900 hover:bg-zinc-800 text-white"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" /> Follow
                        </>
                      )}
                    </button>

                    <Link
                      href={`/messages?partner=${profileUser.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 border border-zinc-200 transition-colors"
                    >
                      <ChatCircle className="w-3.5 h-3.5 text-zinc-600" /> Message
                    </Link>

                    <button
                      onClick={() => setShowSwapModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowsLeftRight className="w-3.5 h-3.5" /> Swap Skill
                    </button>
                  </>
                ) : (
                  <Link
                    href="/settings"
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 text-xs font-semibold transition-colors"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>

            {/* Profile stats bar */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-zinc-500 font-normal py-2">
              <div>
                <span className="font-bold text-zinc-900">{profileUser.offeringSkills?.length || 2}</span> skills
              </div>
              <div>
                <span className="font-bold text-zinc-900">{profileUser.reviewCount || 18}</span> swaps
              </div>
              <div>
                <span className="font-bold text-zinc-900">{profileUser.isFollowing ? "1" : "3"}</span> followers
              </div>
              <div className="text-amber-700 font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {profileUser.rating}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-800">{profileUser.headline}</p>
              {profileUser.bio && (
                <p className="text-xs text-zinc-500 leading-relaxed mt-1 max-w-xl font-normal">{profileUser.bio}</p>
              )}
            </div>

            {/* Tags & handles */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-zinc-400 font-normal">
              {profileUser.location && (
                <span className="flex items-center gap-1 text-zinc-500">
                  <MapPin className="w-3 h-3 text-zinc-400" /> {profileUser.location}
                </span>
              )}
              {profileUser.instagramHandle && (
                <span className="text-zinc-700 font-medium">
                  @{profileUser.instagramHandle}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Panel Profile Performance Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Swap Balance */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              SWAP BALANCE
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Lightning className="w-3 h-3 fill-emerald-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-zinc-900 tracking-tight">
              {profileUser.credits ?? 140}{" "}
              <span className="text-xs font-medium text-zinc-400">PTS</span>
            </div>
            <p className="text-[11px] font-medium text-emerald-600 mt-0.5">
              +20 pts above baseline
            </p>
          </div>
        </div>

        {/* Card 2: Peer Rating */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              PEER RATING
            </span>
            <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-zinc-900 tracking-tight">
              {profileUser.rating ?? "4.9"}{" "}
              <span className="text-xs font-medium text-zinc-400">/5.0</span>
            </div>
            <p className="text-[11px] font-medium text-zinc-600 mt-0.5">
              Target: 5.0 (18 vouches)
            </p>
          </div>
        </div>

        {/* Card 3: Hours Exchanged */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              HOURS EXCHANGED
            </span>
            <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
              <Clock className="w-3 h-3 text-zinc-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-zinc-900 tracking-tight">
              15h
            </div>
            <p className="text-[11px] font-medium text-zinc-600 mt-0.5">
              15 1-on-1 sessions completed
            </p>
          </div>
        </div>

        {/* Card 4: Exchange Rate */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              EXCHANGE RATE
            </span>
            <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <TrendUp className="w-3 h-3 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-zinc-900 tracking-tight">
              98.6%
            </div>
            <p className="text-[11px] font-medium text-amber-700 mt-0.5">
              Top 1% Verified Peer
            </p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex items-center justify-center gap-8 border-b border-zinc-200">
        <button
          onClick={() => setActiveTab("grid")}
          className={`pb-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "grid"
              ? "border-zinc-900 text-zinc-900"
              : "border-transparent text-zinc-400 hover:text-zinc-700"
          }`}
        >
          <GridFour className="w-3.5 h-3.5" /> Exchange Feed
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "skills"
              ? "border-cyan-500 text-cyan-600"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          <Medal className="w-3.5 h-3.5" /> Skills Portfolio ({profileUser.offeringSkills?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "reviews"
              ? "border-cyan-500 text-cyan-600"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Reviews ({profileUser.reviews?.length || 0})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {portfolioPosts.map((post, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-cyan-300 transition-all flex flex-col justify-between p-5 space-y-3 shadow-md group"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-50 text-cyan-700 border border-sky-200 uppercase">
                  {post.category}
                </span>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-cyan-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{post.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-rose-600 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> {post.likes}
                </span>
                {!isSelf && (
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="text-cyan-600 font-extrabold hover:underline"
                  >
                    Request Session &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offering */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Sparkle className="w-4 h-4 text-emerald-600" /> Ready to Teach (Offering)
            </h3>
            {profileUser.offeringSkills?.length ? (
              profileUser.offeringSkills.map((sk: any) => (
                <div
                  key={sk.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{sk.skillName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black border border-emerald-200 uppercase">
                      {sk.proficiency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{sk.category} &bull; {sk.yearsExperience} yrs</p>
                  {sk.description && (
                    <p className="text-xs text-slate-600 italic pt-1">{sk.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 font-medium">No skills listed.</p>
            )}
          </div>

          {/* Wanted */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <Sparkle className="w-4 h-4 text-purple-600" /> Wants in Exchange (Learning)
            </h3>
            {profileUser.wantedSkills?.length ? (
              profileUser.wantedSkills.map((sk: any) => (
                <div
                  key={sk.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{sk.skillName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-black border border-purple-200 uppercase">
                      Target
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{sk.category}</p>
                  {sk.description && (
                    <p className="text-xs text-slate-600 italic pt-1">{sk.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 font-medium">Open to anything.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-3">
          {profileUser.reviews?.length ? (
            profileUser.reviews.map((r: any) => (
              <div
                key={r.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4.5 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={r.author?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                      alt={r.author?.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span className="text-xs font-bold text-slate-900">{r.author?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 italic font-medium">&quot;{r.comment}&quot;</p>
                <span className="text-[10px] text-slate-500 font-bold block">Topic: {r.skillName}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 text-center py-6 font-medium">No peer testimonials yet.</p>
          )}
        </div>
      )}

      {/* Propose Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ArrowsLeftRight className="w-5 h-5 text-cyan-600" />
                  Propose Swap with {profileUser.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Collaborate directly 1-on-1</p>
              </div>
              <button
                onClick={() => setShowSwapModal(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {proposalSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-slate-900">Proposal Sent Successfully!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    What skill do you offer to teach?
                  </label>
                  <select
                    value={offeredSkill}
                    onChange={(e) => setOfferedSkill(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    <option value="React & Next.js">React & Next.js (5 yrs exp)</option>
                    <option value="TypeScript">TypeScript (4 yrs exp)</option>
                    <option value="Node.js & Postgres">Node.js & Postgres (4 yrs exp)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    What skill do you want from {profileUser.name}?
                  </label>
                  <input
                    type="text"
                    value={wantedSkill}
                    onChange={(e) => setWantedSkill(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Proposed Date & Time
                  </label>
                  <input
                    type="text"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Agenda & Note
                  </label>
                  <textarea
                    rows={3}
                    value={proposalMsg}
                    onChange={(e) => setProposalMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                  <button
                    onClick={() => setShowSwapModal(false)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendProposal}
                    disabled={sendingProposal}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold disabled:opacity-50 shadow-md shadow-cyan-500/25"
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
