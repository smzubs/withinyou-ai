// src/app/discover/page.tsx - WOW FACTOR VERSION! 🔥
// ✨ Wider container, left-side progress, minimal AI responses, enhanced aesthetics
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { track } from "../../lib/gtag";
import { CORE_DISCOVERY_QUESTIONS } from "../../lib/discoveryQuestions";
import RoadmapDashboard from "../../components/RoadmapDashboard";
import DreamyFireflyAnimation from "../../components/DreamyFireflyAnimation";

const SESSION_STORAGE_KEY = "withinyouai_sessions";

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
];

const GREETING_MESSAGES = [
  {
    title: "✨ Welcome to Your Transformation Journey!",
    subtitle: "You're about to embark on a profound journey of self-discovery.",
    body: "The next 15 questions will help unlock the extraordinary potential that's already within you. Be honest, be yourself, and let's discover what truly makes you come alive.",
    cta: "Begin My Journey"
  },
  {
    title: "🌟 Amazing! You've Taken the First Step",
    subtitle: "Get ready to discover your true calling and purpose.",
    body: "This isn't just another questionnaire. These AI-powered questions are designed to reveal insights about yourself you may have never realized. Your dream life is closer than you think.",
    cta: "Let's Start"
  },
  {
    title: "🚀 Your Future Self Will Thank You",
    subtitle: "Welcome to a personalized journey toward clarity and purpose.",
    body: "Over the next few minutes, we'll explore what drives you, what excites you, and what path will lead you to true fulfillment. Answer honestly, and watch the magic unfold.",
    cta: "I'm Ready!"
  },
];

