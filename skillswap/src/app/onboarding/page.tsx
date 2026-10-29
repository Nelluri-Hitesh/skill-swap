"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { TIMEZONES } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile, addSkill } = useSkillSwapStore();

  const [step, setStep] = useState(1);

  // Step 1: Basic Profile
  const [username, setUsername] = useState("alexmercer");
  const [fullName, setFullName] = useState("Alex Mercer");
  const [location, setLocation] = useState("San Francisco, CA");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [bio, setBio] = useState("Fullstack developer passionate about building scalable web apps and learning Data Science.");

  // Step 2: Teach Skill
  const [teachSkillName, setTeachSkillName] = useState("React & Next.js");
  const [teachLevel, setTeachLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("ADVANCED");

  // Step 3: Learn Skill
  const [learnSkillName, setLearnSkillName] = useState("Python for Data Science");
  const [learnLevel, setLearnLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("BEGINNER");

  // Step 4: Availability
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Sat"]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleFinish = () => {
    updateProfile({
      username,
      full_name: fullName,
      location,
      timezone,
      bio,
      onboarding_completed: true,
    });

    addSkill({
      skill_name: teachSkillName,
      skill_category: "Technology",
      type: "TEACH",
      level: teachLevel,
      description: "Mentoring in modern React and Next.js.",
      hours_count: 0,
    });

    addSkill({
      skill_name: learnSkillName,
      skill_category: "Technology",
      type: "LEARN",
      level: learnLevel,
      description: "Looking for peer mentorship in Python.",
      hours_count: 0,
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col justify-center items-center p-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="flex items-center gap-3 mb-6 z-10">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
          <ArrowLeftRight className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-white font-extrabold text-base tracking-wide leading-none">
            SkillSwap
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Peer Profile Onboarding
          </div>
        </div>
      </div>

      {/* Onboarding Container */}
      <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden z-10 animate-fade-in flex flex-col">
        {/* Progress Bar Header */}
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
            <span>Step {step} of 5</span>
            <span className="text-blue-600">
              {step === 1 && "Basic Profile"}
              {step === 2 && "Skills I Can Teach"}
              {step === 3 && "Skills I Want to Learn"}
              {step === 4 && "Weekly Availability"}
              {step === 5 && "Profile Complete"}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 flex-1">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">
                Tell us about yourself
              </h2>
              <p className="text-xs text-gray-500">
                This helps other learners discover your background and connect with you.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Bio / Headline
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    What skill can you teach?
                  </h2>
                  <p className="text-xs text-gray-500">
                    Offer your expertise to someone who will teach you in exchange.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Primary Skill to Teach
                </label>
                <input
                  type="text"
                  value={teachSkillName}
                  onChange={(e) => setTeachSkillName(e.target.value)}
                  placeholder="e.g. React, Python, UI/UX, Guitar, Spanish..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Proficiency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map(
                    (lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setTeachLevel(lvl)}
                        className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                          teachLevel === lvl
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {lvl.toLowerCase()}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    What skill do you want to learn?
                  </h2>
                  <p className="text-xs text-gray-500">
                    Our AI matching engine will match you with users who can teach this.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Skill to Learn
                </label>
                <input
                  type="text"
                  value={learnSkillName}
                  onChange={(e) => setLearnSkillName(e.target.value)}
                  placeholder="e.g. Python for Data Science, Figma, Machine Learning..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Desired Learning Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map(
                    (lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLearnLevel(lvl)}
                        className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                          learnLevel === lvl
                            ? "border-amber-600 bg-amber-50 text-amber-700"
                            : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {lvl.toLowerCase()}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Your Typical Availability
                  </h2>
                  <p className="text-xs text-gray-500">
                    Select the days you are generally free for 1-hour swap sessions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-2">
                {days.map((d) => {
                  const active = selectedDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-gray-400">
                You can fine-tune specific hour slots later under Settings.
              </p>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Profile Setup Complete!
                </h2>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  We found <strong>6 high-compatibility peer matches</strong> ready to swap skills with you right now!
                </p>
              </div>

              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 text-xs text-blue-900 text-left max-w-sm mx-auto space-y-1">
                <div>✓ Offering: <strong>{teachSkillName}</strong></div>
                <div>✓ Learning: <strong>{learnSkillName}</strong></div>
                <div>✓ Available: <strong>{selectedDays.join(", ")}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Stepper Controls */}
        <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          {step > 1 && step < 5 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors mx-auto"
            >
              Enter SkillSwap Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
