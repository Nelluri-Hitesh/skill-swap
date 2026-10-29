export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  headline?: string;
  bio?: string;
  location?: string;
  credits: number;
  rating: string;
  reviewCount: number;
  instagramHandle?: string;
  githubHandle?: string;
  twitterHandle?: string;
  isOnline: boolean;
  createdAt: string;
  isFollowing?: boolean;
}

export interface UserSkill {
  id: string;
  userId: string;
  type: "offering" | "wanted";
  skillName: string;
  category: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  description?: string;
  yearsExperience?: number;
  createdAt?: string;
}

export interface SwapProposal {
  id: string;
  senderId: string;
  receiverId: string;
  offeredSkill: string;
  wantedSkill: string;
  message: string;
  status: "pending" | "accepted" | "declined" | "completed" | "cancelled";
  durationMinutes: number;
  proposedDate: string;
  matchScore: number;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface SwapSession {
  id: string;
  proposalId?: string | null;
  hostId: string;
  participantId: string;
  skillTaughtByHost: string;
  skillTaughtByParticipant: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
  meetingLink?: string;
  notes?: string;
  createdAt: string;
  host?: User;
  participant?: User;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
}

export interface Review {
  id: string;
  authorId: string;
  targetUserId: string;
  skillName: string;
  rating: number;
  comment: string;
  createdAt: string;
  author?: User;
}

export interface NotificationItem {
  id: string;
  userId: string;
  actorId?: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  actor?: User;
}

export interface MatchRecommendation {
  user: User;
  score: number; // 0 - 100
  canTeachYou: UserSkill[];
  wantsFromYou: UserSkill[];
  commonInterests: string[];
}
