"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Search,
  Send,
  Video,
  User,
  CheckCheck,
  Sparkles,
  Clock,
  MoreVertical,
  Smile,
  Paperclip,
} from "lucide-react";
import { useSkillSwapStore, type ChatMessage } from "@/lib/store";
import { MOCK_COMMUNITY_MEMBERS } from "@/lib/mock-data";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { SkillBadge } from "@/components/ui/SkillBadge";
import type { ProfileWithSkills } from "@/types/database";

// Contextual intelligent reply generator based on what the user asks
function generatePeerReply(peer: ProfileWithSkills, userQuery: string, userName: string): string {
  const query = userQuery.toLowerCase().trim();
  const firstName = userName.split(" ")[0] || "there";

  // 1. Zoom / Video Call / Meeting
  if (
    query.includes("zoom") ||
    query.includes("call") ||
    query.includes("meet") ||
    query.includes("video") ||
    query.includes("link")
  ) {
    return `Hey ${firstName}, absolutely! I'm ready to jump on a Zoom session with you. You can hit the "Start Zoom Call" button at the top right, and we'll dive right into our 1-on-1 exchange! 📹`;
  }

  // 2. Time / Availability / Scheduling
  if (
    query.includes("time") ||
    query.includes("free") ||
    query.includes("when") ||
    query.includes("schedule") ||
    query.includes("available") ||
    query.includes("clock")
  ) {
    return `I'm generally free on weekdays between 10:00 AM and 5:00 PM EST, and Saturday mornings for 1-hour swap sessions. What time slot fits best for your timezone?`;
  }

  // 3. Greetings
  if (
    query === "hi" ||
    query === "hello" ||
    query === "hey" ||
    query.startsWith("hey ") ||
    query.startsWith("hello ") ||
    query.startsWith("hi ") ||
    query.startsWith("good morning") ||
    query.startsWith("good evening")
  ) {
    const teachSkill = peer.teach_skills[0]?.skill_name || "tech";
    return `Hi ${firstName}! Great to connect with you. I'm excited to share some ${teachSkill} tips and learn from your coding experience. What would you like to focus on first?`;
  }

  // 4. Questions about Sarah's domain (Python / Data Science / ML)
  if (peer.full_name.includes("Sarah")) {
    if (
      query.includes("python") ||
      query.includes("data") ||
      query.includes("pandas") ||
      query.includes("numpy") ||
      query.includes("ml") ||
      query.includes("model")
    ) {
      return `Great question! In Python & Pandas, I always emphasize vectorized operations with .apply() or native NumPy arrays over iterative loops for 100x faster execution. I'll prepare a Jupyter notebook demo we can run through together!`;
    }
    if (query.includes("react") || query.includes("next")) {
      return `I would love that! As a data scientist, React Server Components and dashboard state management are exactly what I need help with. Let's do a 50/50 swap!`;
    }
  }

  // 5. Questions about Rahul's domain (Figma / UI/UX / Design Systems)
  if (peer.full_name.includes("Rahul")) {
    if (
      query.includes("figma") ||
      query.includes("design") ||
      query.includes("ui") ||
      query.includes("ux") ||
      query.includes("prototype") ||
      query.includes("layout")
    ) {
      return `Auto-layout combined with component variants in Figma makes responsive UI design seamless. If you have an existing design screen, send me the link or share your screen on Zoom and I'll give you a live critique!`;
    }
    if (query.includes("code") || query.includes("tailwind") || query.includes("css")) {
      return `Yes! Turning Figma design tokens into clean Tailwind utility classes is my top goal right now. Can we pair up on translating a component into code?`;
    }
  }

  // 6. Questions about Emily's domain (Public Speaking / Pitch / Communication)
  if (peer.full_name.includes("Emily")) {
    if (
      query.includes("speak") ||
      query.includes("english") ||
      query.includes("pitch") ||
      query.includes("present") ||
      query.includes("talk") ||
      query.includes("interview")
    ) {
      return `The secret to a compelling presentation is pacing and pausing right after key takeaways. Never rush slide transitions! We can do a 5-minute mock pitch session on Zoom whenever you're ready.`;
    }
  }

  // 7. Questions about Marcus's domain (iOS / Swift)
  if (peer.full_name.includes("Marcus")) {
    if (
      query.includes("swift") ||
      query.includes("ios") ||
      query.includes("apple") ||
      query.includes("mobile") ||
      query.includes("app")
    ) {
      return `SwiftUI with observation macros has made reactive state on iOS so clean! If you're building an iOS client, I can review your architecture and navigation flows.`;
    }
  }

  // 8. Thanks & Praise
  if (
    query.includes("thank") ||
    query.includes("thanks") ||
    query.includes("awesome") ||
    query.includes("great") ||
    query.includes("cool")
  ) {
    return `You're very welcome, ${firstName}! That's what SkillSwap is all about. Ping me anytime you want to jump on a live video practice session! 🚀`;
  }

  // 9. Default helpful peer reply
  const peerSkill = peer.teach_skills[0]?.skill_name || "peer skills";
  return `That makes total sense, ${firstName}! I've noted that down for our ${peerSkill} session. Shall we schedule a 45-minute live call on Zoom to walk through it step-by-step?`;
}

