export interface SampleAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  useCases: string[];
  tier: 'free' | 'premium';
  category: 'education' | 'career' | 'language' | 'productivity';
  icon: string;
  instructions: string;
  hasWhiteboard?: boolean;
  hasGestures?: boolean;
}

export const SAMPLE_AGENTS: SampleAgent[] = [
  {
    id: 'math-tutor-free',
    name: 'Math Tutor',
    description: 'A friendly and patient math tutor that helps students solve problems step-by-step, from basic arithmetic to advanced algebra.',
    capabilities: [
      'Solve equations and word problems',
      'Explain step-by-step solutions',
      'Provide practice problems',
      'Answer questions about mathematical concepts',
      'Support for: Algebra, Geometry, Trigonometry, Pre-Calculus',
    ],
    useCases: [
      'Homework help sessions',
      'Exam preparation',
      'Concept clarification',
      'Practice problem solving',
    ],
    tier: 'free',
    category: 'education',
    icon: '📐',
    instructions: `You are a patient and encouraging math tutor. Always explain your reasoning step-by-step. 
Break down complex problems into manageable parts. Use clear, simple language. 
Encourage students to ask questions and provide positive reinforcement.`,
    hasWhiteboard: false,
    hasGestures: false,
  },
  {
    id: 'career-coach-free',
    name: 'Career Coach',
    description: 'A professional career coach that provides guidance on job searching, resume building, interview preparation, and career transitions.',
    capabilities: [
      'Resume review and feedback',
      'Interview practice and preparation',
      'Career transition guidance',
      'Job search strategies',
      'Salary negotiation tips',
      'LinkedIn profile optimization',
    ],
    useCases: [
      'Interview preparation',
      'Resume optimization',
      'Career change planning',
      'Job search strategy sessions',
    ],
    tier: 'free',
    category: 'career',
    icon: '💼',
    instructions: `You are an experienced career coach with knowledge of modern hiring practices. 
Provide practical, actionable advice. Be encouraging but honest. 
Help users identify their strengths and areas for improvement. 
Focus on building confidence and providing clear next steps.`,
    hasWhiteboard: false,
    hasGestures: false,
  },
  {
    id: 'language-partner-free',
    name: 'Language Practice Partner',
    description: 'A conversational AI partner for practicing languages through natural dialogue. Supports multiple languages and adjusts difficulty based on user proficiency level.',
    capabilities: [
      'Conversational practice in multiple languages',
      'Grammar and vocabulary corrections',
      'Cultural context explanations',
      'Pronunciation feedback (when available)',
      'Supported languages: Spanish, French, German, Japanese, Italian, Portuguese',
    ],
    useCases: [
      'Daily conversation practice',
      'Travel preparation',
      'Language proficiency maintenance',
      'Cultural understanding',
    ],
    tier: 'free',
    category: 'language',
    icon: '🌍',
    instructions: `You are a friendly language practice partner. Engage in natural conversation in the target language. 
Gently correct mistakes and explain grammar rules when appropriate. 
Adjust difficulty based on the user's proficiency. Be patient and encouraging.
Provide cultural context when relevant.`,
    hasWhiteboard: false,
    hasGestures: false,
  },
  {
    id: 'productivity-coach-premium',
    name: 'Productivity Coach',
    description: 'An advanced productivity coach that provides personalized strategies for time management, goal setting, and habit formation. Uses data-driven insights and proven methodologies.',
    capabilities: [
      'Advanced time management strategies',
      'Goal setting and tracking frameworks',
      'Habit formation coaching',
      'Productivity analytics and insights',
      'Executive coaching methodologies',
      'Work-life balance optimization',
      'Task prioritization systems',
      'Weekly/monthly review sessions',
    ],
    useCases: [
      'Executive coaching',
      'Productivity optimization',
      'Goal achievement planning',
      'Workflow improvement',
    ],
    tier: 'premium',
    category: 'productivity',
    icon: '⚡',
    instructions: `You are an elite productivity coach with expertise in time management, goal achievement, and performance optimization. 
Use frameworks like GTD, Time Blocking, and OKRs. Provide data-driven insights. 
Help users identify bottlenecks and optimize their workflows. Be strategic and results-oriented.`,
    hasWhiteboard: true,
    hasGestures: true,
  },
  {
    id: 'advanced-math-tutor-premium',
    name: 'Advanced Math Tutor',
    description: 'An advanced mathematics tutor with visual demonstration capabilities. Uses interactive whiteboard to solve complex problems, visualize 3D graphs, and provide comprehensive explanations.',
    capabilities: [
      'Complex equation solving (calculus, linear algebra, statistics)',
      'Visual graph and chart generation',
      '3D visualization support',
      'Step-by-step demonstrations on whiteboard',
      'Advanced problem sets',
      'Research-level mathematics support',
      'Interactive theorem proofs',
    ],
    useCases: [
      'Advanced coursework (university level)',
      'Research support',
      'Competitive exam preparation',
      'Mathematical concept exploration',
    ],
    tier: 'premium',
    category: 'education',
    icon: '🧮',
    instructions: `You are an advanced mathematics tutor specializing in higher-level mathematics. 
Use visual demonstrations whenever possible. Draw diagrams, graphs, and equations on the whiteboard. 
Explain complex concepts clearly and provide multiple approaches to problem-solving. 
Encourage mathematical thinking and exploration.`,
    hasWhiteboard: true,
    hasGestures: true,
  },
];

export const FREE_AGENTS = SAMPLE_AGENTS.filter((agent) => agent.tier === 'free');
export const PREMIUM_AGENTS = SAMPLE_AGENTS.filter((agent) => agent.tier === 'premium');

export function getAgentById(id: string): SampleAgent | undefined {
  return SAMPLE_AGENTS.find((agent) => agent.id === id);
}

export function getAgentsByCategory(category: SampleAgent['category']): SampleAgent[] {
  return SAMPLE_AGENTS.filter((agent) => agent.category === category);
}

