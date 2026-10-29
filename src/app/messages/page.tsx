"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChatCircle,
  MagnifyingGlass,
  ArrowsLeftRight,
  Sparkle,
  Lightning,
  CalendarBlank,
  PaperPlaneRight
} from "@phosphor-icons/react";
import { Message, User } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

function MessagesContent() {
  const searchParams = useSearchParams();
  const preselectedPartner = searchParams.get("partner");

  const [conversations, setConversations] = useState<any[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string>(preselectedPartner || "usr_sofia");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activePartner, setActivePartner] = useState<User | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations list
  const loadConversations = async () => {
    try {
      const res = await fetch("/api/messages?userId=usr_current");
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (!activePartnerId && data.conversations.length > 0) {
          setActivePartnerId(data.conversations[0].partnerId);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load chat for active partner
  const loadActiveChat = async (partnerId: string) => {
    try {
      const [msgRes, userRes] = await Promise.all([
        fetch(`/api/messages?userId=usr_current&partnerId=${partnerId}`),
        fetch(`/api/users?userId=usr_current`),
      ]);
      const [msgData, userData] = await Promise.all([msgRes.json(), userRes.json()]);

      if (msgData.messages) setMessages(msgData.messages);

      if (userData.users) {
        const found = userData.users.find((u: any) => u.id === partnerId);
        if (found) setActivePartner(found);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activePartnerId) {
      loadActiveChat(activePartnerId);
    }
  }, [activePartnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId) return;

    const messageText = inputText.trim();
    setInputText("");

    // Optimistic message update
    const optimisticMsg: Message = {
      id: `opt_${Date.now()}`,
      senderId: "usr_current",
      receiverId: activePartnerId,
      content: messageText,
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      setSending(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: "usr_current",
          receiverId: activePartnerId,
          content: messageText,
        }),
      });
      if (res.ok) {
        loadConversations();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Sidebar: Conversation List */}
      <div className="w-80 border-r border-zinc-100 flex flex-col bg-zinc-50/60">
        <div className="p-4 border-b border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <ChatCircle className="w-4 h-4 text-indigo-500" />
            Messages
          </h2>
          <div className="relative mt-3">
            <MagnifyingGlass className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-400">
              No conversations yet. Reach out to a peer to start chatting!
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.partnerId === activePartnerId;
              const p = conv.partner;

              return (
                <button
                  key={conv.partnerId}
                  onClick={() => setActivePartnerId(conv.partnerId)}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                    isActive ? "bg-indigo-50 border-l-2 border-indigo-500" : "hover:bg-zinc-50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={p?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                      alt={p?.name || "Peer"}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200"
                    />
                    {p?.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 truncate">{p?.name || "User"}</span>
                      <span className="text-[10px] text-zinc-400">
                        {formatTimeAgo(conv.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{conv.lastMessage?.content}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 self-center" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-zinc-100 flex items-center justify-between bg-white">
          {activePartner ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activePartner.avatarUrl}
                  alt={activePartner.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-indigo-200"
                />
                {activePartner.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900">{activePartner.name}</h3>
                  <span className="text-xs text-zinc-400">@{activePartner.username}</span>
                </div>
                <p className="text-[11px] text-zinc-500">{activePartner.headline}</p>
              </div>
            </div>
          ) : (
            <span className="text-sm text-zinc-400">Select a peer to chat</span>
          )}

          {activePartner && (
            <div className="flex items-center gap-2">
              <a
                href={`/matches?target=${activePartner.id}`}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowsLeftRight className="w-3.5 h-3.5" />
                Propose Swap
              </a>
            </div>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/40">
          {messages.map((m) => {
            const isMe = m.senderId === "usr_current";

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-sm shadow-sm"
                      : "bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-xs"
                  }`}
                >
                  {m.content}
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 px-1">
                  {formatTimeAgo(m.createdAt)}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 bg-white flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activePartner?.name || "peer"}...`}
            className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
          >
            <PaperPlaneRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading Messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
