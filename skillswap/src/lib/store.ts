
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ProfileWithSkills,
  UserSkill,
  Session,
  Review,
  Notification,
} from "@/types/database";
import {
  CURRENT_USER,
  MOCK_COMMUNITY_MEMBERS,
  MOCK_UPCOMING_SESSIONS,
  MOCK_REVIEWS,
  MOCK_NOTIFICATIONS,
} from "./mock-data";

export interface ChatMessage {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
}

export interface ConnectionItem {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  message: string;
  created_at: string;
  user: ProfileWithSkills;
}

interface SkillSwapState {
  currentUser: ProfileWithSkills;
  community: ProfileWithSkills[];
  connections: ConnectionItem[];
  sessions: typeof MOCK_UPCOMING_SESSIONS;
  reviews: typeof MOCK_REVIEWS;
  notifications: Notification[];
  messages: Record<string, ChatMessage[]>;
  activeChatConnectionId: string | null;
  activeLiveSessionId: string | null;

  // Actions
  startInstantZoomSession: (
    partner: ProfileWithSkills,
    customSkillName?: string
  ) => {
    success: boolean;
    sessionId?: string;
    error?: string;
    activeSession?: (typeof MOCK_UPCOMING_SESSIONS)[number];
  };
  endSession: (sessionId: string) => void;
  addSkill: (skill: {
    skill_name: string;
    skill_category: string;
    type: "TEACH" | "LEARN";
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    description?: string | null;
    hours_count?: number;
    skill_id?: string | null;
  }) => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, updates: {
    skill_name?: string;
    skill_category?: string;
    level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    description?: string;
  }) => void;
  sendConnectionRequest: (targetUserId: string, message?: string) => void;
  acceptConnectionRequest: (connectionId: string) => void;
  declineConnectionRequest: (connectionId: string) => void;
  scheduleSession: (session: {
    partnerId: string;
    skillName: string;
    date: string;
    time: string;
    durationMinutes: number;
    notes?: string;
  }) => void;
  completeSession: (sessionId: string) => void;
  addReview: (review: {
    sessionId: string;
    toUserId: string;
    rating: number;
    comment: string;
    type: "TEACHING" | "LEARNING";
  }) => void;
  sendMessage: (connectionId: string, content: string) => void;
  setActiveChatConnectionId: (id: string | null) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateProfile: (data: Partial<ProfileWithSkills>) => void;
  loginAsGuest: (guestName?: string) => void;
  loginWithGoogleUser: (name?: string, email?: string) => void;
  loginWithPhoneUser: (phone: string) => void;
}

