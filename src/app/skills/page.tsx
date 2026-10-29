"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Plus,
  BookOpen,
  Sparkle,
  Stack,
  Trash,
  PencilSimple,
  Lightning,
  Medal
} from "@phosphor-icons/react";
import { UserSkill } from "@/types";

const CATEGORIES = ["Coding", "Design", "Languages", "Music", "Marketing", "Business", "Photography", "Lifestyle"];
const PROFICIENCIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

const DEFAULT_INITIAL_SKILLS: UserSkill[] = [
  {
    id: "sk_offering_1",
    userId: "usr_current",
    type: "offering",
    skillName: "React & Next.js",
    category: "Coding",
    proficiency: "Expert",
    yearsExperience: 5,
    description: "Building production full-stack web applications with Next.js App Router & Tailwind.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sk_offering_2",
    userId: "usr_current",
    type: "offering",
    skillName: "TypeScript & Node.js",
    category: "Coding",
    proficiency: "Advanced",
    yearsExperience: 4,
    description: "Type-safe backend API development & PostgreSQL database queries.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sk_wanted_1",
    userId: "usr_current",
    type: "wanted",
    skillName: "Figma UI/UX Design",
    category: "Design",
    proficiency: "Beginner",
    description: "Design systems, auto-layout, and high-fidelity mobile & web prototypes.",
    createdAt: new Date().toISOString(),
  },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<UserSkill | null>(null);

  // Form fields
  const [skillType, setSkillType] = useState<"offering" | "wanted">("offering");
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("Coding");
  const [proficiency, setProficiency] = useState<"Beginner" | "Intermediate" | "Advanced" | "Expert">("Advanced");
  const [yearsExperience, setYearsExperience] = useState(1);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/skills?userId=usr_current");
      const safeJson = async (r: Response) => {
        if (!r.ok || !r.headers.get("content-type")?.includes("application/json")) return {};
        return r.json().catch(() => ({}));
      };
      const data = await safeJson(res);

      if (data.skills && data.skills.length > 0) {
        setSkills(data.skills);
        localStorage.setItem("skillswap_user_skills", JSON.stringify(data.skills));
      } else {
        const saved = localStorage.getItem("skillswap_user_skills");
        if (saved) {
          try {
            setSkills(JSON.parse(saved));
          } catch {
            setSkills(DEFAULT_INITIAL_SKILLS);
          }
        } else {
          setSkills(DEFAULT_INITIAL_SKILLS);
        }
      }
    } catch (e) {
      console.error(e);
      const saved = localStorage.getItem("skillswap_user_skills");
      if (saved) {
        try {
          setSkills(JSON.parse(saved));
        } catch {
          setSkills(DEFAULT_INITIAL_SKILLS);
        }
      } else {
        setSkills(DEFAULT_INITIAL_SKILLS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const saveToLocalCache = (newSkillsList: UserSkill[]) => {
    setSkills(newSkillsList);
    try {
      localStorage.setItem("skillswap_user_skills", JSON.stringify(newSkillsList));
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = (type: "offering" | "wanted") => {
    setEditingSkill(null);
    setSkillType(type);
    setSkillName("");
    setCategory("Coding");
    setProficiency(type === "offering" ? "Advanced" : "Beginner");
    setYearsExperience(type === "offering" ? 1 : 0);
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (s: UserSkill) => {
    setEditingSkill(s);
    setSkillType(s.type);
    setSkillName(s.skillName);
    setCategory(s.category);
    setProficiency(s.proficiency);
    setYearsExperience(s.yearsExperience || 1);
    setDescription(s.description || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this skill?")) return;
    const updated = skills.filter((s) => s.id !== id);
    saveToLocalCache(updated);

    try {
      await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setSaving(true);

    if (editingSkill) {
      // Edit existing skill
      const updatedItem: UserSkill = {
        ...editingSkill,
        skillName: skillName.trim(),
        category,
        proficiency,
        yearsExperience,
        description,
        type: skillType,
      };
      const updatedList = skills.map((s) => (s.id === editingSkill.id ? updatedItem : s));
      saveToLocalCache(updatedList);
      setIsModalOpen(false);

      try {
        await fetch("/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingSkill.id,
            skillName: skillName.trim(),
            category,
            proficiency,
            yearsExperience,
            description,
            type: skillType,
          }),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    } else {
      // Create new skill
      const newSkill: UserSkill = {
        id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: "usr_current",
        type: skillType,
        skillName: skillName.trim(),
        category,
        proficiency,
        yearsExperience,
        description,
        createdAt: new Date().toISOString(),
      };

      const updatedList = [newSkill, ...skills];
      saveToLocalCache(updatedList);
      setIsModalOpen(false);

      try {
        await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "usr_current",
            type: skillType,
            skillName: skillName.trim(),
            category,
            proficiency,
            yearsExperience,
            description,
          }),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  const offeringSkills = skills.filter((s) => s.type === "offering");
  const wantedSkills = skills.filter((s) => s.type === "wanted");

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200">
              <Stack className="w-4 h-4 text-zinc-600" />
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tight">Manage Skills Portfolio</h1>
          </div>
          <p className="text-xs text-zinc-500 font-normal mt-1">
            Curate what you can teach to peers and list the skills you want to learn in exchange.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddModal("offering")}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            + Teach Skill
          </button>
          <button
            onClick={() => openAddModal("wanted")}
            className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-600" />
            + Learn Skill
          </button>
        </div>
      </div>

      {/* Grid of 2 Categories: Offering vs Wanted */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SKILLS YOU TEACH (OFFERING) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Medal className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-base font-black text-slate-900">Skills You Teach (Offering)</h2>
            </div>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {offeringSkills.length} Listed
            </span>
          </div>

          <div className="space-y-3">
            {offeringSkills.map((sk) => (
              <div
                key={sk.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3 shadow-md group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">{sk.skillName}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-black uppercase">
                        {sk.proficiency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {sk.category}
                      </span>
                      <span>&bull;</span>
                      <span>{sk.yearsExperience} yrs experience</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(sk)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Skill"
                    >
                      <PencilSimple className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sk.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Skill"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {sk.description && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80 font-medium">
                    {sk.description}
                  </p>
                )}
              </div>
            ))}

            {offeringSkills.length === 0 && (
              <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">No teaching skills added yet. Click &quot;Add Skill to Teach&quot; above!</p>
              </div>
            )}
          </div>
        </div>

        {/* SKILLS YOU WANT TO LEARN (WANTED) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-base font-black text-slate-900">Skills You Want to Learn (Wanted)</h2>
            </div>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              {wantedSkills.length} Listed
            </span>
          </div>

          <div className="space-y-3">
            {wantedSkills.map((sk) => (
              <div
                key={sk.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-purple-300 transition-all flex flex-col justify-between space-y-3 shadow-md group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">{sk.skillName}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-black uppercase">
                        Target: {sk.proficiency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {sk.category}
                      </span>
                      <span>&bull;</span>
                      <span>Aiming to improve</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(sk)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Skill"
                    >
                      <PencilSimple className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sk.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Skill"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {sk.description && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80 font-medium">
                    {sk.description}
                  </p>
                )}
              </div>
            ))}

            {wantedSkills.length === 0 && (
              <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">No wanted skills added yet. Add what you want to learn!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Stack className="w-4 h-4 text-cyan-600" />
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Type selector (Teaching / Offering vs Learning / Wanted) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Skill Category Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSkillType("offering")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    skillType === "offering"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Teaching (Offering)
                </button>
                <button
                  type="button"
                  onClick={() => setSkillType("wanted")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    skillType === "wanted"
                      ? "bg-purple-100 text-purple-800 border-purple-300 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Learning (Wanted)
                </button>
              </div>
            </div>

            {/* Skill Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Skill Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Python, Next.js, Figma, Spanish, Ableton..."
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 font-medium"
              />
            </div>

            {/* Category & Proficiency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Proficiency</label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {PROFICIENCIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Years of Experience */}
            {skillType === "offering" && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Years of Experience: {yearsExperience} yrs
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Description / Curriculum Overview
              </label>
              <textarea
                rows={3}
                placeholder="What topics do you cover or what specific goals are you aiming to achieve?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 font-medium"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold disabled:opacity-50 shadow-md shadow-cyan-500/25"
              >
                {saving ? "Saving..." : editingSkill ? "Save Changes" : "Create Skill"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
