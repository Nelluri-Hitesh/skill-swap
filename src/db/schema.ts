import { pgTable, text, timestamp, integer, boolean, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // user id (e.g. usr_1 or uuid)
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url").notNull(),
  headline: text("headline").default("SkillSwap enthusiast"),
  bio: text("bio").default(""),
  location: text("location").default("Remote / Worldwide"),
  credits: integer("credits").default(100), // swap credits balance
  rating: text("rating").default("5.0"), // formatted rating e.g. 4.9
  reviewCount: integer("review_count").default(0),
  instagramHandle: text("instagram_handle").default(""),
  githubHandle: text("github_handle").default(""),
  twitterHandle: text("twitter_handle").default(""),
  isOnline: boolean("is_online").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSkills = pgTable("user_skills", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'offering' (skills to teach) | 'wanted' (skills to learn)
  skillName: text("skill_name").notNull(),
  category: text("category").notNull(), // Design, Coding, Languages, Music, Marketing, Business, Lifestyle
  proficiency: text("proficiency").notNull(), // Beginner, Intermediate, Advanced, Expert
  description: text("description").default(""),
  yearsExperience: integer("years_experience").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const swapProposals = pgTable("swap_proposals", {
  id: text("id").primaryKey(),
  senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: text("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  offeredSkill: text("offered_skill").notNull(),
  wantedSkill: text("wanted_skill").notNull(),
  message: text("message").notNull(),
  status: text("status").default("pending"), // 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  durationMinutes: integer("duration_minutes").default(45),
  proposedDate: text("proposed_date").notNull(),
  matchScore: integer("match_score").default(85),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const swapSessions = pgTable("swap_sessions", {
  id: text("id").primaryKey(),
  proposalId: text("proposal_id").references(() => swapProposals.id, { onDelete: "set null" }),
  hostId: text("host_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  participantId: text("participant_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  skillTaughtByHost: text("skill_taught_by_host").notNull(),
  skillTaughtByParticipant: text("skill_taught_by_participant").notNull(),
  scheduledAt: text("scheduled_at").notNull(), // ISO or display date
  durationMinutes: integer("duration_minutes").default(45),
  status: text("status").default("upcoming"), // 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  meetingLink: text("meeting_link").default("https://meet.jit.si/skillswap-room"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: text("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  id: text("id").primaryKey(),
  followerId: text("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: text("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetUserId: text("target_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  skillName: text("skill_name").notNull(),
  rating: integer("rating").notNull(), // 1 to 5
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
  type: text("type").notNull(), // 'proposal_received', 'proposal_accepted', 'new_follower', 'new_message', 'session_reminder', 'review_received'
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link").default(""),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
