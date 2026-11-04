"use client";

import { useRef, useState } from "react";
import { User, Camera, Save, Check, X, Clock, Calendar } from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";

export default function SettingsView() {
  const { currentUser, updateProfile } = useSkillSwapStore();

  const [displayName, setDisplayName] = useState(currentUser.full_name || "nani");
  const [location, setLocation] = useState(currentUser.location || "San Francisco, CA");
  const [headline, setHeadline] = useState(
    "Full-Stack Developer & Aspiring Designer"
  );
  const [bio, setBio] = useState(
    currentUser.bio || "Love sharing coding knowledge and learning visual arts."
  );
  const [instagram, setInstagram] = useState("creator_alex");
  const [github, setGithub] = useState("alexmorgan");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Fri", "Sat"]);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateProfile({ avatar_url: dataUrl });
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    updateProfile({ avatar_url: "/avatar-nani.jpg" });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: displayName,
      bio,
      location,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1100px] w-full mx-auto space-y-6">
          {/* Page Heading */}
          <div>
            <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
              Account &amp; Platform Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Customize your profile photo, bio, social handles, and peer discovery preferences.
            </p>
          </div>

          {/* Settings Main Card */}
          <div className="bg-white rounded-3xl border border-[#f0f0f0] p-8 shadow-xs">
            {/* Section Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <User className="w-5 h-5 text-[#00bcd4] stroke-[2.2]" />
              <h2 className="text-base font-bold text-[#0f172a]">
                Public Profile Information
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Photo Box */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-5">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  id="profile-photo-input"
                />

                <div className="relative flex-shrink-0">
                  <img
                    src={currentUser.avatar_url || "/avatar-nani.jpg"}
                    alt="Profile"
                    className="w-[72px] h-[72px] rounded-full object-cover ring-2 ring-[#00bcd4]/20"
                  />
                  <span className="w-3.5 h-3.5 bg-[#10b981] rounded-full ring-2 ring-white absolute bottom-0.5 right-0.5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0f172a] mb-2.5">
                    Profile Photo
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-400" />
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e11d48] hover:underline px-1 py-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  </div>

                </div>
              </div>

              {/* Display Name & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full text-xs px-4 py-3 bg-[#fbfbfb] border border-slate-200/90 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                    Location / Timezone
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs px-4 py-3 bg-[#fbfbfb] border border-slate-200/90 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 transition-colors"
                  />
                </div>
              </div>

              {/* Headline Tagline */}
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Headline Tagline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full text-xs px-4 py-3 bg-[#fbfbfb] border border-slate-200/90 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 transition-colors"
                />
              </div>

              {/* About Bio */}
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  About Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs px-4 py-3 bg-[#fbfbfb] border border-slate-200/90 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 transition-colors resize-none"
                />
              </div>

              {/* SOCIAL & PORTFOLIO LINKS */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-[#0f172a] tracking-wider uppercase mb-3">
                  SOCIAL &amp; PORTFOLIO LINKS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full text-xs px-4 py-3 bg-[#fbfbfb] border border-slate-200/90 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                      GitHub Handle
                    </label>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full text-xs px-4 py-3 bg-[#fbfbfb] border border-slate-200/90 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* WEEKLY AVAILABILITY (From Onboarding Image 5) */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60">
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a]">
                      Your Typical Availability
                    </h3>
                    <p className="text-xs text-slate-400">
                      Select the days you are generally free for 1-hour swap sessions.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {days.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-600/30"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-slate-400 mt-3">
                  You can fine-tune specific hour slots later under Settings.
                </p>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-3 pt-3">
                {saved && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Changes saved!
                  </span>
                )}
                <button
                  type="submit"
                  className="bg-[#00b4d8] hover:bg-[#0096c7] text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
