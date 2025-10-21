// src/app/discover/page.tsx - BIGGER TEXT, NARROWER BOXES, QUOTES HIGHER
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { track } from "../../lib/gtag";
import { CORE_DISCOVERY_QUESTIONS } from "../../lib/discoveryQuestions";
import RoadmapDashboard from "../../components/RoadmapDashboard";
import DreamyFireflyAnimation from "../../components/DreamyFireflyAnimation";

const SESSION_STORAGE_KEY = "withinyouai_sessions";

// MOTIVATIONAL QUOTES
const MOTIVATIONAL_QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { quote: "Your limitation—it's only your imagination.", author: "Anonymous" },
  { quote: "Great things never come from comfort zones.", author: "Anonymous" },
  { quote: "Dream it. Wish it. Do it.", author: "Anonymous" },
  { quote: "Success doesn't just find you. You have to go out and get it.", author: "Anonymous" },
  { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
  { quote: "Dream bigger. Do bigger.", author: "Anonymous" },
  { quote: "Don't stop when you're tired. Stop when you're done.", author: "Anonymous" },
  { quote: "Wake up with determination. Go to bed with satisfaction.", author: "Anonymous" },
  { quote: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { quote: "Little things make big days.", author: "Anonymous" },
  { quote: "It's going to be hard, but hard does not mean impossible.", author: "Anonymous" },
  { quote: "Don't wait for opportunity. Create it.", author: "Anonymous" },
  { quote: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Anonymous" },
  { quote: "The key to success is to focus on goals, not obstacles.", author: "Anonymous" },
  { quote: "Dream it. Believe it. Build it.", author: "Anonymous" },
  { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { quote: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { quote: "Your life does not get better by chance, it gets better by change.", author: "Jim Rohn" },
];

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
  
  const [currentStep, setCurrentStep] = useState(1);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  
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
      setMessages([
        {
          role: "assistant",
          content: `Perfect! Let's dive deep into understanding YOU.\n\n**Question 1/${CORE_DISCOVERY_QUESTIONS.length}**: ${CORE_DISCOVERY_QUESTIONS[0].question}`
        }
      ]);
      track("discovery_started", { plan });
    }
  }, [messages.length, plan]);

  // Change quote randomly
  const changeQuote = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    const answer = currentAnswer.trim();
    setUserAnswers((prev) => [...prev, answer]);
    setCurrentAnswer("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: answer }]);

    // Change quote on each submission
    changeQuote();

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
          <div style={{
            background: "rgba(52, 211, 153, 0.08)",
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
            border: "1px solid rgba(52, 211, 153, 0.2)",
            borderRadius: "2.5rem",
            padding: "3rem 2rem",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}>
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#34d399" }}>
              You've Used Your Free Session
            </h2>
            <p className="text-white/70 text-lg mb-6">
              Upgrade to Premium to unlock unlimited discovery sessions, save your reports, and access your personalized dashboard.
            </p>
            <div className="space-y-3 mb-6">
              {["Unlimited transformation sessions", "Full interactive roadmaps", "PDF downloads & progress tracking"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80">
                  <span className="text-[#34d399]">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleUpgrade}
              style={{
                width: "100%",
                padding: "1.25rem",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#ffffff",
                background: "rgba(52, 211, 153, 0.15)",
                backdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(52, 211, 153, 0.3)",
                borderRadius: "1.5rem",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(52, 211, 153, 0.25)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(52, 211, 153, 0.15)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Upgrade to Premium - $14.99/mo
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="mt-4 text-white/60 hover:text-white/90 transition text-sm"
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

      {/* FIXED BACK BUTTON - TOP LEFT CORNER */}
      <div className="absolute top-6 left-6 z-20">
        <a 
          href="/" 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            background: "linear-gradient(135deg, #34d399 0%, #22c5c2 50%, #10b981 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          ← Back
        </a>
      </div>

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
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-12 pb-8 relative z-10">
        <div className="w-full max-w-4xl">
          
          {isComplete && finalReport ? (
            <div className="animate-fadeIn">
              <RoadmapDashboard 
                data={finalReport}
                isPremium={plan === "premium"}
                onUpgrade={handleUpgrade}
              />
            </div>

          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* CONVERSATION MESSAGES - NARROWER BOXES & BIGGER TEXT */}
              <div className="max-h-[55vh] overflow-y-auto space-y-6 px-2 scrollbar-hide">
                {messages.map((msg, idx) => (
                  <div key={idx} className="flex justify-center animate-fadeUp">
                    <div className="w-full max-w-2xl" style={{
                      background: "rgba(52, 211, 153, 0.06)",
                      backdropFilter: "blur(30px) saturate(180%)",
                      WebkitBackdropFilter: "blur(30px) saturate(180%)",
                      border: "1px solid rgba(52, 211, 153, 0.15)",
                      borderRadius: "2rem",
                      padding: "2.5rem 3rem",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                    }}>
                      <p className="text-3xl sm:text-4xl md:text-5xl text-white/95 leading-relaxed whitespace-pre-wrap font-light">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-center">
                    <div style={{
                      background: "rgba(52, 211, 153, 0.06)",
                      backdropFilter: "blur(30px) saturate(180%)",
                      border: "1px solid rgba(52, 211, 153, 0.15)",
                      borderRadius: "2rem",
                      padding: "1.5rem 2rem",
                    }}>
                      <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-3 h-3 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT BOX - NARROWER */}
              {!isComplete && currentStep > 0 && (
                <div className="flex justify-center pt-4">
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
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "2rem 11rem 2rem 2.5rem",
                        fontSize: "1.5rem",
                        lineHeight: "1.6",
                        color: "rgba(255, 255, 255, 0.95)",
                        background: isFocused 
                          ? "rgba(52, 211, 153, 0.08)" 
                          : "rgba(52, 211, 153, 0.05)",
                        backdropFilter: "blur(30px) saturate(180%)",
                        WebkitBackdropFilter: "blur(30px) saturate(180%)",
                        border: isFocused 
                          ? "1px solid rgba(52, 211, 153, 0.3)" 
                          : "1px solid rgba(52, 211, 153, 0.15)",
                        borderRadius: "1.75rem",
                        boxShadow: isFocused
                          ? "0 15px 50px rgba(52, 211, 153, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                          : "0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                        resize: "none",
                        outline: "none",
                        transition: "all 0.3s",
                      }}
                      className="placeholder:text-white/40"
                    />
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={isLoading || !currentAnswer.trim()}
                      style={{
                        position: "absolute",
                        right: "1rem",
                        bottom: "1rem",
                        padding: "1.25rem 3rem",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        background: "rgba(52, 211, 153, 0.15)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        border: "1px solid rgba(52, 211, 153, 0.3)",
                        borderRadius: "1.25rem",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        cursor: isLoading || !currentAnswer.trim() ? "not-allowed" : "pointer",
                        opacity: isLoading || !currentAnswer.trim() ? 0.4 : 1,
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading && currentAnswer.trim()) {
                          e.currentTarget.style.background = "rgba(52, 211, 153, 0.25)";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(52, 211, 153, 0.15)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOTIVATIONAL QUOTE AT BOTTOM - MOVED HIGHER */}
        {!isComplete && (
          <div className="w-full max-w-2xl mt-auto pt-4 pb-6">
            <div className="text-center animate-fadeIn">
              <p className="text-lg sm:text-xl text-white/60 italic leading-relaxed mb-2">
                "{currentQuote.quote}"
              </p>
              <p className="text-sm sm:text-base" style={{
                background: "linear-gradient(135deg, #34d399 0%, #22c5c2 50%, #10b981 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
              }}>
                — {currentQuote.author}
              </p>
            </div>
          </div>
        )}
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