// 🎯 MINIMAL AI RESPONSES - Just acknowledge and move on!
const QUICK_ACKNOWLEDGMENTS = [
  "Got it! ✓",
  "Received ✓",
  "Perfect! ✓",
  "Noted ✓",
  "Understood ✓",
  "Excellent ✓",
  "Great ✓",
  "Thank you ✓",
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

type Message = { 
  role: "user" | "assistant"; 
  content: string;
  isQuestion?: boolean;
};

function DiscoverPageContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";
  
  const [showGreeting, setShowGreeting] = useState(true);
  const [greetingMessage] = useState(GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)]);
  const [currentStep, setCurrentStep] = useState(0);
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 🎯 Check session limit
  useEffect(() => {
    if (!canStartSession(plan)) {
      setShowUpgradeModal(true);
    }
  }, [plan]);

  // 🔄 Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 📜 Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🎯 Auto-focus
  useEffect(() => {
    if (!isLoading && !showGreeting && !isComplete) {
      inputRef.current?.focus();
    }
  }, [isLoading, showGreeting, isComplete, currentStep]);

  const handleBeginJourney = () => {
    setShowGreeting(false);
    track("begin_discovery", { plan });
    setTimeout(() => {
      setMessages([
        { 
          role: "assistant", 
          content: CORE_DISCOVERY_QUESTIONS[0].question,
          isQuestion: true 
        }
      ]);
    }, 300);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    const userMessage = currentAnswer.trim();
    setCurrentAnswer("");
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    // Save answer
    const newAnswers = [...userAnswers, userMessage];
    setUserAnswers(newAnswers);

    // 🎯 MINIMAL RESPONSE - Just acknowledge quickly!
    const quickAck = QUICK_ACKNOWLEDGMENTS[Math.floor(Math.random() * QUICK_ACKNOWLEDGMENTS.length)];
    
    // Show quick acknowledgment
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: quickAck 
      }]);
    }, 400);

    // Move to next question or finish
    setTimeout(async () => {
      const nextStep = currentStep + 1;
      
      if (nextStep < CORE_DISCOVERY_QUESTIONS.length) {
        // Next question
        setCurrentStep(nextStep);
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: CORE_DISCOVERY_QUESTIONS[nextStep].question,
          isQuestion: true 
        }]);
        setIsLoading(false);
      } else {
        // All done - generate final report
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "Perfect! Generating your personalized Dream Life roadmap... ✨" 
        }]);

        track("complete_discovery", { plan, questionCount: CORE_DISCOVERY_QUESTIONS.length });
        incrementSessionCount();

        // Generate final report
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: newAnswers.map((answer, idx) => ({
                role: 'user',
                content: `${CORE_DISCOVERY_QUESTIONS[idx].question}\n\nAnswer: ${answer}`
              })),
              systemPrompt: `You are an expert life coach and career counselor. Generate a comprehensive Dream Life roadmap based on the user's answers. Include: Dream Career Title, Ikigai Analysis, Holland Code, Flow Potential, Books, Action Plan, Mindset Shifts, Courses, and Obstacles. Format as JSON.`,
              model: 'gpt-4o',
              temperature: 0.7,
              maxTokens: 3000,
            }),
          });

          const data = await response.json();
          setFinalReport(data);
          setIsComplete(true);
        } catch (error) {
          console.error('Error generating report:', error);
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: "I apologize, but there was an error generating your roadmap. Please try again." 
          }]);
        }
        
        setIsLoading(false);
      }
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  // 🎯 If completed, show roadmap
  if (isComplete && finalReport) {
    return <RoadmapDashboard report={finalReport} plan={plan} />;
  }

  // 🚫 Upgrade modal
  if (showUpgradeModal) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <DreamyFireflyAnimation />
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "1.5rem",
          padding: "3rem",
          maxWidth: "28rem",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔒</div>
          <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", marginBottom: "1rem" }}>
            Session Limit Reached
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "2rem", lineHeight: "1.6" }}>
            You've already used your free discovery session. Upgrade to Premium for unlimited access and your complete transformation roadmap!
          </p>
          <a
            href="/?upgrade=true"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "0.75rem",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 0 20px rgba(20, 184, 166, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(20, 184, 166, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(20, 184, 166, 0.4)";
            }}
          >
            Upgrade to Premium - $14.99/mo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      <DreamyFireflyAnimation />

      {/* 🎯 LEFT-SIDE ANIMATED PROGRESS INDICATOR */}
      {!showGreeting && (
        <div style={{
          position: "fixed",
          left: "2rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}>
          {/* Circular Progress Ring */}
          <div style={{ position: "relative", width: "120px", height: "120px" }}>
            {/* Background circle */}
            <svg
              width="120"
              height="120"
              style={{
                transform: "rotate(-90deg)",
                filter: "drop-shadow(0 0 10px rgba(20, 184, 166, 0.3))",
              }}
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - currentStep / CORE_DISCOVERY_QUESTIONS.length)}`}
                style={{
                  transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: "drop-shadow(0 0 8px rgba(20, 184, 166, 0.8))",
                }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center text */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#14b8a6",
                lineHeight: 1,
                textShadow: "0 0 20px rgba(20, 184, 166, 0.6)",
                transition: "all 0.3s ease",
              }}>
                {currentStep}
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.6)",
                marginTop: "0.25rem",
              }}>
                of {CORE_DISCOVERY_QUESTIONS.length}
              </div>
            </div>
          </div>

          {/* Percentage */}
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "1rem",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#14b8a6",
            boxShadow: "0 0 20px rgba(20, 184, 166, 0.2)",
          }}>
            {Math.round((currentStep / CORE_DISCOVERY_QUESTIONS.length) * 100)}%
          </div>
        </div>
      )}

      {/* 🎉 GREETING SCREEN */}
      {showGreeting && (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          position: "relative",
          zIndex: 10,
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "2rem",
            padding: "3rem",
            maxWidth: "48rem",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            animation: "fadeIn 0.6s ease-out",
          }}>
            <div style={{
              fontSize: "5rem",
              marginBottom: "1.5rem",
              animation: "sparkle 2s ease-in-out infinite",
            }}>
              ✨
            </div>
            
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "1rem",
              lineHeight: "1.2",
            }}>
              {greetingMessage.title}
            </h1>
            
            <p style={{
              fontSize: "1.25rem",
              color: "#14b8a6",
              marginBottom: "1.5rem",
              fontWeight: "500",
            }}>
              {greetingMessage.subtitle}
            </p>
            
            <p style={{
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "2.5rem",
              lineHeight: "1.8",
              fontSize: "1.125rem",
            }}>
              {greetingMessage.body}
            </p>
            
            <button
              onClick={handleBeginJourney}
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                color: "white",
                padding: "1.25rem 3rem",
                borderRadius: "1rem",
                fontWeight: "600",
                fontSize: "1.125rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(20, 184, 166, 0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(20, 184, 166, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(20, 184, 166, 0.4)";
              }}
            >
              {greetingMessage.cta} →
            </button>
          </div>
        </div>
      )}

      {/* 💬 MAIN CHAT INTERFACE */}
      {!showGreeting && (
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 10,
          maxWidth: "90rem", // 🎯 WIDER! (was 64rem)
          width: "100%",
          margin: "0 auto",
          padding: "0 2rem",
        }}>
          {/* Header */}
          <div style={{
            padding: "1.5rem 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            background: "transparent",
          }}>
            <div style={{
              fontSize: "3rem",
              animation: "sparkle 2s ease-in-out infinite",
            }}>
              ✨
            </div>
            <h1 style={{
              fontSize: "2rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              WithinYouAI
            </h1>
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            minHeight: 0,
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  animation: "fadeInUp 0.4s ease-out",
                }}
              >
                <div style={{
                  background: msg.role === "user" 
                    ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                  backdropFilter: msg.role === "assistant" ? "blur(10px)" : "none",
                  border: msg.role === "assistant" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                  color: "white",
                  padding: "1.25rem 1.75rem",
                  borderRadius: msg.role === "user" ? "1.5rem 1.5rem 0.25rem 1.5rem" : "1.5rem 1.5rem 1.5rem 0.25rem",
                  maxWidth: "70%",
                  boxShadow: msg.role === "user" 
                    ? "0 0 20px rgba(20, 184, 166, 0.3)"
                    : "0 8px 32px rgba(0, 0, 0, 0.2)",
                  fontSize: "1.125rem",
                  lineHeight: "1.7",
                  fontWeight: msg.isQuestion ? "500" : "400",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <div style={{
                display: "flex",
                justifyContent: "flex-start",
                animation: "fadeInUp 0.4s ease-out",
              }}>
                <div style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "1.25rem 1.75rem",
                  borderRadius: "1.5rem 1.5rem 1.5rem 0.25rem",
                  display: "flex",
                  gap: "0.5rem",
                }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#14b8a6",
                        animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                        boxShadow: "0 0 10px rgba(20, 184, 166, 0.6)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: "1.5rem 0",
            background: "transparent",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: isFocused ? "2px solid #14b8a6" : "2px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1.5rem",
              padding: "1rem 1.5rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              transition: "all 0.3s ease",
              boxShadow: isFocused ? "0 0 30px rgba(20, 184, 166, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}>
              <textarea
                ref={inputRef}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Type your answer here..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: "1.125rem",
                  resize: "none",
                  minHeight: "2.5rem",
                  maxHeight: "10rem",
                  fontFamily: "inherit",
                  lineHeight: "1.6",
                }}
                rows={1}
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isLoading}
                style={{
                  background: currentAnswer.trim() && !isLoading 
                    ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
                    : "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  padding: "0.875rem 2rem",
                  borderRadius: "1rem",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: currentAnswer.trim() && !isLoading ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  boxShadow: currentAnswer.trim() && !isLoading 
                    ? "0 0 20px rgba(20, 184, 166, 0.4)"
                    : "none",
                  opacity: currentAnswer.trim() && !isLoading ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (currentAnswer.trim() && !isLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(20, 184, 166, 0.6)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = currentAnswer.trim() && !isLoading 
                    ? "0 0 20px rgba(20, 184, 166, 0.4)"
                    : "none";
                }}
              >
                Send →
              </button>
            </div>
          </div>

          {/* Quote */}
          <div style={{
            padding: "1rem 0",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.875rem",
            background: "transparent",
            transition: "opacity 0.5s ease",
          }}>
            <p style={{ fontStyle: "italic", marginBottom: "0.25rem" }}>
              "{currentQuote.quote}"
            </p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)" }}>
              — {currentQuote.author}
            </p>
          </div>
        </div>
      )}

      {/* 🎨 ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.1); }
          75% { transform: rotate(10deg) scale(1.1); }
        }
        
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "1.25rem",
      }}>
        Loading...
      </div>
    }>
      <DiscoverPageContent />
    </Suspense>
  );
}