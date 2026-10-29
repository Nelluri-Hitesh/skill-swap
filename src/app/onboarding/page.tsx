"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Check,
  Camera,
  MapPin,
  Sparkle,
  BookOpen,
  ArrowRight,
  Medal
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

export default function OnboardingWizard() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1: Profile details
  const [headline, setHeadline] = useState("Full-Stack Developer & Aspiring Designer");
  const [location, setLocation] = useState("San Francisco, CA");
  const [bio, setBio] = useState("Love sharing coding knowledge and learning visual arts.");

  // Step 2: Skills to teach (Offering)
  const [teachingSkill, setTeachingSkill] = useState("Next.js & React");
  const [teachingCategory, setTeachingCategory] = useState("Coding");
  const [teachingProficiency, setTeachingProficiency] = useState("Expert");

  // Step 3: Skills to learn (Wanted)
  const [learningSkill, setLearningSkill] = useState("Figma UI/UX");
  const [learningCategory, setLearningCategory] = useState("Design");

  // Step 4: Social / Instagram
  const [instagram, setInstagram] = useState("creator_alex");

  const [finishing, setFinishing] = useState(false);

  const handleFinish = async () => {
    setFinishing(true);

    try {
      // 1. Update user profile
      await fetch(`/api/users/${user?.username || "alexmorgan"}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          location,
          bio,
          instagramHandle: instagram,
        }),
      });

      // 2. Add offering skill
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "usr_current",
          type: "offering",
          skillName: teachingSkill,
          category: teachingCategory,
          proficiency: teachingProficiency,
          yearsExperience: 4,
          description: "Hands-on guidance and real-world project code reviews.",
        }),
      });

      // 3. Add wanted skill
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "usr_current",
          type: "wanted",
          skillName: learningSkill,
          category: learningCategory,
          proficiency: "Beginner",
          yearsExperience: 0,
          description: "Goal is to build clean interfaces and interactive prototypes.",
        }),
      });

      updateUser({
        headline,
        location,
        bio,
        instagramHandle: instagram,
      });

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      router.push("/dashboard");
    } finally {
      setFinishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-8">
        {/* Progress Tracker */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Step {step} of 4</span>
            <span>{step === 1 ? "Profile" : step === 2 ? "Skills to Teach" : step === 3 ? "Skills to Learn" : "Social Network"}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-white">Let&apos;s build your public creator card</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Peers will see this headline and location when searching for skill partners.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Location / Timezone</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2">
                  <Medal className="w-3.5 h-3.5" /> What can you teach?
                </div>
                <h2 className="text-xl font-bold text-white">Your Primary Skill to Share</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Peers can book sessions with you or propose swaps for this skill.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Skill Name</label>
                <input
                  type="text"
                  value={teachingSkill}
                  onChange={(e) => setTeachingSkill(e.target.value)}
                  placeholder="e.g. React, Spanish, Piano, SEO, Lightroom..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={teachingCategory}
                    onChange={(e) => setTeachingCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Coding">Coding</option>
                    <option value="Design">Design</option>
                    <option value="Languages">Languages</option>
                    <option value="Music">Music</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Photography">Photography</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Proficiency</label>
                  <select
                    value={teachingProficiency}
                    onChange={(e) => setTeachingProficiency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold mb-2">
                  <BookOpen className="w-3.5 h-3.5" /> What do you want to learn?
                </div>
                <h2 className="text-xl font-bold text-white">Your Target Learning Skill</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Our AI match algorithm will pair you with experts ready to swap for this.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Skill Name</label>
                <input
                  type="text"
                  value={learningSkill}
                  onChange={(e) => setLearningSkill(e.target.value)}
                  placeholder="e.g. Figma UI/UX, French, Ableton, 3D Blender..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={learningCategory}
                  onChange={(e) => setLearningCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Design">Design</option>
                  <option value="Coding">Coding</option>
                  <option value="Languages">Languages</option>
                  <option value="Music">Music</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Photography">Photography</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold mb-2">
                  <Camera className="w-3.5 h-3.5" /> Social Profile
                </div>
                <h2 className="text-xl font-bold text-white">Connect with Instagram Peers</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Let peers view your social creative work and connect directly like friends on Instagram.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Instagram Handle</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">@</span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="yourhandle"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
                <p className="font-semibold text-white">🎁 100 Swap Credits Ready</p>
                <p className="text-slate-400">
                  You are all set! You have received 100 bonus credits to initiate swaps immediately.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={finishing}
                onClick={handleFinish}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
              >
                {finishing ? "Finalizing..." : "Complete & Open Dashboard"}
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
