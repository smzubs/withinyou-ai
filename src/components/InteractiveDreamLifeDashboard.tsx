// components/InteractiveDreamLifeDashboard.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Camera, BookOpen, Target, Brain, Lightbulb, Award, Zap, Lock, Check, Star, TrendingUp, Users, Clock, Heart, Sparkles, ChevronRight, PlayCircle } from 'lucide-react';

type InteractiveDashboardProps = {
  reportData: any;
  plan: string;
};

export default function InteractiveDreamLifeDashboard({ reportData, plan }: InteractiveDashboardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [isPremium, setIsPremium] = useState(plan === 'premium');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [completedSections, setCompletedSections] = useState({});

  // Use the AI-generated report data
  const dreamLifeData = reportData || {
    profile: { name: "Your Dream Life", tagline: "Loading...", score: 0, level: "Explorer" },
    dreamCareer: { title: "Your Career Path", ikigai: {}, hollandCode: "", flowPotential: "", financialGoal: "", reasons: [] },
    books: [],
    actionPlan: [],
    mindsetShifts: [],
    courses: [],
    obstacles: [],
    metrics: { ikigaiAlignment: 0, careerFit: 0, workLifeBalance: 0, growthPotential: 0, financialViability: 0 }
  };

  // 🎨 Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      angle: Math.random() * Math.PI * 2
    }));
    setParticles(newParticles);
  }, []);

  // 🎨 Track mouse for interactive particles
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 🎴 Toggle card flip
  const toggleCardFlip = (cardId) => {
    setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // 🔒 Handle locked content
  const handleLockedClick = (section) => {
    if (!isPremium) {
      setShowUpgradeModal(true);
    }
  };

  // 🎯 Metric ring component
  const MetricRing = ({ value, label, color }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="metric-ring">
        <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(0deg)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color }}>{value}%</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{label}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)',
      color: 'white',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* 🌟 INTERACTIVE PARTICLE BACKGROUND */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {particles.map(particle => {
          const distX = mousePosition.x - particle.x;
          const distY = mousePosition.y - particle.y;
          const distance = Math.sqrt(distX * distX + distY * distY);
          const attractionStrength = Math.max(0, 20 - distance) / 20;
          
          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: `${particle.x + distX * attractionStrength * 0.3}%`,
                top: `${particle.y + distY * attractionStrength * 0.3}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(20, 184, 166, ${0.8 - distance / 100}) 0%, transparent 70%)`,
                boxShadow: `0 0 ${particle.size * 4}px ${particle.size * 2}px rgba(20, 184, 166, ${0.4 - distance / 100})`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `float ${10 + particle.speed * 10}s ease-in-out infinite`
              }}
            />
          );
        })}
      </div>

      {/* 📱 MAIN CONTENT */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>

        {/* 🎉 HERO SECTION */}
        <div style={{
          textAlign: 'center',
          padding: '3rem 0',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-block',
            animation: 'sparkleRotate 3s ease-in-out infinite'
          }}>
            <Sparkles size={48} color="#14b8a6" />
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginTop: '1rem',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Your Dream Life Journey
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            A personalized roadmap crafted just for you, powered by AI and backed by research
          </p>

          {/* 🎯 LEVEL BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '2rem',
            padding: '0.5rem 1.5rem',
            marginTop: '1.5rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)'
          }}>
            <Award size={20} color="#a78bfa" />
            <span style={{ fontWeight: '600', color: '#a78bfa' }}>
              {dreamLifeData.profile?.level || 'Explorer'} Level
            </span>
          </div>
        </div>

        {/* 📊 KEY METRICS DASHBOARD */}
        {dreamLifeData.metrics && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <MetricRing value={dreamLifeData.metrics.ikigaiAlignment || 0} label="Ikigai" color="#14b8a6" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <MetricRing value={dreamLifeData.metrics.careerFit || 0} label="Career Fit" color="#06b6d4" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <MetricRing value={dreamLifeData.metrics.workLifeBalance || 0} label="Balance" color="#8b5cf6" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <MetricRing value={dreamLifeData.metrics.growthPotential || 0} label="Growth" color="#ec4899" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <MetricRing value={dreamLifeData.metrics.financialViability || 0} label="Financial" color="#f59e0b" />
            </div>
          </div>
        )}

        {/* 🎯 DREAM CAREER HERO CARD */}
        {dreamLifeData.dreamCareer && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '3rem',
            marginBottom: '2rem',
            border: '2px solid rgba(20, 184, 166, 0.3)',
            boxShadow: '0 20px 60px rgba(20, 184, 166, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 30px 80px rgba(20, 184, 166, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(20, 184, 166, 0.2)';
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              animation: 'pulse 4s ease-in-out infinite'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Target size={32} color="#14b8a6" />
                <h2 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>
                  {dreamLifeData.dreamCareer.title}
                </h2>
              </div>
              
              {/* Holland Code, Flow, Financial Goal */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                {dreamLifeData.dreamCareer.hollandCode && (
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Holland Code
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#14b8a6' }}>
                      {dreamLifeData.dreamCareer.hollandCode}
                    </div>
                  </div>
                )}
                {dreamLifeData.dreamCareer.flowPotential && (
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Flow Potential
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#14b8a6' }}>
                      {dreamLifeData.dreamCareer.flowPotential}
                    </div>
                  </div>
                )}
                {dreamLifeData.dreamCareer.financialGoal && (
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Financial Goal
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#14b8a6' }}>
                      {dreamLifeData.dreamCareer.financialGoal}
                    </div>
                  </div>
                )}
              </div>

              {/* 🌸 IKIGAI VISUALIZATION */}
              {dreamLifeData.dreamCareer.ikigai && (
                <div style={{
                  marginTop: '2rem',
                  padding: '2rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart size={20} color="#ec4899" />
                    Your Ikigai (Reason for Being)
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                  }}>
                    {Object.entries(dreamLifeData.dreamCareer.ikigai).map(([key, value]) => (
                      <div key={key} style={{
                        padding: '1rem',
                        background: 'rgba(20, 184, 166, 0.1)',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(20, 184, 166, 0.2)'
                      }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#14b8a6', marginBottom: '0.25rem', fontWeight: '600' }}>
                          {key}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'white' }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ✨ WHY THIS WORKS */}
              {dreamLifeData.dreamCareer.reasons && dreamLifeData.dreamCareer.reasons.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Why This Path is Perfect for You
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {dreamLifeData.dreamCareer.reasons.map((reason, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(20, 184, 166, 0.1)';
                        e.currentTarget.style.transform = 'translateX(8px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}>
                        <Check size={20} color="#14b8a6" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ lineHeight: '1.6' }}>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Continue with Books, Action Plan, etc. - abbreviated for space */}
        {/* The rest of the sections follow the same pattern as the standalone artifact */}

        {/* 🚀 CTA SECTION */}
        {!isPremium && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '3rem',
            textAlign: 'center',
            border: '2px solid rgba(20, 184, 166, 0.3)',
            boxShadow: '0 20px 60px rgba(20, 184, 166, 0.2)',
            marginTop: '3rem'
          }}>
            <Sparkles size={48} color="#14b8a6" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
              Ready to Unlock Your Full Potential?
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Get unlimited access to your complete roadmap for just $14.99/month
            </p>
            
            <button
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: 'white',
                padding: '1.25rem 3rem',
                borderRadius: '1rem',
                fontWeight: '600',
                fontSize: '1.125rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(20, 184, 166, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => window.location.href = '/?upgrade=true'}
            >
              <Zap size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>

      {/* 🎨 CSS ANIMATIONS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes sparkleRotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
        }

        .metric-ring {
          position: relative;
          width: 120px;
          height: 120px;
        }
      `}</style>
    </div>
  );
}