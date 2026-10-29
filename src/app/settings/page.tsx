"use client";

import { useState, useRef } from "react";
import {
  FloppyDisk,
  Check,
  Camera,
  User,
  MapPin,
  InstagramLogo,
  GithubLogo,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "Alex Morgan");
  const [headline, setHeadline] = useState(user?.headline || "Full-Stack Dev & React Specialist 🚀");
  const [bio, setBio] = useState(user?.bio || "Software engineer passionate about peer learning.");
  const [location, setLocation] = useState(user?.location || "San Francisco, CA");
  const [instagram, setInstagram] = useState(user?.instagramHandle || "alexmercer_dev");
  const [github, setGithub] = useState(user?.githubHandle || "alexmercer");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarPreview(result);
      setAvatarBase64(result);
      // Immediately persist to AuthContext so navbar updates
      updateUser({ avatarUrl: result });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setAvatarPreview(null);
    setAvatarBase64(null);
    updateUser({
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fields: Record<string, string> = {
      name,
      headline,
      bio,
      location,
      instagramHandle: instagram,
      githubHandle: github,
    };
    if (avatarBase64) fields.avatarUrl = avatarBase64;
    try {
      await fetch(`/api/users/${user?.username || "alexmercer"}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
    } catch (err) {
      console.error(err);
    } finally {
      updateUser(fields);
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const currentAvatar =
    avatarPreview ||
    user?.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

  const inputClass =
    "w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 transition-colors font-normal";

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600">
            <Sparkle className="w-4 h-4" />
          </span>
          <h1 className="text-xl md:text-2xl font-medium text-zinc-900 tracking-tight">
            Account &amp; Settings
          </h1>
        </div>
        <p className="text-xs text-zinc-500 font-normal mt-1">
          Customize your profile photo, bio, social handles, and peer discovery preferences.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-5">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* Section heading */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" />
              <h2 className="text-sm font-medium text-zinc-900">Public Profile Information</h2>
            </div>
            {saved && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" weight="bold" /> Saved!
              </span>
            )}
          </div>

          {/* Avatar Upload */}
          <div className="flex items-center gap-5 p-4 bg-zinc-50/80 rounded-xl border border-zinc-200/80">
            <div className="relative shrink-0 group">
              <img
                src={currentAvatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-white shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-900">Profile Photo</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-200 shadow-2xs cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-600" />
                  {avatarPreview ? "Change Photo" : "Upload Photo"}
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1.5">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1.5">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" weight="fill" />
                  Location / Timezone
                </span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="text-xs font-medium text-zinc-600 block mb-1.5">Headline Tagline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-medium text-zinc-600 block mb-1.5">About Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Social Links Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-medium text-zinc-900">Social &amp; Portfolio Links</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1.5">
                <span className="inline-flex items-center gap-1">
                  <InstagramLogo className="w-3 h-3" weight="fill" />
                  Instagram Handle
                </span>
              </label>
              <input
                type="text"
                placeholder="@username"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1.5">
                <span className="inline-flex items-center gap-1">
                  <GithubLogo className="w-3 h-3" weight="fill" />
                  GitHub Handle
                </span>
              </label>
              <input
                type="text"
                placeholder="username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <FloppyDisk className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
