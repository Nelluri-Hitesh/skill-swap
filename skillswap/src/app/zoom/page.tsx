"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  MessageSquare,
  Users,
  PhoneOff,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Smile,
  Send,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/AppSidebar";

function ZoomMeetingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const { currentUser, sessions, endSession, completeSession } =
    useSkillSwapStore();

  // Find the requested session, or active session, or latest session
  const session =
    sessions.find((s) => s.id === sessionId) ||
    sessions.find((s) => s.status === "IN_PROGRESS") ||
    sessions[0];

  // Video & audio states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<"NONE" | "CHAT" | "PARTICIPANTS" | "NOTES">("NONE");
  const [showEndModal, setShowEndModal] = useState(false);

  // Live timer states
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // In-meeting chat state
  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string; time: string; isMe: boolean }[]
  >([
    {
      sender: session?.partner?.full_name || "Peer Mentor",
      text: `Hi ${currentUser.full_name}! Welcome to our Zoom skill exchange. Ready to dive into ${session?.skill_name || "the session"}?`,
      time: "Just now",
      isMe: false,
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [sharedNotes, setSharedNotes] = useState(
    `Notes for ${session?.skill_name || "Session"}:\n- Discuss core principles\n- Hands-on walkthrough\n- Q&A and next steps`
  );

  // Webcam stream ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WebCam handling
  useEffect(() => {
    if (isVideoOn) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch(() => {
            // Camera permission denied or not available; fallback to avatar display
          });
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOn]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [
      ...prev,
      {
        sender: currentUser.full_name,
        text: inputMsg.trim(),
        time: timeStr,
        isMe: true,
      },
    ]);
    setInputMsg("");

    // Simulate partner reply after 2 seconds
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: session?.partner?.full_name || "Peer Mentor",
          text: "Got it! Sharing my screen in just a second.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: false,
        },
      ]);
    }, 2000);
  };

  const handleEndSession = () => {
    if (session) {
      completeSession(session.id);
      endSession(session.id);
    }
    setShowEndModal(false);
    router.push("/discover?sessionCompleted=true");
  };

  const meetingId = session?.zoom_meeting_id || "842 1920 4821";
  const passcode = session?.zoom_passcode || "SWAP2026";
  const zoomLink = session?.meeting_link || `https://zoom.us/j/${meetingId.replace(/\s+/g, "")}`;

  return (
    <div className="min-h-screen bg-[#11141b] text-white font-sans flex flex-col justify-between">
      {/* Top Zoom Meeting Header */}
      <header className="h-16 bg-[#161a23] border-b border-gray-800/80 px-4 md:px-8 flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/discover")}
            className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Back to Discover"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-bold text-white tracking-tight">
                  Zoom Live Meeting: {session?.skill_name || "Skill Mentorship"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  LIVE NOW
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Exchange with <strong className="text-gray-200">{session?.partner?.full_name}</strong> • 1-on-1 Session Slot
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right info and Official Zoom button */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Active Timer */}
          <div className="flex items-center gap-2 bg-[#0d1017] border border-gray-800 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatTimer(secondsElapsed)}</span>
            <span className="text-gray-600 text-[10px]">/ 45:00</span>
          </div>

          {/* Official Zoom Link */}
          <a
            href={zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in Zoom App
          </a>

          {/* Security Badge */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 bg-gray-800/40 px-2.5 py-1 rounded-lg border border-gray-800">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Video & Content Area */}
      <main className="flex-1 flex overflow-hidden p-3 md:p-6 gap-4">
        {/* Video Grid */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full max-h-[75vh] w-full max-w-6xl mx-auto">
            
            {/* TILE 1: Partner (Mentor) */}
            <div className="relative bg-[#1c212d] rounded-2xl border-2 border-emerald-500/40 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 transition-all">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  {session?.partner?.full_name || "Partner"} (Speaking)
                </span>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <span className="bg-blue-600/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-blue-400/20">
                  {session?.skill_name || "Teaches"}
                </span>
              </div>

              {/* Big Avatar */}
              <div className="relative group">
                <img
                  src={session?.partner?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"}
                  alt={session?.partner?.full_name}
                  className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-emerald-500/30 shadow-2xl ring-4 ring-emerald-500/10"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-0.5 rounded-full text-[10px] text-emerald-400 border border-emerald-500/30 flex items-center gap-1 whitespace-nowrap">
                  <Mic className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  Active Audio
                </div>
              </div>

              {/* Partner Details */}
              <div className="mt-5 text-center">
                <h3 className="text-base font-bold text-white">
                  {session?.partner?.full_name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {session?.partner?.location || "Remote Peer Mentor"}
                </p>
              </div>

              {/* Audio waves animation bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                {[4, 12, 8, 16, 6, 14, 8, 12, 5].map((height, i) => (
                  <span
                    key={i}
                    className="w-1 bg-emerald-400 rounded-full animate-pulse"
                    style={{
                      height: `${height}px`,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* TILE 2: You (Current User) */}
            <div className="relative bg-[#1c212d] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 transition-all">
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 border border-white/10">
                  {isMuted ? (
                    <MicOff className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  You (Host / Learner)
                </span>
              </div>

              {isVideoOn ? (
                <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {/* Fallback overlay if device camera is unavailable */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/40 pointer-events-none">
                    <img
                      src={currentUser.avatar_url || "/avatar-nani.jpg"}
                      alt={currentUser.full_name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-white/20 shadow-xl opacity-90"
                    />
                    <p className="text-xs text-white/80 font-medium mt-2 bg-black/50 px-2.5 py-0.5 rounded-full">
                      Camera Stream Active
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={currentUser.avatar_url || "/avatar-nani.jpg"}
                    alt={currentUser.full_name}
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-gray-700 shadow-xl"
                  />
                  <span className="text-xs text-gray-400 mt-3 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                    Camera is Turned Off
                  </span>
                </div>
              )}

              {/* Status pill bottom */}
              <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-gray-300 border border-white/10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Single-Session Active
              </div>
            </div>

          </div>
        </div>

        {/* Side Drawers (Chat / Participants / Notes) */}
        {activeTab !== "NONE" && (
          <aside className="w-80 md:w-96 bg-[#161a23] border border-gray-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all">
            {/* Drawer Header */}
            <div className="p-3.5 border-b border-gray-800 flex items-center justify-between bg-[#13161e]">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                {activeTab === "CHAT" && (
                  <>
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    In-Meeting Live Chat
                  </>
                )}
                {activeTab === "PARTICIPANTS" && (
                  <>
                    <Users className="w-4 h-4 text-purple-400" />
                    Participants (2)
                  </>
                )}
                {activeTab === "NOTES" && (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Shared Scratchpad & Notes
                  </>
                )}
              </div>
              <button
                onClick={() => setActiveTab("NONE")}
                className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded-md hover:bg-gray-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeTab === "CHAT" && (
                <div className="space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="text-[10px] text-gray-500 mb-0.5">
                        {msg.sender} • {msg.time}
                      </span>
                      <div
                        className={`text-xs px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
                          msg.isMe
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-[#222836] text-gray-200 rounded-tl-none border border-gray-700/50"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "PARTICIPANTS" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1d222e] border border-gray-800">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentUser.avatar_url || "/avatar-nani.jpg"}
                        alt={currentUser.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {currentUser.full_name} (You)
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">Host • Connected</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                      Slot 1/1
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1d222e] border border-gray-800">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={session?.partner?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"}
                        alt={session?.partner?.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {session?.partner?.full_name}
                        </div>
                        <div className="text-[10px] text-purple-400 font-medium">
                          Peer Mentor • Active
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                      Slot 1/1
                    </span>
                  </div>

                  <div className="p-3 bg-blue-950/30 border border-blue-900/40 rounded-xl text-xs text-blue-300 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> 1-Session Rule Enforced
                    </div>
                    <p className="text-[11px] text-blue-300/80 leading-normal">
                      SkillSwap restricts live exchange to 1 active session at a time to guarantee full focus and mentorship quality.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "NOTES" && (
                <div className="flex flex-col h-full space-y-2">
                  <p className="text-[11px] text-gray-400">
                    Sync notes, links, and code snippets during your Zoom call:
                  </p>
                  <textarea
                    value={sharedNotes}
                    onChange={(e) => setSharedNotes(e.target.value)}
                    rows={12}
                    className="w-full flex-1 bg-[#12151d] border border-gray-800 rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500 font-mono resize-none leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Chat Input Bottom */}
            {activeTab === "CHAT" && (
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-gray-800 bg-[#13161e] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type a message to peer..."
                  className="flex-1 bg-[#1e2330] border border-gray-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </aside>
        )}
      </main>

      {/* Bottom Zoom Controls Bar */}
      <footer className="h-20 bg-[#161a23] border-t border-gray-800/80 px-4 md:px-8 flex items-center justify-between z-30">
        {/* Left: Meeting Credentials */}
        <div className="hidden md:flex items-center gap-3 text-xs text-gray-400">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 block">
              Meeting ID
            </span>
            <span className="font-mono text-gray-200 font-semibold">{meetingId}</span>
          </div>
          <span className="text-gray-700">|</span>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 block">
              Passcode
            </span>
            <span className="font-mono text-gray-200 font-semibold">{passcode}</span>
          </div>
        </div>

        {/* Center: In-Call Action Toggles */}
        <div className="flex items-center gap-2 md:gap-3 mx-auto md:mx-0">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors cursor-pointer ${
              isMuted
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="text-[9px] mt-0.5 font-medium">
              {isMuted ? "Unmute" : "Mute"}
            </span>
          </button>

          {/* Video Button */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors cursor-pointer ${
              !isVideoOn
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
            }`}
          >
            {!isVideoOn ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            <span className="text-[9px] mt-0.5 font-medium">
              {!isVideoOn ? "Start Video" : "Stop Video"}
            </span>
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors cursor-pointer ${
              isScreenSharing
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
            }`}
          >
            <MonitorUp className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-medium">Share</span>
          </button>

          {/* Participants Toggle */}
          <button
            onClick={() =>
              setActiveTab(activeTab === "PARTICIPANTS" ? "NONE" : "PARTICIPANTS")
            }
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors cursor-pointer ${
              activeTab === "PARTICIPANTS"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-medium">Members</span>
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === "CHAT" ? "NONE" : "CHAT")}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors cursor-pointer ${
              activeTab === "CHAT"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-medium">Chat</span>
          </button>

          {/* Notes Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === "NOTES" ? "NONE" : "NOTES")}
            className={`hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors cursor-pointer ${
              activeTab === "NOTES"
                ? "bg-amber-600 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 font-medium">Notes</span>
          </button>
        </div>

        {/* Right: Red End Session Button */}
        <div>
          <button
            onClick={() => setShowEndModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            End Session
          </button>
        </div>
      </footer>

      {/* Confirmation Modal for Ending the Session */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1b202c] border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <PhoneOff className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                End Zoom Session?
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                This will mark your session with <strong>{session?.partner?.full_name}</strong> as completed and free up your 1-session slot so you can connect with another mentor.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Keep In Meeting
              </button>
              <button
                onClick={handleEndSession}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                End & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ZoomMeetingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white bg-[#11141b] min-h-screen">Connecting to Zoom...</div>}>
      <ZoomMeetingContent />
    </Suspense>
  );
}