export const useSkillSwapStore = create<SkillSwapState>()(
  persist(
    (set, get) => ({
      currentUser: CURRENT_USER,
      community: MOCK_COMMUNITY_MEMBERS,
      connections: [
        {
          id: "conn-1",
          requester_id: "user-alex-001",
          receiver_id: "user-sarah-002",
          status: "ACCEPTED",
          message: "Hey Sarah, I'd love to swap my React expertise for your Python data science skills!",
          created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
          user: MOCK_COMMUNITY_MEMBERS[0],
        },
        {
          id: "conn-2",
          requester_id: "user-rahul-003",
          receiver_id: "user-alex-001",
          status: "ACCEPTED",
          message: "Hi Alex! I saw you teach TypeScript. I can mentor you in Figma & UI/UX fundamentals.",
          created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
          user: MOCK_COMMUNITY_MEMBERS[1],
        },
        {
          id: "conn-3",
          requester_id: "user-alex-001",
          receiver_id: "user-emily-004",
          status: "ACCEPTED",
          message: "Hi Emily, looking to practice public speaking and tech pitch articulation.",
          created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
          user: MOCK_COMMUNITY_MEMBERS[2],
        },
        {
          id: "conn-4",
          requester_id: "user-marcus-005",
          receiver_id: "user-alex-001",
          status: "PENDING",
          message: "Hey Alex! Would love to exchange Swift / iOS development for your Next.js expertise.",
          created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
          user: MOCK_COMMUNITY_MEMBERS[3],
        },
      ],
      sessions: MOCK_UPCOMING_SESSIONS,
      reviews: MOCK_REVIEWS,
      notifications: MOCK_NOTIFICATIONS,
      activeChatConnectionId: "conn-1",
      activeLiveSessionId: null,
      messages: {
        "conn-1": [
          {
            id: "msg-1",
            connection_id: "conn-1",
            sender_id: "user-alex-001",
            content: "Hi Sarah! Excited to get started on Python data science.",
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
          {
            id: "msg-2",
            connection_id: "conn-1",
            sender_id: "user-sarah-002",
            content: "Hey Alex! Absolutely. I have prepared a quick Jupyter notebook for Pandas data filtering and grouping. We can dive into that in today's 10 AM session!",
            created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
          {
            id: "msg-3",
            connection_id: "conn-1",
            sender_id: "user-alex-001",
            content: "Awesome! And afterwards we can inspect the React state architecture for your analytics dashboard.",
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: "msg-4",
            connection_id: "conn-1",
            sender_id: "user-sarah-002",
            content: "Perfect! See you on Google Meet in a bit.",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        "conn-2": [
          {
            id: "msg-201",
            connection_id: "conn-2",
            sender_id: "user-rahul-003",
            content: "Hey Alex! Looking forward to our UI/UX session tomorrow. Have you gathered the screens you want feedback on?",
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: "msg-202",
            connection_id: "conn-2",
            sender_id: "user-alex-001",
            content: "Yes, got 3 dashboard wireframes ready. Excited to refine the typography hierarchy!",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
      },

      addSkill: (skill) =>
        set((state) => {
          const newSkill: UserSkill = {
            id: `us-${Date.now()}`,
            user_id: state.currentUser.id,
            skill_id: skill.skill_id ?? null,
            skill_name: skill.skill_name,
            skill_category: skill.skill_category,
            type: skill.type,
            level: skill.level,
            description: skill.description ?? null,
            hours_count: skill.hours_count ?? 0,
            created_at: new Date().toISOString(),
          };
          const isTeach = skill.type === "TEACH";
          return {
            currentUser: {
              ...state.currentUser,
              teach_skills: isTeach
                ? [...state.currentUser.teach_skills, newSkill]
                : state.currentUser.teach_skills,
              learn_skills: !isTeach
                ? [...state.currentUser.learn_skills, newSkill]
                : state.currentUser.learn_skills,
            },
          };
        }),

      removeSkill: (id) =>
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            teach_skills: state.currentUser.teach_skills.filter((s) => s.id !== id),
            learn_skills: state.currentUser.learn_skills.filter((s) => s.id !== id),
          },
        })),

      updateSkill: (id, updates) =>
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            teach_skills: state.currentUser.teach_skills.map((s) =>
              s.id === id ? { ...s, ...updates, description: updates.description ?? s.description ?? null } : s
            ),
            learn_skills: state.currentUser.learn_skills.map((s) =>
              s.id === id ? { ...s, ...updates, description: updates.description ?? s.description ?? null } : s
            ),
          },
        })),

      sendConnectionRequest: (targetUserId, message = "Hi! I'd love to connect and exchange skills on SkillSwap.") =>
        set((state) => {
          const target = state.community.find((u) => u.id === targetUserId);
          if (!target) return state;
          const newConn: ConnectionItem = {
            id: `conn-${Date.now()}`,
            requester_id: state.currentUser.id,
            receiver_id: targetUserId,
            status: "PENDING",
            message,
            created_at: new Date().toISOString(),
            user: target,
          };
          return {
            connections: [newConn, ...state.connections],
          };
        }),

      acceptConnectionRequest: (connectionId) =>
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === connectionId ? { ...c, status: "ACCEPTED" } : c
          ),
          notifications: [
            {
              id: `notif-${Date.now()}`,
              user_id: state.currentUser.id,
              type: "CONNECTION_ACCEPTED",
              title: "Connection Confirmed",
              body: "You can now message each other and schedule learning sessions.",
              data: { connection_id: connectionId },
              read_at: null,
              created_at: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),

      declineConnectionRequest: (connectionId) =>
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === connectionId ? { ...c, status: "REJECTED" } : c
          ),
        })),

      scheduleSession: ({ partnerId, skillName, date, time, durationMinutes, notes }) =>
        set((state) => {
          const partner = state.community.find((u) => u.id === partnerId) || state.community[0];
          const newSession = {
            id: `sess-${Date.now()}`,
            connection_id: `conn-dyn-${Date.now()}`,
            teacher_id: partner.id,
            learner_id: state.currentUser.id,
            skill_name: skillName,
            scheduled_at: new Date(`${date}T${time}:00`).toISOString(),
            duration_minutes: durationMinutes,
            status: "SCHEDULED" as const,
            meeting_link: `https://meet.google.com/swap-${Math.random().toString(36).substring(7)}`,
            notes: notes || "Peer skill exchange session scheduled via SkillSwap.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            partner,
            role: "LEARNER" as const,
            displayBadge: "Upcoming" as const,
            displayDate: date,
            displayTime: `${time} (${durationMinutes} mins)`,
          };
          return {
            sessions: [newSession, ...state.sessions],
            notifications: [
              {
                id: `notif-sess-${Date.now()}`,
                user_id: state.currentUser.id,
                type: "SESSION_SCHEDULED",
                title: "New Session Scheduled",
                body: `Your session '${skillName}' with ${partner.full_name} is confirmed for ${date} at ${time}.`,
                data: { session_id: newSession.id },
                read_at: null,
                created_at: new Date().toISOString(),
              },
              ...state.notifications,
            ],
          };
        }),

      startInstantZoomSession: (partner, customSkillName) => {
        const state = get();
        // 1. Single session check: check if there's already an active session
        const existingActive = state.sessions.find(
          (s) => s.status === "IN_PROGRESS" || s.id === state.activeLiveSessionId
        );

        if (existingActive && existingActive.status === "IN_PROGRESS") {
          return {
            success: false,
            error: `Active Session Conflict: You currently have an active live session in progress with ${existingActive.partner.full_name} (${existingActive.skill_name}). Only 1 active session is allowed at a time.`,
            activeSession: existingActive,
          };
        }

        // 2. Check the time: current timestamp and format
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        
        const skillName = customSkillName || partner.teach_skills[0]?.skill_name || "Peer Skill Swap";
        const randomMeetingId = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;
        const randomPasscode = `SWAP${Math.floor(1000 + Math.random() * 9000)}`;
        const cleanId = randomMeetingId.replace(/\s+/g, "");
        const zoomLink = `https://zoom.us/j/${cleanId}?pwd=${randomPasscode}`;

        const newSessionId = `sess-zoom-${Date.now()}`;
        const newSession: (typeof MOCK_UPCOMING_SESSIONS)[number] = {
          id: newSessionId,
          connection_id: `conn-${partner.id}`,
          teacher_id: partner.id,
          learner_id: state.currentUser.id,
          skill_name: skillName,
          hostTeaches: skillName,
          participantTeaches: state.currentUser.teach_skills[0]?.skill_name || "Code Review & Architecture",
          scheduled_at: now.toISOString(),
          duration_minutes: 45,
          status: "IN_PROGRESS" as const,
          meeting_link: zoomLink,
          zoom_meeting_id: randomMeetingId,
          zoom_passcode: randomPasscode,
          notes: `Instant 1-on-1 Zoom skill exchange started at ${timeStr}.`,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          partner,
          role: "LEARNER" as const,
          displayBadge: "Live Now",
          displayDate: `Today, ${dateStr}`,
          displayTime: `${timeStr} (Live Now)`,
        };

        // Also ensure connection is marked ACCEPTED so they are mutual peers
        const existingConnIndex = state.connections.findIndex(
          (c) =>
            (c.requester_id === state.currentUser.id && c.receiver_id === partner.id) ||
            (c.receiver_id === state.currentUser.id && c.requester_id === partner.id)
        );

        let updatedConnections = [...state.connections];
        if (existingConnIndex >= 0) {
          updatedConnections[existingConnIndex] = {
            ...updatedConnections[existingConnIndex],
            status: "ACCEPTED",
          };
        } else {
          updatedConnections.unshift({
            id: `conn-${Date.now()}`,
            requester_id: state.currentUser.id,
            receiver_id: partner.id,
            status: "ACCEPTED",
            message: `Connected for live 1-on-1 Zoom session on ${skillName}.`,
            created_at: now.toISOString(),
            user: partner,
          });
        }

        set({
          sessions: [newSession, ...state.sessions.filter((s) => s.id !== newSessionId)],
          activeLiveSessionId: newSessionId,
          connections: updatedConnections,
          notifications: [
            {
              id: `notif-${Date.now()}`,
              user_id: state.currentUser.id,
              type: "SESSION_SCHEDULED",
              title: "Zoom Session Active",
              body: `Live Zoom session for '${skillName}' with ${partner.full_name} has started at ${timeStr}.`,
              data: { session_id: newSessionId },
              read_at: null,
              created_at: now.toISOString(),
            },
            ...state.notifications,
          ],
        });

        return {
          success: true,
          sessionId: newSessionId,
          session: newSession,
        };
      },

      endSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, status: "COMPLETED" as const, displayBadge: "Completed" } : s
          ),
          activeLiveSessionId: state.activeLiveSessionId === sessionId ? null : state.activeLiveSessionId,
          currentUser: {
            ...state.currentUser,
            completed_sessions_count: state.currentUser.completed_sessions_count + 1,
          },
        })),

      completeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, status: "COMPLETED" as const, displayBadge: "Completed" } : s
          ),
          activeLiveSessionId: state.activeLiveSessionId === sessionId ? null : state.activeLiveSessionId,
          currentUser: {
            ...state.currentUser,
            completed_sessions_count: state.currentUser.completed_sessions_count + 1,
          },
        })),

      addReview: ({ sessionId, toUserId, rating, comment, type }) =>
        set((state) => {
          const fromUser = state.currentUser;
          const newReview = {
            id: `rev-${Date.now()}`,
            session_id: sessionId,
            from_user_id: fromUser.id,
            to_user_id: toUserId,
            rating,
            comment,
            type,
            created_at: new Date().toISOString(),
            from_user: fromUser,
          };
          return {
            reviews: [newReview, ...state.reviews],
          };
        }),

      sendMessage: (connectionId, content) =>
        set((state) => {
          const currentList = state.messages[connectionId] || [];
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            connection_id: connectionId,
            sender_id: state.currentUser.id,
            content,
            created_at: new Date().toISOString(),
          };
          return {
            messages: {
              ...state.messages,
              [connectionId]: [...currentList, newMsg],
            },
          };
        }),

      setActiveChatConnectionId: (id) => set({ activeChatConnectionId: id }),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read_at: new Date().toISOString() } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read_at: new Date().toISOString(),
          })),
        })),

      updateProfile: (data) =>
        set((state) => ({
          currentUser: { ...state.currentUser, ...data },
        })),

      loginAsGuest: (guestName = "Guest Learner") =>
        set((state) => ({
          currentUser: {
            ...CURRENT_USER,
            id: `user-guest-${Date.now().toString(36)}`,
            username: `guest_${Math.floor(1000 + Math.random() * 9000)}`,
            full_name: guestName,
            bio: "Exploring SkillSwap as a guest learner. Interested in swapping modern web development and design skills.",
            avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          },
        })),

      loginWithGoogleUser: (name = "Google User", email) =>
        set((state) => ({
          currentUser: {
            ...CURRENT_USER,
            id: `user-google-${Date.now().toString(36)}`,
            username: (name.toLowerCase().replace(/[^a-z0-9]/g, "") || "googleuser") + `_${Math.floor(100 + Math.random() * 900)}`,
            full_name: name,
            bio: "SkillSwap verified Google member. Excited to exchange knowledge, teach peers, and learn new skills.",
            avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          },
        })),

      loginWithPhoneUser: (phone) =>
        set((state) => ({
          currentUser: {
            ...CURRENT_USER,
            id: `user-phone-${Date.now().toString(36)}`,
            username: `user_${phone.replace(/\D/g, "").slice(-4) || "mobile"}`,
            full_name: `Verified Mobile Learner (${phone.slice(-4)})`,
            bio: "Mobile verified SkillSwap learner. Open for peer scheduling and study exchanges.",
          },
        })),
    }),
    {
      name: "skillswap-state-v3",
    }
  )
);
