# Agent Design Specification

## Overview
This document defines the sample AI agents available in the Parle à Pam AI platform, including their capabilities, use cases, and premium status.

---

## Free Agents

### 1. Math Tutor
**Name:** Math Tutor  
**Type:** Educational Assistant  
**Tier:** Free  
**Icon/Emoji:** 📐

**Description:**
A friendly and patient math tutor that helps students solve problems step-by-step, from basic arithmetic to advanced algebra. Perfect for homework help, exam preparation, and understanding mathematical concepts.

**Capabilities:**
- Solve equations and word problems
- Explain step-by-step solutions
- Provide practice problems
- Answer questions about mathematical concepts
- Support for: Algebra, Geometry, Trigonometry, Pre-Calculus

**Instructions (System Prompt):**
```
You are a patient and encouraging math tutor. Always explain your reasoning step-by-step. 
Break down complex problems into manageable parts. Use clear, simple language. 
Encourage students to ask questions and provide positive reinforcement.
```

**Suggested Use Cases:**
- Homework help sessions
- Exam preparation
- Concept clarification
- Practice problem solving

**UI Requirements:**
- Basic chat interface
- Ability to share math problems via text
- Transcript and summary generation

---

### 2. Career Coach
**Name:** Career Coach  
**Type:** Professional Development  
**Tier:** Free  
**Icon/Emoji:** 💼

**Description:**
A professional career coach that provides guidance on job searching, resume building, interview preparation, and career transitions. Helps users navigate their professional journey with actionable advice.

**Capabilities:**
- Resume review and feedback
- Interview practice and preparation
- Career transition guidance
- Job search strategies
- Salary negotiation tips
- LinkedIn profile optimization

**Instructions (System Prompt):**
```
You are an experienced career coach with knowledge of modern hiring practices. 
Provide practical, actionable advice. Be encouraging but honest. 
Help users identify their strengths and areas for improvement. 
Focus on building confidence and providing clear next steps.
```

**Suggested Use Cases:**
- Interview preparation
- Resume optimization
- Career change planning
- Job search strategy sessions

**UI Requirements:**
- Document sharing capability (for resume review)
- Chat interface with structured guidance
- Meeting notes and action items

---

### 3. Language Practice Partner
**Name:** Language Practice Partner  
**Type:** Language Learning  
**Tier:** Free  
**Icon/Emoji:** 🌍

**Description:**
A conversational AI partner for practicing languages through natural dialogue. Supports multiple languages and adjusts difficulty based on user proficiency level.

**Capabilities:**
- Conversational practice in multiple languages
- Grammar and vocabulary corrections
- Cultural context explanations
- Pronunciation feedback (when available)
- Supported languages: Spanish, French, German, Japanese, Italian, Portuguese

**Instructions (System Prompt):**
```
You are a friendly language practice partner. Engage in natural conversation in the target language. 
Gently correct mistakes and explain grammar rules when appropriate. 
Adjust difficulty based on the user's proficiency. Be patient and encouraging.
Provide cultural context when relevant.
```

**Suggested Use Cases:**
- Daily conversation practice
- Travel preparation
- Language proficiency maintenance
- Cultural understanding

**UI Requirements:**
- Voice/video call interface
- Language selection toggle
- Difficulty level indicator
- Vocabulary/grammar notes

---

## Premium Agents

### 4. Productivity Coach
**Name:** Productivity Coach  
**Type:** Performance & Optimization  
**Tier:** Premium  
**Icon/Emoji:** ⚡

**Description:**
An advanced productivity coach that provides personalized strategies for time management, goal setting, and habit formation. Uses data-driven insights and proven methodologies to help users achieve peak performance.

**Capabilities:**
- Advanced time management strategies
- Goal setting and tracking frameworks
- Habit formation coaching
- Productivity analytics and insights
- Executive coaching methodologies
- Work-life balance optimization
- Task prioritization systems
- Weekly/monthly review sessions

**Instructions (System Prompt):**
```
You are an elite productivity coach with expertise in time management, goal achievement, and performance optimization. 
Use frameworks like GTD, Time Blocking, and OKRs. Provide data-driven insights. 
Help users identify bottlenecks and optimize their workflows. Be strategic and results-oriented.
```

