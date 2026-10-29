"use client";

import { useState } from "react";
import { MessageSquare, Search, Send } from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";

export default function MessagesView() {
  const { currentUser } = useSkillSwapStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    alert(`Message sent: ${messageInput}`);
    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1400px] w-full mx-auto">
          <div className="bg-white rounded-3xl border border-[#f0f0f0] shadow-xs flex overflow-hidden min-h-[640px]">
            {/* Left Column: Conversations List */}
            <div className="w-80 md:w-96 border-r border-[#f0f0f0] flex flex-col p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-bold text-slate-900">Messages</h2>
              </div>

              <div className="relative mb-6">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="flex-1 flex items-center justify-center p-6 text-center">
                <p className="text-xs text-slate-400">
                  No conversations yet. Reach out to a peer to start chatting!
                </p>
              </div>
            </div>

            {/* Right Panel: Chat Area */}
            <div className="flex-1 flex flex-col p-6 bg-white justify-between">
              <div>
                <p className="text-xs text-slate-400">Select a peer to chat</p>
              </div>

              {/* Message Input at Bottom */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 mt-auto">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Message peer..."
                  className="flex-1 py-3 px-5 border border-slate-200 rounded-full text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 bg-slate-50/20"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#a78bfa] hover:bg-[#8b5cf6] text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
