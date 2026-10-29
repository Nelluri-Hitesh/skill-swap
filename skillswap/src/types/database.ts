export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          bio: string | null;
          location: string | null;
          timezone: string;
          languages: string[];
          avatar_url: string | null;
          rating_avg: number;
          rating_count: number;
          completed_sessions_count: number;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          bio?: string | null;
          location?: string | null;
          timezone?: string;
          languages?: string[];
          avatar_url?: string | null;
          rating_avg?: number;
          rating_count?: number;
          completed_sessions_count?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
      };
      user_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string | null;
          skill_name: string;
          skill_category: string;
          type: "TEACH" | "LEARN";
          level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
          description: string | null;
          hours_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id?: string;
          skill_name: string;
          skill_category: string;
          type: "TEACH" | "LEARN";
          level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
          description?: string | null;
          hours_count?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_skills"]["Insert"]>;
      };
      availability: {
        Row: {
          id: string;
          user_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          timezone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          timezone: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["availability"]["Insert"]>;
      };
      connections: {
        Row: {
          id: string;
          requester_id: string;
          receiver_id: string;
          message: string | null;
          status: "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          receiver_id: string;
          message?: string | null;
          status?: "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["connections"]["Insert"]>;
      };
      sessions: {
        Row: {
          id: string;
          connection_id: string;
          teacher_id: string;
          learner_id: string;
          skill_name: string;
          scheduled_at: string;
          duration_minutes: number;
          status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";
          meeting_link: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          connection_id: string;
          teacher_id: string;
          learner_id: string;
          skill_name: string;
          scheduled_at: string;
          duration_minutes: number;
          status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";
          meeting_link?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sessions"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          connection_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          connection_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          session_id: string;
          from_user_id: string;
          to_user_id: string;
          rating: number;
          comment: string | null;
          type: "TEACHING" | "LEARNING";
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          from_user_id: string;
          to_user_id: string;
          rating: number;
          comment?: string | null;
          type: "TEACHING" | "LEARNING";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          data: Json | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          data?: Json | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      skill_type: "TEACH" | "LEARN";
      skill_level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
      connection_status: "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";
      session_status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";
    };
  };
};

// Convenience type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserSkill = Database["public"]["Tables"]["user_skills"]["Row"];
export type Connection = Database["public"]["Tables"]["connections"]["Row"];
export type Session = Database["public"]["Tables"]["sessions"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type Availability = Database["public"]["Tables"]["availability"]["Row"];

// Extended types with joined data
export type ProfileWithSkills = Profile & {
  teach_skills: UserSkill[];
  learn_skills: UserSkill[];
};

export type ConnectionWithProfile = Connection & {
  requester: Profile;
  receiver: Profile;
};

export type SessionWithProfiles = Session & {
  teacher: Profile;
  learner: Profile;
};

export type MessageWithSender = Message & {
  sender: Profile;
};