**Suggested Use Cases:**
- Executive coaching
- Productivity optimization
- Goal achievement planning
- Workflow improvement

**Premium Features:**
- Interactive whiteboard for planning
- Visual goal tracking
- Advanced analytics dashboard
- Real-time avatar gestures during explanations

**UI Requirements:**
- Whiteboard integration for planning
- Visual goal tracking charts
- Analytics dashboard
- Animated avatar with gestures
- Exportable action plans

---

### 5. Advanced Math Tutor (Premium)
**Name:** Advanced Math Tutor  
**Type:** Educational Assistant (Premium)  
**Tier:** Premium  
**Icon/Emoji:** 🧮

**Description:**
An advanced mathematics tutor with visual demonstration capabilities. Uses interactive whiteboard to solve complex problems, visualize 3D graphs, and provide comprehensive explanations for advanced topics.

**Capabilities:**
- Complex equation solving (calculus, linear algebra, statistics)
- Visual graph and chart generation
- 3D visualization support
- Step-by-step demonstrations on whiteboard
- Advanced problem sets
- Research-level mathematics support
- Interactive theorem proofs

**Instructions (System Prompt):**
```
You are an advanced mathematics tutor specializing in higher-level mathematics. 
Use visual demonstrations whenever possible. Draw diagrams, graphs, and equations on the whiteboard. 
Explain complex concepts clearly and provide multiple approaches to problem-solving. 
Encourage mathematical thinking and exploration.
```

**Suggested Use Cases:**
- Advanced coursework (university level)
- Research support
- Competitive exam preparation
- Mathematical concept exploration

**Premium Features:**
- Interactive whiteboard with drawing tools
- Graph plotting and visualization
- Real-time equation solving with visual steps
- Avatar gestures synchronized with explanations
- Exportable whiteboard sessions

**UI Requirements:**
- Full whiteboard integration
- Graphing tools and equation editor
- Visual demonstration mode
- Avatar animations synchronized with teaching
- Exportable whiteboard content (PDF/image)

---

## Agent Selection UI Design

### Catalog View
- Grid/list layout responsive to screen size
- Filter by tier (Free/Premium)
- Search functionality
- Category tags (Education, Career, Language, Productivity)
- Preview card shows:
  - Agent name and icon
  - Brief description (1-2 sentences)
  - Tier badge (Free/Premium)
  - Key capabilities (bullet points)
  - "Start Meeting" button

### Agent Detail View
- Full description
- Complete capabilities list
- Suggested use cases
- Sample conversation preview
- Premium upgrade CTA (if applicable)
- "Start Meeting" button

---

## Implementation Notes

### Database Schema Changes
```sql
-- Add to agents table
ALTER TABLE agents ADD COLUMN is_sample BOOLEAN DEFAULT FALSE;
ALTER TABLE agents ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE agents ADD COLUMN category TEXT;
ALTER TABLE agents ADD COLUMN icon TEXT;
ALTER TABLE agents ADD COLUMN description TEXT;
ALTER TABLE agents ADD COLUMN capabilities TEXT[]; -- Array of capabilities
```

### Access Control Logic
- Free users can access free sample agents
- Free users see premium agents but cannot start meetings
- Premium users have access to all agents
- Premium agents show upgrade prompt when clicked by free users

### Meeting Flow
1. User selects agent from catalog
2. System checks user subscription status
3. If premium agent + free user → Show upgrade modal
4. If allowed → Create meeting → Navigate to call lobby
5. In meeting, premium features gated by subscription check

---

## Future Agent Ideas

### Free Tier Candidates
- Health & Wellness Coach
- Writing Assistant
- Coding Tutor (Basic)

### Premium Tier Candidates
- Financial Advisor
- Legal Assistant (General)
- Advanced Coding Mentor
- Business Strategy Consultant
- Creative Writing Coach

---

## Metrics to Track

- Agent selection frequency
- Premium conversion rate from agent catalog
- Average meeting duration per agent type
- User satisfaction per agent
- Feature usage (whiteboard, gestures) per agent

