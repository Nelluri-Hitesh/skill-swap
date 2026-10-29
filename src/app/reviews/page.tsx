"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChatCircle,
  Check,
  Star,
  Plus,
  Sparkle,
  Medal,
  ThumbsUp
} from "@phosphor-icons/react";
import { Review } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form
  const [targetUsername, setTargetUsername] = useState("usr_sofia");
  const [skillName, setSkillName] = useState("Figma UI/UX Design");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: "usr_current",
          targetUserId: targetUsername,
          skillName,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        fetchReviews();
        setIsModalOpen(false);
        setComment("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <Star className="w-4 h-4 fill-yellow-400" />
            </span>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Peer Feedback & Reviews</h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Ratings earned by community members across completed skill exchanges. Builds trust and reputation.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-amber-600/30"
        >
          <Plus className="w-3.5 h-3.5" />
          Write a Review
        </button>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-zinc-100 border border-zinc-200" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center bg-white border border-zinc-200 rounded-2xl">
          <p className="text-xs text-zinc-400">No reviews logged yet. Complete a session to leave one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 transition-all flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.author?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                      alt={rev.author?.name || "Author"}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">{rev.author?.name}</h4>
                      <p className="text-[11px] text-zinc-400">
                        {rev.author?.headline || "Verified Peer"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Skill: {rev.skillName}
                  </span>
                  <p className="text-xs text-zinc-700 mt-2 font-normal leading-relaxed">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Verified 1-on-1 Swap</span>
                <span>{formatTimeAgo(rev.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleSubmitReview}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                Review a Swap Partner
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Partner</label>
              <select
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="usr_sofia">Sofia Rodriguez (UI/UX)</option>
                <option value="usr_kenji">Kenji Sato (Ableton / Audio)</option>
                <option value="usr_elena">Elena Rostova (Spanish / French)</option>
                <option value="usr_marcus">Marcus Vance (SEO / Marketing)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Skill Evaluated</label>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setRating(val)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        val <= rating ? "text-amber-400 fill-amber-400" : "text-slate-700"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-400 ml-2">{rating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Testimonial</label>
              <textarea
                rows={3}
                required
                placeholder="What did you learn? How clear and helpful were they?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
