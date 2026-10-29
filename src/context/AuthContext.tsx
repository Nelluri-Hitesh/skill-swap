"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
}

const defaultAlexUser: User = {
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
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  user: defaultAlexUser,
  loading: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultAlexUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage or hydrate
    const savedUser = localStorage.getItem("skillswap_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(defaultAlexUser);
      }
    } else {
      setUser(defaultAlexUser);
    }
    setLoading(false);
  }, []);

  const login = (userData: Partial<User>) => {
    const updated = { ...defaultAlexUser, ...userData };
    setUser(updated);
    localStorage.setItem("skillswap_user", JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skillswap_user");
  };

  const updateUser = (fields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...fields };
      localStorage.setItem("skillswap_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
} 

export function useAuth() {
  return useContext(AuthContext);
}
