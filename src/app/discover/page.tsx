"use client";

import { useState, useMemo } from "react";
// If you still want to navigate somewhere later you can keep this import
// import { useRouter } from "next/navigation";
import { track } from "../../lib/gtag"; // relative path from /app/discover to /lib/gtag

type Question =
  | {
      id: string;
      type: "single";
      title: string;
      description?: string;
      options: string[];
      required?: boolean;
    }
  | {
      id: string;
      type: "text";
      title: string;
      description?: string;
      placeholder?: string;
      required?: boolean;
    };

// ✨ Draft questions — tweak freely
const QUESTIONS: Question[] = [
  {
    id: "life-area",
    type: "single",
    title: "Which area of life feels most important to improve right now?",
    options: ["Career", "Relationships", "Health", "Finances", "Self-growth"],
    required: true,
  },
  {
    id: "energy",
    type: "single",
    title: "How does your daily energy usually feel?",
    options: ["Drained", "Neutral", "Focused", "Inspired"],
    required: true,
  },
  {
    id: "habit",
    type: "single",
    title: "Which habit would help you the most this month?",
    options: [
      "Morning routine",
      "Deep work blocks",
      "Daily movement",
      "Journaling",
      "Better sleep",
    ],
    required: true,
  },
  {
    id: "blocker",
    type: "text",
    title: "What feels like the biggest blocker right now?",
    placeholder: "Write a short sentence…",
    required: false,
  },
  {
    id: "ideal-week",
    type: "text",
    title: "Describe your ideal week in one or two sentences.",
    placeholder: "What would it look & feel like?",
    required: false,
  },
];

export default function DiscoverPage() {
  // const router = useRouter();

  // answers keyed by question.id
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // summary UI state
  const [showSummary, setShowSummary] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState<string>("");

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  const progress = useMemo(
    () => Math.round(((step + 1) / total) * 100),
    [step, total]
  );

  function handleSelect(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setError("");
    track("question_answered", { id, value });
  }

  async function handleFinish() {
    try {
      setLoadingSummary(true);
      setShowSummary(true); // show the summary panel (will display loading state)

      // Build array of { question, value } for the API
      const payload = {
        answers: QUESTIONS.map((qq) => ({
          question: qq.title,
          value: answers[qq.id] || "",
        })),
      };

      // 👇 IMPORTANT: relative path in dev
      const res = await fetch("/api/clarity-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed (${res.status})`);
      }

      const json = await res.json();
      setSummaryText(json.summary || "Thanks! (No summary returned.)");
    } catch (e: any) {
      setSummaryText(
        `Sorry, something went wrong generating your summary.\n\n${e?.message || e}`
      );
    } finally {
      setLoadingSummary(false);
    }
  }

  function next() {
    // validation if required
    if (q.required && !answers[q.id]) {
      setError("Please answer before continuing.");
      return;
    }
    const nextIndex = step + 1;
    if (nextIndex < total) {
      setStep(nextIndex);
      track("question_step_next", { step: nextIndex + 1, id: QUESTIONS[nextIndex].id });
    } else {
      // finished -> call API route then show summary
      track("discovery_completed", { total_questions: total });
      handleFinish();
      // If you later want a separate page you could: router.push("/discover/summary")
    }
  }

  function back() {
    if (step === 0) return;
    const prev = step - 1;
    setStep(prev);
    setError("");
    track("question_step_back", { step: prev + 1, id: QUESTIONS[prev].id });
  }

  // --- summary screen ---
  if (showSummary) {
    return (
      <main className="min-h-screen bg-[#0E1116] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Your Clarity Snapshot
          </h1>
          <p className="mt-2 text-white/70">
            Thanks for sharing. Here’s a summary of your responses and next steps:
          </p>

          {/* Loading indicator or the AI summary */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 whitespace-pre-wrap">
            {loadingSummary ? "Generating your personalized summary…" : summaryText}
          </div>

          {/* Optional: also echo raw selections below */}
          <div className="mt-6 space-y-4">
            {QUESTIONS.map((qq) => (
              <div
                key={qq.id}
                className="rounded-xl border border-white/10 p-4 bg-white/5"
              >
                <div className="text-sm text-white/50">{qq.title}</div>
                <div className="mt-1 text-white">{answers[qq.id] || "—"}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              className="rounded-xl px-5 py-3 bg-white text-black font-medium hover:opacity-90 transition"
              onClick={() => {
                track("restart_discovery");
                setStep(0);
                setAnswers({});
                setShowSummary(false);
                setSummaryText("");
              }}
            >
              Restart
            </button>
            <button
              className="rounded-xl px-5 py-3 border border-white/30 text-white hover:bg-white/10 transition"
              onClick={() => {
                track("summary_continue_next");
                // next step could be: /signup or /recommendations
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- main wizard UI ---
  return (
    <main className="min-h-screen bg-[#0E1116] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>
              Step {step + 1} of {total}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {q.title}
          </h1>
          {q.description && (
            <p className="mt-2 text-white/70">{q.description}</p>
          )}

          <div className="mt-6 space-y-3">
            {q.type === "single" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {"options" in q &&
                  q.options.map((option) => {
                    const selected = answers[q.id] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelect(q.id, option)}
                        className={[
                          "rounded-xl px-4 py-3 text-left border transition",
                          selected
                            ? "bg-white text-black border-white"
                            : "border-white/20 hover:bg-white/10",
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
              </div>
            )}

            {q.type === "text" && (
              <textarea
                className="w-full rounded-xl bg-black/40 border border-white/20 p-4 outline-none focus:border-white/50 min-h-[120px]"
                placeholder={q.placeholder || "Type here…"}
                value={answers[q.id] || ""}
                onChange={(e) => handleSelect(q.id, e.target.value)}
              />
            )}
          </div>

          {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              className="rounded-xl px-5 py-3 border border-white/30 text-white hover:bg-white/10 transition disabled:opacity-40"
              onClick={back}
              disabled={step === 0}
            >
              Back
            </button>

            <button
              className="rounded-xl px-5 py-3 bg-white text-black font-medium hover:opacity-90 transition"
              onClick={next}
            >
              {step + 1 < total ? "Next" : "Finish"}
            </button>
          </div>
        </div>

        {/* Footer helper text */}
        <p className="mt-6 text-xs text-white/50">
          Your responses are used only to personalize your insights.
        </p>
      </div>
    </main>
  );
}
