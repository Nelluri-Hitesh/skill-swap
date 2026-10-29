import { db } from "@/db";
import { users, userSkills, swapProposals, swapSessions, messages, follows, reviews, notifications } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  // Check if users exist
  const existingUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
  const count = Number(existingUsers[0]?.count || 0);

  if (count > 0) {
    return { status: "already_seeded", count };
  }

  // 1. Seed Demo Users
  const seedUsersData = [
    {
      id: "usr_current",
      name: "Alex Morgan",
      username: "alexmorgan",
      email: "alex@skillswap.dev",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      headline: "Full-Stack Dev & React Enthusiast 🚀",
      bio: "Software engineer by day, aspiring digital music producer & Spanish learner by night. Passionate about peer learning!",
      location: "San Francisco, CA",
      credits: 140,
      rating: "4.9",
      reviewCount: 18,
      instagramHandle: "alexmorgan_dev",
      githubHandle: "alexmorgan",
      twitterHandle: "alexmorgan",
      isOnline: true,
    },
    {
      id: "usr_sofia",
      name: "Sofia Rodriguez",
      username: "sofia_design",
      email: "sofia@designstudio.io",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      headline: "Senior UI/UX & Brand Designer @ Figma",
      bio: "Crafting intuitive digital experiences for 6+ years. Eager to master Next.js & Python backend integration in return for Figma magic!",
      location: "Barcelona, Spain",
      credits: 220,
      rating: "5.0",
      reviewCount: 34,
      instagramHandle: "sofia_ux",
      githubHandle: "sofiarodriguez",
      twitterHandle: "sofia_creates",
      isOnline: true,
    },
    {
      id: "usr_kenji",
      name: "Kenji Sato",
      username: "kenjisato",
      email: "kenji@soundlab.tokyo",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      headline: "Music Producer & Ableton Live Instructor 🎧",
      bio: "Producing electronic music for 8 years. Teaching synthesizers, mixing & mastering. Want to learn TypeScript and web dev for music tech apps.",
      location: "Tokyo, Japan",
      credits: 180,
      rating: "4.95",
      reviewCount: 27,
      instagramHandle: "kenjibeats",
      githubHandle: "kenjisatodev",
      twitterHandle: "kenji_sound",
      isOnline: true,
    },
    {
      id: "usr_elena",
      name: "Elena Rostova",
      username: "elena_polyglot",
      email: "elena@polyglot.edu",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      headline: "Native Spanish & French Teacher 🗣️",
      bio: "Certified linguistics trainer. I help tech workers sound natural and fluent in conversational Spanish & French. Want to learn digital marketing & SEO.",
      location: "Montreal, Canada",
      credits: 310,
      rating: "4.9",
      reviewCount: 42,
      instagramHandle: "elena_speaks",
      githubHandle: "elenarostova",
      twitterHandle: "elena_languages",
      isOnline: false,
    },
    {
      id: "usr_marcus",
      name: "Marcus Vance",
      username: "marcus_growth",
      email: "marcus@vancegrowth.com",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      headline: "Growth Marketer & Viral Content Creator 📈",
      bio: "Grew 3 SaaS startups to $1M+ ARR. Ready to teach TikTok/Reels marketing & content funnels. Looking for 3D Blender modeling tutorials!",
      location: "Austin, TX",
      credits: 90,
      rating: "4.8",
      reviewCount: 15,
      instagramHandle: "marcusgrowth",
      githubHandle: "marcusvance",
      twitterHandle: "marcus_growth",
      isOnline: true,
    },
    {
      id: "usr_aisha",
      name: "Aisha Patel",
      username: "aisha_ai",
      email: "aisha@deeplearning.org",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      headline: "Machine Learning & PyTorch Specialist 🤖",
      bio: "PhD in AI. Love teaching LLM prompt engineering, fine-tuning, and RAG architectures. Looking to learn photography and Lightroom editing.",
      location: "London, UK",
      credits: 250,
      rating: "5.0",
      reviewCount: 29,
      instagramHandle: "aisha_codes",
      githubHandle: "aishapatel",
      twitterHandle: "aisha_ai",
      isOnline: true,
    },
    {
      id: "usr_david",
      name: "David Kim",
      username: "david_photo",
      email: "david@lumina.art",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      headline: "Street & Portrait Photographer 📷",
      bio: "Commercial photographer published in NatGeo and Vogue. Happy to teach composition, lighting & color grading in exchange for Python data analysis.",
      location: "Seoul, South Korea",
      credits: 160,
      rating: "4.92",
      reviewCount: 22,
      instagramHandle: "davidkim_snaps",
      githubHandle: "davidkim",
      twitterHandle: "davidkim_art",
      isOnline: false,
    }
  ];

  await db.insert(users).values(seedUsersData);

  // 2. Seed Skills (Offering & Wanted)
  const skillsData = [
    // Current user (Alex)
    { id: "sk_1", userId: "usr_current", type: "offering", skillName: "React & Next.js", category: "Coding", proficiency: "Expert", description: "Modern React 19, Server Components, App Router, full-stack applications.", yearsExperience: 5 },
    { id: "sk_2", userId: "usr_current", type: "offering", skillName: "TypeScript", category: "Coding", proficiency: "Advanced", description: "Strict typing, generics, utility types, and building robust web services.", yearsExperience: 4 },
    { id: "sk_3", userId: "usr_current", type: "offering", skillName: "Node.js & Postgres", category: "Coding", proficiency: "Advanced", description: "REST/GraphQL APIs, SQL queries, Drizzle ORM, authentication flows.", yearsExperience: 4 },
    { id: "sk_4", userId: "usr_current", type: "wanted", skillName: "Figma UI/UX Design", category: "Design", proficiency: "Beginner", description: "Want to design clean mockups, master auto-layout, and create design systems.", yearsExperience: 0 },
    { id: "sk_5", userId: "usr_current", type: "wanted", skillName: "Ableton Live Production", category: "Music", proficiency: "Beginner", description: "Want to learn beatmaking, synth design, and basic audio mixing.", yearsExperience: 0 },
    { id: "sk_6", userId: "usr_current", type: "wanted", skillName: "Conversational Spanish", category: "Languages", proficiency: "Intermediate", description: "Planning a trip to South America, want fluency in everyday conversations.", yearsExperience: 1 },

    // Sofia
    { id: "sk_7", userId: "usr_sofia", type: "offering", skillName: "Figma UI/UX Design", category: "Design", proficiency: "Expert", description: "Components, tokens, auto-layout, interactive prototypes, and design handoff.", yearsExperience: 6 },
    { id: "sk_8", userId: "usr_sofia", type: "offering", skillName: "Design Systems", category: "Design", proficiency: "Expert", description: "Building scalable multi-brand component libraries and design tokens.", yearsExperience: 5 },
    { id: "sk_9", userId: "usr_sofia", type: "wanted", skillName: "React & Next.js", category: "Coding", proficiency: "Beginner", description: "Want to turn my Figma designs directly into live Next.js prototypes.", yearsExperience: 0 },
    { id: "sk_10", userId: "usr_sofia", type: "wanted", skillName: "Tailwind CSS", category: "Coding", proficiency: "Beginner", description: "Mastering utility classes and animations.", yearsExperience: 0 },

    // Kenji
    { id: "sk_11", userId: "usr_kenji", type: "offering", skillName: "Ableton Live Production", category: "Music", proficiency: "Expert", description: "Synthesizers (Serum/Vital), EQing, compression, and EDM/Lo-fi beat creation.", yearsExperience: 8 },
    { id: "sk_12", userId: "usr_kenji", type: "offering", skillName: "Audio Mixing & Mastering", category: "Music", proficiency: "Advanced", description: "Stem mixing, tonal balance, mastering for Spotify/Apple Music standards.", yearsExperience: 6 },
    { id: "sk_13", userId: "usr_kenji", type: "wanted", skillName: "React & Next.js", category: "Coding", proficiency: "Beginner", description: "Building a portfolio and interactive web audio player.", yearsExperience: 0 },
    { id: "sk_14", userId: "usr_kenji", type: "wanted", skillName: "TypeScript", category: "Coding", proficiency: "Beginner", description: "Coding clean web audio DSP plugins with WebAssembly/TypeScript.", yearsExperience: 0 },

    // Elena
    { id: "sk_15", userId: "usr_elena", type: "offering", skillName: "Conversational Spanish", category: "Languages", proficiency: "Expert", description: "Accent reduction, vocabulary, business Spanish, and casual slang.", yearsExperience: 9 },
    { id: "sk_16", userId: "usr_elena", type: "offering", skillName: "French for Beginners", category: "Languages", proficiency: "Expert", description: "Grammar foundations, pronunciation, and practical daily dialogues.", yearsExperience: 7 },
    { id: "sk_17", userId: "usr_elena", type: "wanted", skillName: "SEO & Growth Marketing", category: "Marketing", proficiency: "Beginner", description: "Optimizing my language tutoring website and ranking on Google.", yearsExperience: 0 },

    // Marcus
    { id: "sk_18", userId: "usr_marcus", type: "offering", skillName: "SEO & Growth Marketing", category: "Marketing", proficiency: "Expert", description: "Keyword strategy, technical SEO, link-building funnels, and landing page conversion.", yearsExperience: 7 },
    { id: "sk_19", userId: "usr_marcus", type: "offering", skillName: "Viral Reels & TikTok Strategy", category: "Marketing", proficiency: "Expert", description: "Script hooks, retention editing, and distribution algorithms.", yearsExperience: 4 },
    { id: "sk_20", userId: "usr_marcus", type: "wanted", skillName: "Python & Data Analysis", category: "Coding", proficiency: "Beginner", description: "Automating lead scraping and cleaning marketing analytics with Pandas.", yearsExperience: 0 },

    // Aisha
    { id: "sk_21", userId: "usr_aisha", type: "offering", skillName: "Machine Learning & AI Prompting", category: "Coding", proficiency: "Expert", description: "LLM fine-tuning, LangChain, vector databases, and embeddings in production.", yearsExperience: 6 },
    { id: "sk_22", userId: "usr_aisha", type: "offering", skillName: "Python Data Science", category: "Coding", proficiency: "Expert", description: "NumPy, Pandas, Scikit-Learn, data visualization with Matplotlib.", yearsExperience: 7 },
    { id: "sk_23", userId: "usr_aisha", type: "wanted", skillName: "Street Photography", category: "Photography", proficiency: "Beginner", description: "Shutter speed control, street framing, aperture tricks, and RAW editing.", yearsExperience: 0 },

    // David
    { id: "sk_24", userId: "usr_david", type: "offering", skillName: "Street Photography", category: "Photography", proficiency: "Expert", description: "Storytelling, manual camera mastery, natural lighting, and color grading in Lightroom.", yearsExperience: 8 },
    { id: "sk_25", userId: "usr_david", type: "wanted", skillName: "Machine Learning & AI Prompting", category: "Coding", proficiency: "Beginner", description: "Using generative AI and Stable Diffusion to augment photo edits.", yearsExperience: 0 }
  ];

  await db.insert(userSkills).values(skillsData);

  // 3. Seed Swap Proposals
  const proposalsData = [
    {
      id: "prop_1",
      senderId: "usr_sofia",
      receiverId: "usr_current",
      offeredSkill: "Figma UI/UX Design",
      wantedSkill: "React & Next.js",
      message: "Hey Alex! I saw your profile and love your Next.js experience. I can help you build an ultra-clean design system in Figma if you can guide me on setting up App Router components!",
      status: "pending",
      durationMinutes: 60,
      proposedDate: "Tomorrow at 4:00 PM EST",
      matchScore: 98,
    },
    {
      id: "prop_2",
      senderId: "usr_current",
      receiverId: "usr_kenji",
      offeredSkill: "TypeScript",
      wantedSkill: "Ableton Live Production",
      message: "Hi Kenji! I'd love to swap my TypeScript skills for an Ableton beat-making crash course. Would Thursday work for a 45 min session?",
      status: "accepted",
      durationMinutes: 45,
      proposedDate: "This Thursday at 7:00 PM JST",
      matchScore: 95,
    },
    {
      id: "prop_3",
      senderId: "usr_elena",
      receiverId: "usr_current",
      offeredSkill: "Conversational Spanish",
      wantedSkill: "Node.js & Postgres",
      message: "Hola Alex! I need some guidance on querying Postgres for my web app. Happy to exchange for 1-on-1 Spanish conversation practice!",
      status: "pending",
      durationMinutes: 45,
      proposedDate: "Friday at 2:00 PM EST",
      matchScore: 92,
    }
  ];

  await db.insert(swapProposals).values(proposalsData);

  // 4. Seed Swap Sessions
  const sessionsData = [
    {
      id: "sess_1",
      proposalId: "prop_2",
      hostId: "usr_kenji",
      participantId: "usr_current",
      skillTaughtByHost: "Ableton Live Production",
      skillTaughtByParticipant: "TypeScript",
      scheduledAt: "Tomorrow, 6:00 PM EST",
      durationMinutes: 45,
      status: "upcoming",
      meetingLink: "https://meet.jit.si/skillswap-kenji-alex",
      notes: "Kenji will demonstrate synth automation; Alex will review Kenji's audio plugin repo.",
    },
    {
      id: "sess_2",
      proposalId: null,
      hostId: "usr_sofia",
      participantId: "usr_current",
      skillTaughtByHost: "Figma UI/UX Design",
      skillTaughtByParticipant: "React & Next.js",
      scheduledAt: "Saturday, 11:00 AM EST",
      durationMinutes: 60,
      status: "upcoming",
      meetingLink: "https://meet.jit.si/skillswap-sofia-alex",
      notes: "Focusing on auto-layout tokens and translating them to Tailwind CSS.",
    },
    {
      id: "sess_3",
      proposalId: null,
      hostId: "usr_marcus",
      participantId: "usr_current",
      skillTaughtByHost: "SEO & Growth Marketing",
      skillTaughtByParticipant: "React & Next.js",
      scheduledAt: "Last week",
      durationMinutes: 45,
      status: "completed",
      meetingLink: "https://meet.jit.si/skillswap-marcus-alex",
      notes: "Reviewed programmatic SEO patterns and next-sitemap generator.",
    }
  ];

  await db.insert(swapSessions).values(sessionsData);

  // 5. Seed Messages
  const messagesData = [
    {
      id: "msg_1",
      senderId: "usr_sofia",
      receiverId: "usr_current",
      content: "Hi Alex! Thanks for checking out my proposal. Do you have any specific Figma project in mind for our swap session?",
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 5),
    },
    {
      id: "msg_2",
      senderId: "usr_current",
      receiverId: "usr_sofia",
      content: "Hey Sofia! Yes! I'm redesigning a SaaS analytics card with glassmorphism and nested tabs. Would love your eyes on the visual hierarchy.",
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      id: "msg_3",
      senderId: "usr_sofia",
      receiverId: "usr_current",
      content: "That sounds awesome! I prepared a starter Figma file with color scales and typography tokens. Can't wait for our session!",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 1),
    },
    {
      id: "msg_4",
      senderId: "usr_kenji",
      receiverId: "usr_current",
      content: "Hey! Ready for the Ableton session on Thursday. Make sure to download Vital synth free version beforehand so we can play with sound design!",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 2),
    }
  ];

  await db.insert(messages).values(messagesData);

  // 6. Seed Follows
  const followsData = [
    { id: "fol_1", followerId: "usr_current", followingId: "usr_sofia" },
    { id: "fol_2", followerId: "usr_current", followingId: "usr_kenji" },
    { id: "fol_3", followerId: "usr_sofia", followingId: "usr_current" },
    { id: "fol_4", followerId: "usr_elena", followingId: "usr_current" },
    { id: "fol_5", followerId: "usr_aisha", followingId: "usr_current" },
  ];

  await db.insert(follows).values(followsData);

  // 7. Seed Reviews
  const reviewsData = [
    {
      id: "rev_1",
      authorId: "usr_marcus",
      targetUserId: "usr_current",
      skillName: "React & Next.js",
      rating: 5,
      comment: "Alex is an incredible teacher! In just 45 minutes, he debugged our Next.js caching issue and explained server actions clearly.",
      createdAt: new Date(Date.now() - 86400000 * 3),
    },
    {
      id: "rev_2",
      authorId: "usr_sofia",
      targetUserId: "usr_kenji",
      skillName: "Ableton Live Production",
      rating: 5,
      comment: "Kenji's production workflow is super clean. Taught me how to use sidechain compression effortlessly. 10/10!",
      createdAt: new Date(Date.now() - 86400000 * 5),
    },
    {
      id: "rev_3",
      authorId: "usr_current",
      targetUserId: "usr_marcus",
      skillName: "SEO & Growth Marketing",
      rating: 5,
      comment: "Marcus provided great actionable tips on keyword clustering and landing page conversion rates. Super friendly!",
      createdAt: new Date(Date.now() - 86400000 * 2),
    }
  ];

  await db.insert(reviews).values(reviewsData);

  // 8. Seed Notifications
  const notificationsData = [
    {
      id: "notif_1",
      userId: "usr_current",
      actorId: "usr_sofia",
      type: "proposal_received",
      title: "New Swap Proposal!",
      message: "Sofia Rodriguez wants to exchange Figma UI/UX Design for React & Next.js (98% Match)",
      link: "/matches",
      isRead: false,
    },
    {
      id: "notif_2",
      userId: "usr_current",
      actorId: "usr_kenji",
      type: "proposal_accepted",
      title: "Proposal Accepted!",
      message: "Kenji Sato accepted your proposal to swap TypeScript for Ableton Live Production.",
      link: "/sessions",
      isRead: false,
    },
    {
      id: "notif_3",
      userId: "usr_current",
      actorId: "usr_elena",
      type: "new_follower",
      title: "New Follower",
      message: "Elena Rostova started following you.",
      link: "/profile/elena_polyglot",
      isRead: true,
    }
  ];

  await db.insert(notifications).values(notificationsData);

  return { status: "success", seededUsers: seedUsersData.length };
}
