"use client";

import { useState } from "react";
import {
  Layers,
  Pencil,
  Trash2,
  X,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";

type SkillEntry = {
  id: string;
  skill_name: string;
  skill_category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  description?: string | null;
  hours_count?: number;
};

export default function SkillsView() {
  const { currentUser, addSkill, removeSkill, updateSkill } = useSkillSwapStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [skillType, setSkillType] = useState<"TEACH" | "LEARN">("TEACH");
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("Coding");
  const [skillLevel, setSkillLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("ADVANCED");
  const [description, setDescription] = useState("");

  // Edit state
  const [editingSkill, setEditingSkill] = useState<SkillEntry | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Coding");
  const [editLevel, setEditLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("ADVANCED");
  const [editDescription, setEditDescription] = useState("");

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    addSkill({
      skill_name: skillName.trim(),
      skill_category: skillCategory,
      type: skillType,
      level: skillLevel,
      description: description.trim() || undefined,
      hours_count: 0,
    });

    setSkillName("");
    setDescription("");
    setModalOpen(false);
  };

  const openAddModal = (type: "TEACH" | "LEARN") => {
    setSkillType(type);
    setModalOpen(true);
  };

  const openEditModal = (skill: SkillEntry) => {
    setEditingSkill(skill);
    setEditName(skill.skill_name);
    setEditCategory(skill.skill_category);
    setEditLevel(skill.level);
    setEditDescription(skill.description || "");
  };

  const handleEditSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editName.trim()) return;

    if (updateSkill) {
      updateSkill(editingSkill.id, {
        skill_name: editName.trim(),
        skill_category: editCategory,
        level: editLevel,
        description: editDescription.trim() || undefined,
      });
    }
    setEditingSkill(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1400px] w-full mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-400" />
                <h1 className="text-xl font-bold text-slate-900">
                  Manage Skills Portfolio
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Curate what you can teach to peers and list the skills you want to learn in exchange.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => openAddModal("TEACH")}
                className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                + Teach Skill
              </button>
              <button
                onClick={() => openAddModal("LEARN")}
                className="bg-[#f4f4f5] hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                + Learn Skill
              </button>
            </div>
          </div>

          {/* Two Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Column 1: Skills You Teach (Offering) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#d1fae5] flex items-center justify-center">
                    <GraduationCap className="w-3.5 h-3.5 text-[#059669]" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Skills You Teach (Offering)
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#065f46] bg-[#d1fae5] px-2.5 py-0.5 rounded-full">
                  {currentUser.teach_skills.length} Listed
                </span>
              </div>

              <div className="space-y-4">
                {currentUser.teach_skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white rounded-3xl border border-[#f0f0f0] p-6 shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {skill.skill_name}
                          </h3>
                          <span className="text-[10px] font-bold text-[#059669] bg-[#d1fae5] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {skill.skill_category} • {skill.hours_count ? `${skill.hours_count} yrs experience` : "4 yrs experience"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 bg-[#f8f9fa] border border-slate-100/80 rounded-2xl p-4 text-xs text-slate-600">
                      {skill.description || "Building full stack applications and mentoring peers."}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Skills You Want to Learn (Wanted) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#ede9fe] flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-[#7c3aed]" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Skills You Want to Learn (Wanted)
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#6d28d9] bg-[#ede9fe] px-2.5 py-0.5 rounded-full">
                  {currentUser.learn_skills.length} Listed
                </span>
              </div>

              <div className="space-y-4">
                {currentUser.learn_skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white rounded-3xl border border-[#f0f0f0] p-6 shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {skill.skill_name}
                          </h3>
                          <span className="text-[10px] font-bold text-[#7e22ce] bg-[#f3e8ff] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            TARGET: BEGINNER
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {skill.skill_category} • Aiming to improve
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 bg-[#f8f9fa] border border-slate-100/80 rounded-2xl p-4 text-xs text-slate-600">
                      {skill.description || "Looking to learn and improve skills."}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Skill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#f0f0f0] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {skillType === "TEACH" ? "Add Skill You Teach" : "Add Skill You Want to Learn"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Python, React, Figma..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="Coding">Coding</option>
                  <option value="Design">Design</option>
                  <option value="Language">Language</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Proficiency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map(
                    (lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSkillLevel(lvl)}
                        className={`py-2 text-xs font-medium rounded-xl border capitalize transition-all cursor-pointer ${
                          skillLevel === lvl
                            ? "border-black bg-black text-white font-bold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {lvl.toLowerCase()}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description / Focus
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What topics or tools do you specialize in or want to practice?"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-black hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#f0f0f0] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Edit Skill</h2>
              <button
                onClick={() => setEditingSkill(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSkill} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Python, React, Figma..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="Coding">Coding</option>
                  <option value="Design">Design</option>
                  <option value="Language">Language</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Proficiency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map(
                    (lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setEditLevel(lvl)}
                        className={`py-2 text-xs font-medium rounded-xl border capitalize transition-all cursor-pointer ${
                          editLevel === lvl
                            ? "border-black bg-black text-white font-bold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {lvl.toLowerCase()}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description / Focus
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="What topics or tools do you specialize in or want to practice?"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-black hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Update Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
