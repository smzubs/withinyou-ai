// src/lib/discoveryQuestions.ts

export interface DiscoveryQuestion {
    id: number;
    category: string;
    framework: string;
    question: string;
    followUpPrompt?: string;
  }
  
  export const CORE_DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
    {
      id: 1,
      category: "What You Love",
      framework: "Ikigai + Flow State (Csikszentmihalyi)",
      question: "Tell me about activities where you completely lose track of time. What are you doing when hours feel like minutes?",
      followUpPrompt: "If mentions multiple activities, ask which one feels most fulfilling and why."
    },
    {
      id: 2,
      category: "What You Love",
      framework: "Ikigai + Self-Determination Theory",
      question: "Imagine money, status, and others' opinions don't exist. What would you spend your days doing? Be specific about what that looks like.",
      followUpPrompt: "If vague, ask for a typical day description with specific activities."
    },
    {
      id: 3,
      category: "What You're Good At",
      framework: "Ikigai + Strengths-Based Psychology",
      question: "What skills or talents do people consistently compliment you on or ask for your help with? Include both professional and personal.",
      followUpPrompt: "If modest, probe for specific examples or situations where this skill helped someone."
    },
    {
      id: 4,
      category: "What You're Good At",
      framework: "Ikigai + Achievement Analysis",
      question: "Describe your proudest achievement in life. What skills, qualities, or strengths did you use to make it happen?",
      followUpPrompt: "Ask how they could apply those same strengths to a different area of life."
    },
    {
      id: 5,
      category: "What The World Needs",
      framework: "Ikigai + Purpose Psychology (Seligman)",
      question: "What problems or challenges in the world genuinely upset you? What do you wish you could change or improve?",
      followUpPrompt: "If global, ask to narrow to a specific community or group they want to impact."
    },
    {
      id: 6,
      category: "What The World Needs",
      framework: "Ikigai + Empathy Research",
      question: "When you see someone struggling or suffering, what types of situations move you most to want to help?",
      followUpPrompt: "Explore if they've ever helped in that way and how it felt."
    },
    {
      id: 7,
      category: "What You Can Be Paid For",
      framework: "Ikigai + Market Analysis",
      question: "What professional skills do you currently have, and which ones do you believe you could develop within the next 1-2 years?",
      followUpPrompt: "Ask which of these skills they're most excited to develop and why."
    },
    {
      id: 8,
      category: "What You Can Be Paid For",
      framework: "Ikigai + Think and Grow Rich",
      question: "If you had to create a product or service that would genuinely improve people's lives, what would it be and who would it serve?",
      followUpPrompt: "Ask why that specific group needs this solution."
    },
    {
      id: 9,
      category: "Current Situation",
      framework: "7 Habits (Circle of Influence)",
      question: "What's your current career or life situation? What aspects feel most unfulfilling or misaligned with who you want to be?",
      followUpPrompt: "Distinguish between what they can control vs what they can't."
    },
    {
      id: 10,
      category: "Vision",
      framework: "7 Habits + Visualization Research",
      question: "Fast forward 5 years: Describe a perfect day in your ideal life. Where do you live? What do you do from morning to night? Who are you with?",
      followUpPrompt: "Ask how that day makes them feel and why it's important."
    },
    {
      id: 11,
      category: "Obstacles",
      framework: "Growth Mindset (Carol Dweck)",
      question: "What's currently holding you back from pursuing your dreams? Be honest about both external obstacles and internal fears.",
      followUpPrompt: "If they list obstacles, ask which ONE, if removed, would have the biggest impact."
    },
    {
      id: 12,
      category: "Learning Style",
      framework: "Self-Determination Theory",
      question: "How do you learn best? Do you prefer structured courses, self-directed exploration, learning by doing, or working with mentors?",
      followUpPrompt: "Ask for a specific example of when they learned something successfully this way."
    },
    {
      id: 13,
      category: "Burning Desire",
      framework: "Think and Grow Rich",
      question: "If you could master ONE new skill or achieve ONE major goal in the next year that would transform your life, what would it be and why?",
      followUpPrompt: "Probe the emotional reason behind this desire."
    },
    {
      id: 14,
      category: "Impact & Connection",
      framework: "Self-Determination Theory (Relatedness)",
      question: "Who do you want to help or impact through your work? What kind of difference do you want to make in their lives?",
      followUpPrompt: "Ask why this specific group matters to them personally."
    },
    {
      id: 15,
      category: "Values",
      framework: "Values Clarification Research",
      question: "What are your non-negotiables in life? What values or principles are you unwilling to compromise on, even for success?",
      followUpPrompt: "Ask for a time they had to make a difficult choice between these values and something else."
    }
  ];
  
  export const getQuestionById = (id: number): DiscoveryQuestion | undefined => {
    return CORE_DISCOVERY_QUESTIONS.find(q => q.id === id);
  };
  
  export const getQuestionsByCategory = (category: string): DiscoveryQuestion[] => {
    return CORE_DISCOVERY_QUESTIONS.filter(q => q.category === category);
  };