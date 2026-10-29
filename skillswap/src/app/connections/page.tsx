"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Check,
  X,
  MessageSquare,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScheduleModal } from "@/components/scheduling/ScheduleModal";
import type { ProfileWithSkills } from "@/types/database";

export default function ConnectionsPage() {
  const router = useRouter();
  const {
    currentUser,
    connections,
    acceptConnectionRequest,
    declineConnectionRequest,
  } = useSkillSwapStore();

  const [activeTab, setActiveTab] = useState<"INCOMING" | "OUTGOING" | "CONNECTED">("CONNECTED");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<ProfileWithSkills | undefined>();

  // Filter connections by tab
  const incomingRequests = connections.filter(
    (c) => c.receiver_id === currentUser.id && c.status === "PENDING"
  );
  const outgoingRequests = connections.filter(
    (c) => c.requester_id === currentUser.id && c.status === "PENDING"
  );
  const acceptedConnections = connections.filter((c) => c.status === "ACCEPTED");

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-60 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Peer Connections
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Manage incoming swap requests, pending invitations, and your trusted network of learning partners.
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mt-6 border-b border-gray-100 pb-2">
              <button
                onClick={() => setActiveTab("CONNECTED")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "CONNECTED"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Connected ({acceptedConnections.length})
              </button>
              <button
                onClick={() => setActiveTab("INCOMING")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "INCOMING"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Incoming Requests
                {incomingRequests.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                    {incomingRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("OUTGOING")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "OUTGOING"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Outgoing Sent ({outgoingRequests.length})
              </button>
            </div>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "CONNECTED" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-card p-5 transition-card flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={conn.user.avatar_url || ""}
                      alt={conn.user.full_name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
                        {conn.user.full_name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        Teaches: {conn.user.teach_skills.map((s) => s.skill_name).join(", ")}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        Active Connection ✓
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => router.push("/messages")}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Send Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPartner(conn.user);
                        setScheduleModalOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "INCOMING" && (
            <div className="space-y-4">
              {incomingRequests.length > 0 ? (
                incomingRequests.map((conn) => (
                  <div
                    key={conn.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-card p-5 transition-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={conn.user.avatar_url || ""}
                        alt={conn.user.full_name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {conn.user.full_name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {conn.user.location} • Offers {conn.user.teach_skills[0]?.skill_name}
                        </p>
                        <p className="text-xs text-gray-700 mt-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                          &quot;{conn.message}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center self-end">
                      <button
                        onClick={() => declineConnectionRequest(conn.id)}
                        className="px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                      <button
                        onClick={() => acceptConnectionRequest(conn.id)}
                        className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept Connection
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-gray-400">
                  No incoming connection requests right now.
                </div>
              )}
            </div>
          )}

          {activeTab === "OUTGOING" && (
            <div className="space-y-4">
              {outgoingRequests.length > 0 ? (
                outgoingRequests.map((conn) => (
                  <div
                    key={conn.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-card p-5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={conn.user.avatar_url || ""}
                        alt={conn.user.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {conn.user.full_name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Waiting for response • Sent {conn.created_at.split("T")[0]}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      Pending Approval
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-gray-400">
                  You have no pending outgoing connection invitations.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        preselectedPartner={selectedPartner}
      />
    </div>
  );
}
