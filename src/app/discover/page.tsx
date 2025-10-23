// app/discover/page.tsx - FIXED VERSION WITH INTERACTIVE REPORT
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CORE_DISCOVERY_QUESTIONS } from "../../lib/discoveryQuestions";
import DreamyFireflyAnimation from "../../components/DreamyFireflyAnimation";
import dynamic from 'next/dynamic';

// Dynamically import the interactive dashboard (client-side only)
const InteractiveDreamLifeDashboard = dynamic(
  () => import('../../components/InteractiveDreamLifeDashboard'),
  { ssr: false }
);

const SESSION_STORAGE_KEY = "withinyouai_sessions";

const MOTIVATIONAL_QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

const GREETING_MESSAGES = [
  {
    title: "✨ Welcome to Your Transformation Journey!",
    subtitle: "You're about to embark on a profound journey of self-discovery.",
    body: "The next 15 questions will help unlock the extraordinary potential that's already within you. Be honest, be yourself, and let's discover what truly makes you come alive.",
    cta: "Begin My Journey"
  },
];

// 🎯 MINIMAL AI RESPONSES
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
  const [greetingMessage] = useState(GREETING_MESSAGES[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check if user can start
  useEffect(() => {
    if (!canStartSession(plan) && !showGreeting) {
      setShowUpgradeModal(true);
    }
  }, [plan, showGreeting]);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBeginJourney = () => {
    if (!canStartSession(plan)) {
      setShowUpgradeModal(true);
      return;
    }
    setShowGreeting(false);
    // Ask first question
    const firstQuestion = CORE_DISCOVERY_QUESTIONS[0];
    setMessages([{
      role: "assistant",
      content: firstQuestion.question,
      isQuestion: true
    }]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmitAnswer = async () => {
    if (!currentInput.trim() || isLoading) return;

    const answer = currentInput.trim();
    setCurrentInput("");
    
    // Add user message
    const userMessage: Message = { role: "user", content: answer };
    setMessages(prev => [...prev, userMessage]);
    
    // Update answers
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    setCurrentStep(newAnswers.length);
    
    setIsLoading(true);

    setTimeout(async () => {
      // Add minimal acknowledgment
      const acknowledgment = QUICK_ACKNOWLEDGMENTS[Math.floor(Math.random() * QUICK_ACKNOWLEDGMENTS.length)];
      setMessages(prev => [...prev, { role: "assistant", content: acknowledgment }]);

      // If not done, ask next question
      if (newAnswers.length < CORE_DISCOVERY_QUESTIONS.length) {
        setTimeout(() => {
          const nextQuestion = CORE_DISCOVERY_QUESTIONS[newAnswers.length];
          setMessages(prev => [...prev, {
            role: "assistant",
            content: nextQuestion.question,
            isQuestion: true
          }]);
          setIsLoading(false);
          inputRef.current?.focus();
        }, 600);
      } else {
        // COMPLETED! Generate report
        incrementSessionCount();

        // Show loading message
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "✨ Analyzing your responses and crafting your personalized Dream Life roadmap... This will take about 30 seconds."
        }]);

        try {
          // Call API to generate report
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{
                role: 'user',
                content: `Based on these 15 discovery questions and answers, generate a comprehensive Dream Life roadmap. Return ONLY valid JSON (no markdown, no code blocks).

Questions and Answers:
${newAnswers.map((ans, idx) => `
Q${idx + 1}: ${CORE_DISCOVERY_QUESTIONS[idx].question}
A${idx + 1}: ${ans}
`).join('\n')}

Generate a JSON object with this EXACT structure:
{
  "profile": {
    "name": "Your Dream Life",
    "tagline": "A personalized journey to fulfillment",
    "score": 94,
    "level": "Visionary"
  },
  "dreamCareer": {
    "title": "[specific career title based on answers]",
    "ikigai": {
      "passion": "[what they love doing]",
      "mission": "[what the world needs from them]",
      "vocation": "[what they're good at]",
      "profession": "[what they can be paid for]"
    },
    "hollandCode": "[personality type]",
    "flowPotential": "[High/Exceptional with %]",
    "environment": "[ideal work environment]",
    "lifestyle": "[desired lifestyle]",
    "financialGoal": "[income goal]",
    "reasons": [
      "[reason 1]",
      "[reason 2]",
      "[reason 3]",
      "[reason 4]"
    ]
  },
  "books": [
    {
      "title": "[book title]",
      "author": "[author]",
      "reason": "[why this book]",
      "impact": "[expected impact]",
      "readingTime": "[hours]"
    }
  ],
  "actionPlan": [
    {
      "week": 1,
      "theme": "[week theme]",
      "tasks": ["[task 1]", "[task 2]", "[task 3]"],
      "milestone": "[week milestone]"
    }
  ],
  "mindsetShifts": [
    {
      "from": "[limiting belief]",
      "to": "[empowering belief]",
      "why": "[reason]",
      "technique": "[how to practice]"
    }
  ],
  "courses": [
    {
      "title": "[course title]",
      "platform": "[platform]",
      "duration": "[duration]",
      "cost": "[cost]",
      "roi": "[value proposition]"
    }
  ],
  "obstacles": [
    {
      "obstacle": "[challenge]",
      "solution": "[practical solution]",
      "resources": ["[resource 1]", "[resource 2]"]
    }
  ],
  "metrics": {
    "ikigaiAlignment": 94,
    "careerFit": 88,
    "workLifeBalance": 91,
    "growthPotential": 96,
    "financialViability": 85
  }
}

CRITICAL: Return ONLY the JSON object. No explanations, no markdown, no code blocks.`
              }],
              systemPrompt: `You are an expert career counselor and life coach. Generate personalized, actionable, research-backed guidance. Return ONLY valid JSON.`,
              model: 'gpt-4o',
              temperature: 0.8,
              maxTokens: 4000,
            }),
          });

          if (!response.ok) {
            throw new Error('API request failed');
          }

          const data = await response.json();
          console.log('API Response:', data);

          // Parse the response
          let reportData;
          if (data.message) {
            // Clean the response (remove markdown code blocks if present)
            let cleanedMessage = data.message.trim();
            cleanedMessage = cleanedMessage.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            
            try {
              reportData = JSON.parse(cleanedMessage);
            } catch (parseError) {
              console.error('JSON Parse Error:', parseError);
              throw new Error('Failed to parse AI response');
            }
          } else {
            throw new Error('No message in API response');
          }

          // Set the report and mark as complete
          setFinalReport(reportData);
          setIsComplete(true);
          
        } catch (error) {
          console.error('Error generating report:', error);
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: "I apologize, but there was an error generating your roadmap. Please refresh and try again, or contact support if the issue persists." 
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

  // 🎯 If completed, show interactive dashboard
  if (isComplete && finalReport) {
    return <InteractiveDreamLifeDashboard reportData={finalReport} plan={plan} />;
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
            You've already used your free discovery session. Upgrade to Premium for unlimited access!
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
            }}
          >
            Upgrade to Premium
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
      position: "relative",
      overflow: "hidden",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <DreamyFireflyAnimation />

      {/* 📊 LEFT PROGRESS RING */}
      {!showGreeting && (
        <div style={{
          position: "fixed",
          left: "2rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}>
          {/* Circular Progress */}
          <div style={{ position: "relative", width: "120px", height: "120px" }}>
            <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - currentStep / CORE_DISCOVERY_QUESTIONS.length)}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: "drop-shadow(0 0 10px rgba(20, 184, 166, 0.6))",
                }}
              />
            </svg>
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "white",
              }}>
                {currentStep}
              </div>
              <div style={{
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.6)",
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
            >
              {greetingMessage.cta}
            </button>
          </div>
        </div>
      )}

      {/* 💬 CHAT INTERFACE */}
      {!showGreeting && (
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 10,
          marginLeft: "180px",
        }}>
          {/* Fixed Header */}
          <div style={{
            padding: "2rem",
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}>
            <h1 style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "0.5rem",
            }}>
              Discovery Session
            </h1>
            <p style={{
              fontSize: "1rem",
              color: "#14b8a6",
              animation: "fadeIn 1s ease-in-out infinite",
            }}>
              {MOTIVATIONAL_QUOTES[currentQuote].quote}
              <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.875rem" }}>
                {" "}— {MOTIVATIONAL_QUOTES[currentQuote].author}
              </span>
            </p>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  animation: "fadeIn 0.4s ease-out",
                }}
              >
                <div style={{
                  maxWidth: "70%",
                  padding: "1.25rem 1.5rem",
                  borderRadius: "1.25rem",
                  background: msg.role === "user" 
                    ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "1.125rem",
                  lineHeight: "1.7",
                  boxShadow: msg.role === "user" 
                    ? "0 0 20px rgba(20, 184, 166, 0.3)"
                    : "none",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{
                display: "flex",
                justifyContent: "flex-start",
              }}>
                <div style={{
                  padding: "1rem 1.5rem",
                  borderRadius: "1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  gap: "0.5rem",
                }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#14b8a6",
                    animation: "bounce 1.4s ease-in-out infinite",
                  }} />
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#14b8a6",
                    animation: "bounce 1.4s ease-in-out 0.2s infinite",
                  }} />
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#14b8a6",
                    animation: "bounce 1.4s ease-in-out 0.4s infinite",
                  }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: "2rem",
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            position: "sticky",
            bottom: 0,
          }}>
            <div style={{
              display: "flex",
              gap: "1rem",
              maxWidth: "90rem",
              margin: "0 auto",
            }}>
              <textarea
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer here... (Press Enter to send)"
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "1.25rem",
                  borderRadius: "1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(20, 184, 166, 0.3)",
                  color: "white",
                  fontSize: "1.125rem",
                  resize: "none",
                  minHeight: "120px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentInput.trim() || isLoading}
                style={{
                  padding: "1.25rem 2rem",
                  borderRadius: "1rem",
                  background: currentInput.trim() 
                    ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
                    : "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontWeight: "600",
                  border: "none",
                  cursor: currentInput.trim() ? "pointer" : "not-allowed",
                  boxShadow: currentInput.trim() ? "0 0 20px rgba(20, 184, 166, 0.4)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
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