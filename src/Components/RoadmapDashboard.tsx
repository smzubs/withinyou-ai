// src/components/RoadmapDashboard.tsx
"use client";

import { useState } from 'react';

interface RoadmapData {
  dreamCareer: {
    title: string;
    reasons: string[];
    pathway: string[];
    timeline: string;
    salary?: string;
  };
  books: Array<{
    title: string;
    author: string;
    rating: number;
    reason: string;
    amazonLink?: string;
  }>;
  courses: Array<{
    title: string;
    provider: string;
    reason: string;
    link?: string;
  }>;
  actionPlan: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
  mindsetShifts: string[];
  obstacles: Array<{
    obstacle: string;
    solution: string;
  }>;
}

interface RoadmapDashboardProps {
  data: RoadmapData;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export default function RoadmapDashboard({ data, isPremium, onUpgrade }: RoadmapDashboardProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    career: true,
    books: true,
    courses: true,
    plan: true,
    mindset: false,
    obstacles: false
  });

  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const flipCard = (index: number) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleTask = (taskId: string) => {
    if (isPremium) {
      setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    }
  };

  const BlurOverlay = ({ children, section }: { children: React.ReactNode; section: string }) => (
    <div className="relative">
      <div className={isPremium ? '' : 'blur-sm pointer-events-none select-none'}>
        {children}
      </div>
      {!isPremium && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <button
            onClick={onUpgrade}
            className="px-8 py-4 rounded-2xl font-semibold text-white transition-all transform hover:scale-105"
            style={{
              background: 'rgba(232, 180, 192, 0.25)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(232, 180, 192, 0.4)',
              boxShadow: '0 8px 32px rgba(232, 180, 192, 0.3)'
            }}
          >
            🔓 Unlock with Premium
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-6">
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold" style={{ 
          background: 'linear-gradient(135deg, #e8b4c0 0%, #f5d5dc 50%, #e8b4c0 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎯 Your Transformation Roadmap
        </h1>
        <p className="text-white/60 text-lg">
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        {!isPremium && (
          <div className="inline-block px-6 py-3 rounded-full text-sm font-semibold" style={{
            background: 'rgba(255, 193, 7, 0.15)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            color: '#ffc107'
          }}>
            ⚠️ FREE PREVIEW - You're seeing 40% of your roadmap
          </div>
        )}
      </div>

      <div className="rounded-3xl p-8 text-center" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <h2 className="text-2xl font-semibold mb-4 text-white/90">📊 Your Ikigai</h2>
        <div className="w-full h-64 flex items-center justify-center text-white/50">
          [Interactive Ikigai Venn Diagram - Coming Soon]
        </div>
      </div>

      <div className="rounded-3xl p-6 md:p-8 space-y-4" style={{
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(50px)'
      }}>
        <button 
          onClick={() => toggleSection('career')}
          className="w-full flex items-center justify-between text-left group"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white/95 group-hover:text-[#e8b4c0] transition">
            🎯 Your Dream Career: {data.dreamCareer.title}
          </h2>
          <span className="text-2xl text-white/50 group-hover:text-white/90 transition">
            {expandedSections.career ? '−' : '+'}
          </span>
        </button>
        
        {expandedSections.career && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-semibold text-[#e8b4c0] mb-2">Why This Fits You:</h3>
              <ul className="space-y-2">
                {data.dreamCareer.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-white/80">
                    <span className="text-[#e8b4c0] mt-1">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#e8b4c0] mb-2">Path to Get There:</h3>
              <ol className="space-y-2">
                {data.dreamCareer.pathway.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-white/80">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e8b4c0]/20 flex items-center justify-center text-[#e8b4c0] text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-white/60">⏱️ Timeline:</span>
                <span className="font-semibold text-white/90">{data.dreamCareer.timeline}</span>
              </div>
              {data.dreamCareer.salary && (
                <div className="flex items-center gap-2">
                  <span className="text-white/60">💰 Expected Salary:</span>
                  <span className="font-semibold text-white/90">{data.dreamCareer.salary}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white/95">📚 Your Reading List</h2>
        
        <div className="rounded-2xl p-6 transition-transform hover:scale-[1.02]" style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(50px)'
        }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold text-white/95">1. {data.books[0].title}</h3>
              <p className="text-white/70">by {data.books[0].author}</p>
              <div className="flex items-center gap-1 text-yellow-400">
                {'⭐'.repeat(Math.floor(data.books[0].rating))}
                <span className="text-white/60 ml-2">{data.books[0].rating}/5</span>
              </div>
              <p className="text-white/80 pt-2">
                <span className="text-[#e8b4c0] font-semibold">💡 Why for YOU:</span> {data.books[0].reason}
              </p>
            </div>
            {data.books[0].amazonLink && (
              <div className="flex items-center">
                <a 
                  href={data.books[0].amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold text-white transition hover:scale-105"
                  style={{
                    background: 'rgba(232, 180, 192, 0.2)',
                    border: '1px solid rgba(232, 180, 192, 0.3)'
                  }}
                >
                  🛒 View on Amazon
                </a>
              </div>
            )}
          </div>
        </div>

        <BlurOverlay section="books">
          {data.books.slice(1).map((book, idx) => (
            <div key={idx} className="rounded-2xl p-6 mb-4" style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1.5px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(50px)'
            }}>
              <h3 className="text-xl font-bold text-white/95">{idx + 2}. {book.title}</h3>
              <p className="text-white/70">by {book.author}</p>
              <p className="text-white/80 mt-2">{book.reason}</p>
            </div>
          ))}
        </BlurOverlay>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white/95">🎓 Your Learning Path</h2>
        
        <div className="rounded-2xl p-6" style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(50px)'
        }}>
          <h3 className="text-xl font-bold text-white/95">1. {data.courses[0].title}</h3>
          <p className="text-white/70">{data.courses[0].provider}</p>
          <p className="text-white/80 mt-2">
            <span className="text-[#e8b4c0] font-semibold">💡 Perfect because:</span> {data.courses[0].reason}
          </p>
        </div>

        {!isPremium && (
          <button 
            onClick={onUpgrade}
            className="w-full rounded-2xl p-8 text-center transition-transform hover:scale-[1.02]"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '2px dashed rgba(232, 180, 192, 0.3)',
              backdropFilter: 'blur(30px)'
            }}
          >
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="text-xl font-bold text-white/90 mb-2">2 More Courses Waiting...</h3>
            <p className="text-white/60">Unlock Complete Learning Path</p>
          </button>
        )}

        {isPremium && data.courses.slice(1).map((course, idx) => (
          <div key={idx} className="rounded-2xl p-6" style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(50px)'
          }}>
            <h3 className="text-xl font-bold text-white/95">{idx + 2}. {course.title}</h3>
            <p className="text-white/70">{course.provider}</p>
            <p className="text-white/80 mt-2">{course.reason}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white/95">📅 Your 30-Day Action Plan</h2>
        
        <div className="rounded-2xl p-6" style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(50px)'
        }}>
          <h3 className="text-lg font-semibold text-[#e8b4c0] mb-4">Week 1</h3>
          <div className="space-y-3">
            {data.actionPlan.week1.map((task, idx) => (
              <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={completedTasks[`w1-${idx}`] || false}
                  onChange={() => toggleTask(`w1-${idx}`)}
                  disabled={!isPremium}
                  className="mt-1 w-5 h-5 rounded border-2 border-[#e8b4c0]/40 bg-white/5 checked:bg-[#e8b4c0] transition cursor-pointer disabled:cursor-not-allowed"
                />
                <span className={`text-white/80 group-hover:text-white/95 transition ${
                  completedTasks[`w1-${idx}`] ? 'line-through text-white/40' : ''
                }`}>
                  {task}
                </span>
              </label>
            ))}
          </div>
        </div>

        <BlurOverlay section="actionPlan">
          <div className="space-y-4">
            {(['week2', 'week3', 'week4'] as const).map((week, weekIdx) => (
              <div key={week} className="rounded-2xl p-6" style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(50px)'
              }}>
                <h3 className="text-lg font-semibold text-[#e8b4c0] mb-4">Week {weekIdx + 2}</h3>
                <div className="space-y-3">
                  {data.actionPlan[week].map((task, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded border-2 border-[#e8b4c0]/40 bg-white/5" />
                      <span className="text-white/80">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </BlurOverlay>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white/95">💭 Mindset Shifts You Need</h2>
        
        <div 
          onClick={() => flipCard(0)}
          className="rounded-2xl p-6 cursor-pointer transition-transform hover:scale-[1.02]"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(50px)'
          }}
        >
          <p className="text-white/90 text-center">
            {flippedCards[0] ? data.mindsetShifts[0] : '🔄 Click to reveal shift #1'}
          </p>
        </div>

        {!isPremium ? (
          <button 
            onClick={onUpgrade}
            className="w-full rounded-2xl p-8 text-center transition-transform hover:scale-[1.02]"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '2px dashed rgba(232, 180, 192, 0.3)',
              backdropFilter: 'blur(30px)'
            }}
          >
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="text-xl font-bold text-white/90 mb-2">{data.mindsetShifts.length - 1} More Critical Shifts...</h3>
            <p className="text-white/60">Unlock Complete Transformation</p>
          </button>
        ) : (
          data.mindsetShifts.slice(1).map((shift, idx) => (
            <div
              key={idx + 1}
              onClick={() => flipCard(idx + 1)}
              className="rounded-2xl p-6 cursor-pointer transition-transform hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(50px)'
              }}
            >
              <p className="text-white/90 text-center">
                {flippedCards[idx + 1] ? shift : `🔄 Click to reveal shift #${idx + 2}`}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        {!isPremium ? (
          <>
            <button
              onClick={onUpgrade}
              className="px-10 py-4 rounded-2xl font-bold text-lg text-white transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(232, 180, 192, 0.3), rgba(232, 180, 192, 0.2))',
                border: '2px solid rgba(232, 180, 192, 0.5)',
                boxShadow: '0 8px 32px rgba(232, 180, 192, 0.3)'
              }}
            >
              🚀 Upgrade to Premium - $14.99/mo
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-10 py-4 rounded-2xl font-semibold text-white/80 transition hover:text-white/100"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              🏠 Back to Home
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => window.print()}
              className="px-10 py-4 rounded-2xl font-semibold text-white transition-transform hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              📥 Download PDF
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-10 py-4 rounded-2xl font-semibold text-white transition-transform hover:scale-105"
              style={{
                background: 'rgba(232, 180, 192, 0.2)',
                border: '1px solid rgba(232, 180, 192, 0.3)'
              }}
            >
              📊 View Dashboard
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}