interface MessageItem {
  id: string;
  senderName: string;
  content: string;
  time: string;
  isMe: boolean;
}

export default function MessagesView() {
  const router = useRouter();
  const { currentUser, startInstantZoomSession } = useSkillSwapStore();

  // Friends list derived from community members
  const friends: ProfileWithSkills[] = MOCK_COMMUNITY_MEMBERS;

  // Selected active friend
  const [selectedFriend, setSelectedFriend] = useState<ProfileWithSkills>(friends[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Per-friend conversation histories
  const [conversationMap, setConversationMap] = useState<Record<string, MessageItem[]>>({
    [friends[0].id]: [
      {
        id: "m-1",
        senderName: friends[0].full_name,
        content: `Hi ${currentUser.full_name}! Thanks for connecting. I'd love to swap my Python & Data Science knowledge for your React expertise!`,
        time: "10:15 AM",
        isMe: false,
      },
      {
        id: "m-2",
        senderName: currentUser.full_name,
        content: "Hey Sarah! Excited to connect. I'm currently building a machine learning dashboard and need help with data aggregation.",
        time: "10:18 AM",
        isMe: true,
      },
      {
        id: "m-3",
        senderName: friends[0].full_name,
        content: "That's right up my alley! We can review Pandas DataFrame grouping and plot visual trends. Let me know when you want to jump on Zoom!",
        time: "10:20 AM",
        isMe: false,
      },
    ],
    [friends[1].id]: [
      {
        id: "m-4",
        senderName: friends[1].full_name,
        content: `Hey ${currentUser.full_name}! Saw you teach TypeScript. I can mentor you on Figma Auto-Layout & Design Systems!`,
        time: "Yesterday",
        isMe: false,
      },
      {
        id: "m-5",
        senderName: currentUser.full_name,
        content: "Hey Rahul! That would be awesome. I have a component library in Figma that needs responsive auto-layout cleanup.",
        time: "Yesterday",
        isMe: true,
      },
      {
        id: "m-6",
        senderName: friends[1].full_name,
        content: "Awesome, shoot me any questions or let me know when you want to do a live design review call!",
        time: "Yesterday",
        isMe: false,
      },
    ],
    [friends[2].id]: [
      {
        id: "m-7",
        senderName: friends[2].full_name,
        content: `Hello ${currentUser.full_name}! Ready to practice tech talk articulation and presentation confidence?`,
        time: "2 days ago",
        isMe: false,
      },
      {
        id: "m-8",
        senderName: currentUser.full_name,
        content: "Hi Emily! Yes, preparing for an upcoming project demo and want to make the value proposition crystal clear.",
        time: "2 days ago",
        isMe: true,
      },
    ],
    [friends[3].id]: [
      {
        id: "m-9",
        senderName: friends[3].full_name,
        content: `Hey! Looking to exchange Swift / iOS architecture for Next.js web patterns. Whenever you have questions, fire away!`,
        time: "3 days ago",
        isMe: false,
      },
    ],
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMap, selectedFriend, isTyping]);

  // Current messages
  const currentMessages = conversationMap[selectedFriend.id] || [];

  // Filter friends by search query
  const filteredFriends = friends.filter((f) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = f.full_name.toLowerCase().includes(q);
    const skillMatch = f.teach_skills.some((s) => s.skill_name.toLowerCase().includes(q));
    return nameMatch || skillMatch;
  });

  // Send message and trigger automatic realistic reply
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageInput.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      senderName: currentUser.full_name,
      content: text,
      time: timeStr,
      isMe: true,
    };

    const friendId = selectedFriend.id;
    const friend = selectedFriend;

    // Append user message
    setConversationMap((prev) => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), newMsg],
    }));
    setMessageInput("");

    // Trigger typing indicator and smart reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyContent = generatePeerReply(friend, text, currentUser.full_name);
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        senderName: friend.full_name,
        content: replyContent,
        time: replyTime,
        isMe: false,
      };

      setConversationMap((prev) => ({
        ...prev,
        [friendId]: [...(prev[friendId] || []), replyMsg],
      }));
    }, 1200);
  };

  // Quick action: start Zoom call directly with this friend
  const handleStartZoom = () => {
    const res = startInstantZoomSession(selectedFriend);
    if (res.success && res.sessionId) {
      router.push(`/zoom?sessionId=${res.sessionId}`);
    } else if (res.activeSession) {
      router.push(`/zoom?sessionId=${res.activeSession.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-4 md:px-8 pb-12 max-w-[1400px] w-full mx-auto">
          <div className="bg-white rounded-3xl border border-[#f0f0f0] shadow-xs flex overflow-hidden min-h-[680px] h-[calc(100vh-140px)]">
            
            {/* LEFT COLUMN: FRIENDS / CONVERSATIONS LIST */}
            <div className="w-80 md:w-96 border-r border-[#f0f0f0] flex flex-col bg-white">
              {/* Header */}
              <div className="p-5 border-b border-[#f5f5f5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Messages &amp; Peers</h2>
                </div>
                <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  {friends.length} Friends
                </span>
              </div>

              {/* Search input */}
              <div className="p-4 border-b border-[#f8f8f8]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search friends or skills..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-400 transition-colors"
                  />
                </div>
              </div>

              {/* Friends List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#f9f9f9]">
                {filteredFriends.map((friend) => {
                  const isSelected = friend.id === selectedFriend.id;
                  const msgs = conversationMap[friend.id] || [];
                  const lastMsg = msgs[msgs.length - 1];

                  return (
                    <button
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend)}
                      className={`w-full text-left p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-purple-50/50 border-r-4 border-r-purple-600"
                          : "hover:bg-slate-50/70"
                      }`}
                    >
                      {/* Avatar with live status dot */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={friend.avatar_url || ""}
                          alt={friend.full_name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                      </div>

                      {/* Info & preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h3
                            className={`text-xs font-bold truncate ${
                              isSelected ? "text-purple-900" : "text-slate-900"
                            }`}
                          >
                            {friend.full_name}
                          </h3>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {lastMsg?.time || "Active"}
                          </span>
                        </div>

                        {/* Skill tag */}
                        <div className="mb-1">
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                            Teaches: {friend.teach_skills[0]?.skill_name || "Code"}
                          </span>
                        </div>

                        {/* Last message snippet */}
                        <p className="text-[11px] text-slate-500 truncate leading-tight">
                          {lastMsg ? lastMsg.content : "Click to start chatting..."}
                        </p>
                      </div>
                    </button>
                  );
                })}

                {filteredFriends.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No friends found matching &quot;{searchTerm}&quot;.
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE CHAT THREAD */}
            <div className="flex-1 flex flex-col bg-[#fafafa]/50">
              {/* Chat Header */}
              <div className="p-4 px-6 bg-white border-b border-[#f0f0f0] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedFriend.avatar_url || ""}
                      alt={selectedFriend.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white absolute bottom-0 right-0" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 leading-tight">
                        {selectedFriend.full_name}
                      </h2>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        Online
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedFriend.bio?.slice(0, 55)}...
                    </p>
                  </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartZoom}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Start Zoom Call
                  </button>

                  <button
                    onClick={() => router.push(`/profile/${selectedFriend.username}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <User className="w-3 h-3 text-slate-500" />
                    Profile
                  </button>
                </div>
              </div>

              {/* Skill Swap Context Banner */}
              <div className="px-6 py-2 bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 border-b border-purple-100/60 flex items-center justify-between text-[11px] text-purple-900">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>
                    Skill Match: You learn <strong>{selectedFriend.teach_skills[0]?.skill_name}</strong> in exchange for <strong>{currentUser.teach_skills[0]?.skill_name}</strong>.
                  </span>
                </div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider hidden sm:block">
                  Verified Peer Swap
                </span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>

                    <div
                      className={`text-xs px-4 py-3 rounded-2xl max-w-[80%] md:max-w-[70%] leading-relaxed shadow-2xs ${
                        msg.isMe
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none font-medium"
                          : "bg-white text-slate-800 rounded-tl-none border border-slate-200/80"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {msg.isMe && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <CheckCheck className="w-3 h-3 text-purple-500" />
                        <span>Delivered</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex flex-col items-start animate-in fade-in">
                    <span className="text-[10px] text-slate-400 mb-1">
                      {selectedFriend.full_name} is typing...
                    </span>
                    <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Message Input Bottom */}
              <div className="p-4 px-6 bg-white border-t border-[#f0f0f0]">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3 bg-slate-50 border border-slate-200/90 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all shadow-2xs"
                >
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Ask ${selectedFriend.full_name.split(" ")[0]} about ${selectedFriend.teach_skills[0]?.skill_name || "skills"}, timing, or Zoom calls...`}
                    className="flex-1 py-2 text-xs text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0 transition-opacity cursor-pointer shadow-xs"
                    title="Send Message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
                  <span>Press <kbd className="font-mono bg-slate-100 px-1 rounded text-[10px]">Enter</kbd> to send</span>
                  <span className="text-purple-600">Smart contextual reply enabled ✓</span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
