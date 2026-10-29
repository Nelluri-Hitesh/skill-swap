"use client";

import { useState } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Globe,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ProfileWithSkills } from "@/types/database";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPartner?: ProfileWithSkills;
  preselectedSkill?: string;
}

export function ScheduleModal({
  isOpen,
  onClose,
  preselectedPartner,
  preselectedSkill,
}: ScheduleModalProps) {
  const { community, currentUser, scheduleSession } = useSkillSwapStore();

  const [step, setStep] = useState<number>(preselectedPartner ? 2 : 1);
  const [selectedPartner, setSelectedPartner] = useState<ProfileWithSkills | null>(
    preselectedPartner || community[0] || null
  );
  const [selectedSkill, setSelectedSkill] = useState<string>(preselectedSkill || "");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [notes, setNotes] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Available skills to learn from partner
  const partnerSkills = selectedPartner?.teach_skills || [];

  const timeSlots = [
    "09:00",
    "10:00",
    "11:30",
    "13:00",
    "14:30",
    "16:00",
    "17:30",
    "19:00",
  ];

  // Quick dates for next 5 days
  const today = new Date();
  const dateOptions = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i + 1);
    return {
      value: d.toISOString().split("T")[0],
      display: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  });

  const handleConfirm = () => {
    if (!selectedPartner || !selectedSkill || !selectedDate) return;
    scheduleSession({
      partnerId: selectedPartner.id,
      skillName: selectedSkill,
      date: selectedDate,
      time: selectedTime,
      durationMinutes,
      notes,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setStep(1);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Schedule Learning Session
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Step {step} of 5 — {getStepTitle(step)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="px-6 pt-3">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-blue-600" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Session Confirmed!
              </h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Invitation sent to {selectedPartner?.full_name}. Google Meet link and calendar details created.
              </p>
            </div>
          ) : (
            <>
              {/* STEP 1: Select Person */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Select Peer Mentor / Learner
                  </p>
                  <div className="space-y-2">
                    {community.map((p) => {
                      const isSelected = selectedPartner?.id === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedPartner(p);
                            if (p.teach_skills.length > 0) {
                              setSelectedSkill(p.teach_skills[0].skill_name);
                            }
                          }}
                          className={cn(
                            "p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all",
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 shadow-xs"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/60"
                          )}
                        >
                          <img
                            src={p.avatar_url || ""}
                            alt={p.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                              {p.full_name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              Teaches: {p.teach_skills.map((s) => s.skill_name).join(", ")}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Select Skill */}
              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Which skill do you want to learn from {selectedPartner?.full_name}?
                  </p>
                  <div className="space-y-2">
                    {partnerSkills.map((s) => {
                      const isSelected = selectedSkill === s.skill_name;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedSkill(s.skill_name)}
                          className={cn(
                            "p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 shadow-xs"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/60"
                          )}
                        >
                          <div>
                            <span className="text-sm font-semibold text-gray-900 block">
                              {s.skill_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              Level: {s.level} • {s.description}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Select Date */}
              {step === 3 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Select a Date
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {dateOptions.map((opt) => {
                      const isSelected = selectedDate === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelectedDate(opt.value)}
                          className={cn(
                            "p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all",
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 font-semibold text-blue-700"
                              : "border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <CalendarIcon className="w-4 h-4 text-blue-500" />
                          <span className="text-xs">{opt.display}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Select Time & Timezone Comparison */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5 text-xs text-slate-600">
                    <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span>Your timezone: <strong>{currentUser.timezone}</strong></span>
                      <span className="block text-slate-400">
                        {selectedPartner?.full_name}&apos;s timezone: {selectedPartner?.timezone}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Select Available Time Slot
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={cn(
                              "py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all",
                              isSelected
                                ? "border-blue-600 bg-blue-600 text-white font-semibold"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Duration, Notes & Confirmation */}
              {step === 5 && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Session Duration
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[30, 45, 60].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setDurationMinutes(dur)}
                          className={cn(
                            "py-2.5 rounded-lg border text-xs font-medium transition-all",
                            durationMinutes === dur
                              ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          {dur} Minutes
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Session Agenda or Questions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What specific topic or code challenge do you want to cover?"
                      className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                    <div className="font-semibold text-sm text-blue-950">
                      {selectedSkill} with {selectedPartner?.full_name}
                    </div>
                    <div>
                      {selectedDate} at {selectedTime} ({durationMinutes} mins)
                    </div>
                    <div className="text-[11px] text-blue-700">
                      Automated Google Meet link will be generated.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                disabled={
                  (step === 1 && !selectedPartner) ||
                  (step === 2 && !selectedSkill) ||
                  (step === 3 && !selectedDate)
                }
                onClick={() => {
                  if (step === 2 && !selectedDate) {
                    setSelectedDate(dateOptions[0].value);
                  }
                  setStep(step + 1);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Confirm & Schedule
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return "Select Person";
    case 2:
      return "Select Skill";
    case 3:
      return "Select Date";
    case 4:
      return "Select Time";
    case 5:
      return "Confirm & Duration";
    default:
      return "";
  }
}
