// src/app/discover/page.tsx - COMPLETE WITH BUTTON FIXED
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { track } from "../../lib/gtag";
import { CORE_DISCOVERY_QUESTIONS } from "../../lib/discoveryQuestions";
import RoadmapDashboard from "../../components/RoadmapDashboard";
import DreamyFireflyAnimation from "../../components/DreamyFireflyAnimation";

// Session storage helpers
const SESSION_STORAGE_KEY = "withinyouai_sessions";

function getSessionCount(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!stored) return 0;
  try {
    const data = JSON.parse(stored);
    return data.count || 0;
  } catch {
    return 0;
  }
}

function incrementSessionCount() {
  if (typeof window === "undefined") return;
  const current = getSessionCount();
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
    count: current + 1,
    lastSession: new Date().toISOString()
  }));
}

function canStartSession(plan: string): boolean {
  if (plan === "premium") return true;
  return getSessionCount() < 1;
}

type Message = { role: "user" | "assistant"; content: string };

function DiscoverPageContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";
  
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!canStartSession(plan)) {
      setShowUpgradeModal(true);
    }
  }, [plan]);

  useEffect(() => {
    if (messages.length === 0 && canStartSession(plan)) {
      setMessages([{
        role: "assistant",
        content: `Welcome to your transformation journey! 🌟\n\nI'm here to help you discover your true calling through a personalized conversation based on proven psychology frameworks like Ikigai, 7 Habits, and Self-Determination Theory.\n\nAre you ready to begin?`,
      }]);
    }
  }, [messages.length, plan]);

  const handleStartDiscovery = () => {
    if (!canStartSession(plan)) {
      setShowUpgradeModal(true);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", content: "Yes, I'm ready!" },
      { 
        role: "assistant", 
        content: `Perfect! Let's dive deep into understanding YOU.\n\nThis discovery process is built on research from:\n- Ikigai (Japanese longevity research)\n- 7 Habits of Highly Effective People\n- Flow State psychology\n- Self-Determination Theory\n\n**Question 1/${CORE_DISCOVERY_QUESTIONS.length}**: ${CORE_DISCOVERY_QUESTIONS[0].question}` 
      },
    ]);
    setCurrentStep(1);
    track("discovery_started", { plan });
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    const answer = currentAnswer.trim();
    setUserAnswers((prev) => [...prev, answer]);
    setCurrentAnswer("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: answer }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ 
            role: "user", 
            content: `User answered: "${answer}". Give a warm, brief acknowledgment (1-2 sentences) that shows you understand.` 
          }],
          systemPrompt: "You are an empathetic life coach. Acknowledge warmly and authentically.",
          model: "gpt-4o",
          temperature: 0.7,
          maxTokens: 100
        }),
      });

      const data = await response.json();
      const aiAck = data.message;

      if (currentStep < CORE_DISCOVERY_QUESTIONS.length) {
        const nextQ = CORE_DISCOVERY_QUESTIONS[currentStep];
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: `${aiAck}\n\n**Question ${currentStep + 1}/${CORE_DISCOVERY_QUESTIONS.length}**: ${nextQ.question}`,
        }]);
        setCurrentStep(currentStep + 1);
        track("question_answered", { step: currentStep, plan });
      } else {
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: `${aiAck}\n\n✨ Amazing! Now analyzing your responses to create your personalized transformation roadmap...` 
        }]);
        await generateFinalReport();
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "I'm having trouble connecting. Please try again?" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFinalReport = async () => {
    setIsLoading(true);
    try {
      incrementSessionCount();

      const userProfile = CORE_DISCOVERY_QUESTIONS.map((q, idx) => 
        `${q.category} (${q.question}):\n${userAnswers[idx]}\n`
      ).join("\n");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ 
            role: "user", 
            content: `You are an expert career coach and psychologist. Analyze this person's responses and create a comprehensive transformation roadmap.

USER PROFILE:
${userProfile}

Create a detailed JSON response with this EXACT structure:
{
  "dreamCareer": {
    "title": "Specific job title",
    "reasons": ["3 personalized reasons why this fits them"],
    "pathway": ["5 specific steps to get there"],
    "timeline": "Realistic timeframe",
    "salary": "Expected salary range"
  },
  "books": [
    {
      "title": "Book title",
      "author": "Author name",
      "rating": 4.8,
      "reason": "Why THIS person needs THIS book (personalized)",
      "amazonLink": "https://amazon.com/..."
    }
  ],
  "courses": [
    {
      "title": "Course title",
      "provider": "Platform name",
      "reason": "Why perfect for them",
      "link": "https://..."
    }
  ],
  "actionPlan": {
    "week1": ["3-4 specific actionable tasks"],
    "week2": ["3-4 specific actionable tasks"],
    "week3": ["3-4 specific actionable tasks"],
    "week4": ["3-4 specific actionable tasks"]
  },
  "mindsetShifts": ["5 specific mindset shifts they need, based on their responses"],
  "obstacles": [
    {"obstacle": "Specific obstacle from their answers", "solution": "Actionable solution"}
  ]
}

Be SPECIFIC and PERSONALIZED. Reference their actual answers. No generic advice. Provide 3 books and 3 courses.` 
          }],
          systemPrompt: "You are an expert transformation coach with deep knowledge of Ikigai, positive psychology, and career development. Provide evidence-based, personalized recommendations.",
          model: "gpt-4o",
          temperature: 0.7,
          maxTokens: 3000
        }),
      });

      const data = await response.json();
      
      let reportData;
      try {
        const jsonMatch = data.message.match(/```json\n([\s\S]*?)\n```/) || 
                         data.message.match(/```\n([\s\S]*?)\n```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : data.message;
        reportData = JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON, using fallback");
        reportData = {
          dreamCareer: {
            title: "Your Personalized Career Path",
            reasons: ["Based on your responses, we're analyzing your strengths", "Your unique combination of skills is valuable", "You have strong potential for growth"],
            pathway: ["Continue exploring your interests", "Develop key skills", "Network with professionals", "Gain relevant experience", "Apply strategically"],
            timeline: "12-18 months"
          },
          books: [
            {title: "Deep Work", author: "Cal Newport", rating: 4.8, reason: "Develop focus and productivity"},
            {title: "Atomic Habits", author: "James Clear", rating: 4.9, reason: "Build transformative habits"},
            {title: "The 7 Habits", author: "Stephen Covey", rating: 4.7, reason: "Master effectiveness principles"}
          ],
          courses: [
            {title: "Career Development Fundamentals", provider: "Coursera", reason: "Build foundation skills"},
            {title: "Personal Branding", provider: "LinkedIn Learning", reason: "Stand out professionally"},
            {title: "Goal Achievement Mastery", provider: "Udemy", reason: "Execute your vision"}
          ],
          actionPlan: { 
            week1: ["Research your target career", "Update your LinkedIn profile", "Connect with 3 people in your field"], 
            week2: ["Start learning key skill", "Draft career transition plan", "Join relevant online community"],
            week3: ["Apply to 5 opportunities", "Schedule informational interviews", "Update resume"],
            week4: ["Follow up on applications", "Continue skill development", "Reflect and adjust plan"]
          },
          mindsetShifts: [
            "From fixed to growth mindset",
            "From perfection to progress",
            "From fear to curiosity",
            "From comparison to collaboration",
            "From waiting to creating"
          ],
          obstacles: [{obstacle: "Fear of change", solution: "Take small daily actions"}]
        };
      }

      setFinalReport(reportData);
      setIsComplete(true);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "🎉 Your transformation roadmap is ready! Scroll down to explore your personalized journey." 
      }]);
      track("discovery_completed", { plan });
    } catch (error) {
      console.error("Report generation error:", error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "I had trouble generating your report. Please try refreshing the page." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    track("upgrade_clicked", { source: "discover_page" });
    window.location.href = "https://buy.stripe.com/test_your_stripe_link";
  };

  if (showUpgradeModal && !canStartSession(plan)) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0" style={{ 
          zIndex: 0,
          background: "linear-gradient(135deg, #050f0f 0%, #071515 25%, #060f10 50%, #040c0c 75%, #050f0f 100%)",
        }} />
        <DreamyFireflyAnimation />
        
        <div className="relative z-10 max-w-md mx-auto px-6 text-center">
          <div className="visionos-card-large rounded-[40px] p-8 space-y-6">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold" style={{ color: "#34d399" }}>
              You've Used Your Free Session
            </h2>
            <p className="text-white/70 text-lg">
              Upgrade to Premium to unlock unlimited discovery sessions, save your reports, and access your personalized dashboard.
            </p>
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3 text-white/80">
                <span className="text-[#34d399]">✓</span>
                <span>Unlimited transformation sessions</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <span className="text-[#34d399]">✓</span>
                <span>Full interactive roadmaps</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <span className="text-[#34d399]">✓</span>
                <span>PDF downloads & progress tracking</span>
              </div>
            </div>
            <button
              onClick={handleUpgrade}
              className="w-full visionos-button px-8 py-4 rounded-[24px] font-semibold text-lg"
            >
              Upgrade to Premium - $14.99/mo
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="text-white/60 hover:text-white/90 transition text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0" style={{ 
        zIndex: 0,
        background: "linear-gradient(135deg, #050f0f 0%, #071515 25%, #060f10 50%, #040c0c 75%, #050f0f 100%)",
      }} />
      
      <DreamyFireflyAnimation />

      <header className="relative z-10 pt-6 sm:pt-8 pb-4">
        <div className="flex flex-col items-center gap-3">
          <Image 
            src="/logo-wings.png" 
            alt="WithinYouAi" 
            width={70} 
            height={70} 
            priority 
            className="select-none animate-float"
            style={{ filter: "drop-shadow(0 0 20px rgba(52, 211, 153, 0.6))" }} 
          />
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[0.15em]"
            style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, #34d399 0%, #22c5c2 30%, #34d399 60%, #10b981 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            WITHINYOUAI
          </h1>
        </div>

        <div className="absolute top-6 sm:top-8 right-4 sm:right-6">
          <a href="/" className="text-xs sm:text-sm text-white/50 hover:text-white/90 transition font-medium">
            ← Back
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8 relative z-10">
        <div className="w-full max-w-5xl">
          
          {currentStep === 0 && !isComplete ? (
            <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-fadeIn">
              
              {/* BUTTON FIRST - MOVED UP 100PX */}
              <div className="mb-4">
                <button
                  onClick={handleStartDiscovery}
                  style={{
                    position: "relative",
                    transform: "translateY(-100px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.25rem 2.5rem",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    background: "rgba(52, 211, 153, 0.15)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: "1px solid rgba(52, 211, 153, 0.3)",
                    borderRadius: "1.2rem",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    maxWidth: "380px",
                  }}
                  className="lg:text-xl lg:py-6 lg:px-14"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-102px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 12px 48px rgba(52, 211, 153, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.background = "rgba(52, 211, 153, 0.25)";
                    e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(-100px) scale(1)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.background = "rgba(52, 211, 153, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.3)";
                  }}
                >
                  Start My Journey ✨
                </button>
              </div>

              {/* THEN "Science-Backed Discovery" */}
              <p className="text-xl sm:text-2xl md:text-3xl text-white/70 font-light tracking-[0.2em] uppercase">
                Science-Backed Discovery
              </p>

              {/* THEN Welcome Messages */}
              <div className="space-y-5 sm:space-y-6 max-w-3xl px-4 py-4 sm:py-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className="animate-fadeUp" style={{ animationDelay: `${idx * 100}ms` }}>
                    <p className="text-xl sm:text-2xl md:text-3xl text-white/95 leading-relaxed whitespace-pre-wrap font-light">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          ) : isComplete && finalReport ? (
            <div className="animate-fadeIn">
              <RoadmapDashboard 
                data={finalReport}
                isPremium={plan === "premium"}
                onUpgrade={handleUpgrade}
              />
            </div>

          ) : (
            <div className="space-y-5 sm:space-y-6">
              <div className="max-h-[60vh] overflow-y-auto space-y-4 sm:space-y-5 px-2 scrollbar-hide">
                {messages.slice(1).map((msg, idx) => (
                  <div key={idx} className="flex justify-center animate-fadeUp">
                    <div className="visionos-card w-full max-w-2xl rounded-[32px] px-5 sm:px-7 py-4 sm:py-6">
                      <p className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed whitespace-pre-wrap text-left">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-center">
                    <div className="visionos-card rounded-[32px] px-6 py-5">
                      <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {!isComplete && currentStep > 0 && (
                <div className="flex justify-center pt-4 sm:pt-6">
                  <div className="w-full max-w-2xl relative">
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitAnswer();
                        }
                      }}
                      placeholder="Share your thoughts..."
                      disabled={isLoading}
                      rows={3}
                      className={`visionos-input w-full px-5 sm:px-7 py-4 sm:py-5 pr-24 sm:pr-28 rounded-[28px] resize-none focus:outline-none text-sm sm:text-base md:text-lg transition-all ${isFocused ? 'visionos-input-focused' : ''}`}
                    />
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={isLoading || !currentAnswer.trim()}
                      className="visionos-send-button absolute right-3 sm:right-4 bottom-3 sm:bottom-4 px-6 sm:px-8 py-2 sm:py-3 rounded-[20px] font-semibold text-xs sm:text-sm transition-all disabled:opacity-40"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-fadeUp { animation: fadeUp 0.6s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiscoverPageContent />
    </Suspense>
  );
}