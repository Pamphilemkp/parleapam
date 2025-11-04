# Implementation Plan: Enhanced Meeting Platform

## Overview
This document outlines the staged implementation plan for enhancing the Parle à Pam AI platform with ultra-responsive UI, production iOS auth, agent catalog, premium features, and interactive whiteboard capabilities.

---

## Milestone 1: Responsiveness & Global Loader (Week 1)

### Objectives
- Implement ultra-responsive design across all breakpoints
- Add global loading state management
- Optimize performance and rendering

### Tasks

#### 1.1 Global Loading State Management
**Files to create/modify:**
- `src/contexts/loading-context.tsx` - Global loading context provider
- `src/components/ui/global-loader.tsx` - Global spinner component
- `src/hooks/use-loading.ts` - Hook for managing loading state
- `src/lib/trpc-interceptor.ts` - tRPC request interceptor for automatic loading state

**Implementation:**
- Create a React Context that tracks all in-flight requests
- Integrate with tRPC client to automatically show/hide loader
- Add debounce logic to prevent flicker on rapid requests
- Implement timeout and retry policies

#### 1.2 Responsive Design System
**Files to modify:**
- `src/app/globals.css` - Add responsive breakpoint utilities
- All component files in `src/modules/*/ui/components/` - Add responsive classes
- `src/modules/call/ui/components/call-active.tsx` - Mobile-first redesign
- `src/modules/dashboard/ui/components/dashboard-sidebar.tsx` - Responsive sidebar

**Key changes:**
- Implement fluid typography with `clamp()`
- Use CSS Grid/Flexbox for responsive layouts
- Add mobile-specific navigation patterns
- Optimize touch targets for mobile (minimum 44x44px)

#### 1.3 Performance Optimizations
**Files to modify:**
- `next.config.ts` - Add code splitting and optimization config
- `src/app/layout.tsx` - Add resource hints and preloads
- Components - Implement `React.memo` and `useMemo` where appropriate

**Optimizations:**
- Code splitting for route-based chunks
- Lazy load non-critical components
- Optimize images with Next.js Image component
- Minimize bundle size with tree-shaking

---

## Milestone 2: Production iOS Auth (Week 2)

### Objectives
- Ensure Google and GitHub OAuth work reliably on iOS production
- Implement secure PKCE flow
- Add proper error handling and fallbacks

### Tasks

#### 2.1 iOS OAuth Configuration
**Files to modify:**
- `src/lib/auth.ts` - Update auth configuration for iOS
- `next.config.ts` - Add iOS deep link configuration
- `public/.well-known/apple-app-site-association` - iOS app association file

**Changes:**
- Configure `useSecureCookies: true` (already done)
- Add iOS-specific redirect URIs
- Implement ASWebAuthenticationSession support
- Add proper CORS headers for iOS

#### 2.2 PKCE Implementation
**Files to modify:**
- `src/lib/auth.ts` - Verify PKCE is enabled (Better Auth handles this)
- `src/modules/auth/ui/views/sign-in-view.tsx` - Add iOS-specific error handling

**Implementation:**
- Verify Better Auth uses PKCE by default
- Add state verification for OAuth flows
- Implement token refresh handling

#### 2.3 Error Handling & Testing
**Files to create:**
- `src/lib/auth-errors.ts` - Centralized auth error handling
- `src/modules/auth/ui/components/ios-auth-fallback.tsx` - iOS fallback UI

**Error handling:**
- User cancellation scenarios
- Network errors
- Token refresh failures
- Session restoration

---

## Milestone 3: Agent Catalog System (Week 3)

### Objectives
- Create sample agents users can choose from
- Implement free vs premium agent access
- Build agent selection UI

### Tasks

#### 3.1 Sample Agents Data
**Files to create:**
- `src/modules/agents/constants/sample-agents.ts` - Sample agent definitions
- Database migration to add `isPremium` and `isSample` fields to agents table

**Sample agents:**
1. **Math Tutor** (Free)
   - Description: "Helps you solve math problems step-by-step"
   - Capabilities: Algebra, calculus, geometry
   - Use cases: Homework help, exam prep

2. **Career Coach** (Free)
   - Description: "Provides career guidance and interview prep"
   - Capabilities: Resume review, interview practice
   - Use cases: Job search, career transitions

3. **Language Practice Partner** (Free)
   - Description: "Practice conversations in multiple languages"
   - Capabilities: Spanish, French, German, Japanese
   - Use cases: Language learning, conversation practice

4. **Productivity Coach** (Premium)
   - Description: "Advanced productivity and time management coaching"
   - Capabilities: Goal setting, habit tracking, advanced analytics
   - Use cases: Executive coaching, productivity optimization

5. **Advanced Math Tutor** (Premium)
   - Description: "Advanced mathematics with visual demonstrations"
   - Capabilities: Complex equations, 3D visualizations, whiteboard integration
   - Use cases: Advanced coursework, research support

#### 3.2 Agent Catalog UI
**Files to create:**
- `src/modules/agents/ui/components/agent-catalog.tsx` - Catalog view
- `src/modules/agents/ui/components/agent-card.tsx` - Individual agent card
- `src/modules/agents/ui/components/premium-badge.tsx` - Premium indicator

**Files to modify:**
- `src/app/(dashboard)/agents/page.tsx` - Add catalog tab
- `src/modules/agents/server/procedures.ts` - Add `getSampleAgents` procedure

#### 3.3 Access Control
**Files to modify:**
- `src/modules/agents/server/procedures.ts` - Add premium checks for sample agents
- `src/modules/call/ui/components/call-lobby.tsx` - Show premium gate for premium agents

---

## Milestone 4: Premium Meeting Features (Week 4)

### Objectives
- Implement interactive whiteboard
- Add real-time avatar gestures and animations
- Create teaching/demonstration workflow

### Tasks

#### 4.1 Interactive Whiteboard
**Files to create:**
- `src/modules/call/ui/components/whiteboard/whiteboard-canvas.tsx` - Main whiteboard component
- `src/modules/call/ui/components/whiteboard/whiteboard-toolbar.tsx` - Drawing tools
- `src/modules/call/ui/components/whiteboard/whiteboard-sync.ts` - Real-time sync logic
- `src/lib/whiteboard-state.ts` - Whiteboard state management

**Features:**
- Freehand drawing with mouse/touch
- Shapes (rectangle, circle, line, arrow)
- Text annotations
- Color picker
- Eraser tool
- Undo/redo functionality
- Export to image/PDF
- Real-time synchronization via WebRTC data channel

#### 4.2 Avatar Animations & Gestures
**Files to create:**
- `src/modules/call/ui/components/avatar/avatar-animated.tsx` - Animated avatar component
- `src/modules/call/ui/components/avatar/avatar-gestures.ts` - Gesture system
- `src/lib/avatar-animations.ts` - Animation utilities

**Features:**
- Eye blinking (random intervals)
- Hand movements synchronized with speech
- Head movements for emphasis
- Lip-sync indicators (when available)
- Smooth transitions between states

#### 4.3 Premium Gating
**Files to modify:**
- `src/modules/call/ui/components/call-active.tsx` - Add whiteboard toggle (premium only)
- `src/modules/call/ui/components/call-active.tsx` - Add premium avatar animations
- `src/trpc/init.ts` - Add `premiumFeature` procedure helper

**Gating logic:**
- Check subscription status before enabling premium features
- Show upgrade prompts for non-premium users
- Graceful degradation (hide premium features, show upgrade CTA)

---

## Technical Considerations

### Architecture Patterns
- **Component-driven**: All UI components in module-specific folders
- **Centralized state**: React Context + tRPC for global state
- **Type safety**: Full TypeScript coverage

### Security
- Premium features gated at API level (tRPC procedures)
- Secure WebRTC signaling
- Token validation on all requests

### Performance Targets
- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3s
- Lighthouse score > 90

### Testing Strategy
- Unit tests for state logic
- Integration tests for auth flows
- E2E tests for critical paths
- Visual regression tests for responsive design

---

## File Structure Summary

```
src/
├── contexts/
│   └── loading-context.tsx          [NEW]
├── hooks/
│   ├── use-loading.ts               [NEW]
│   └── use-premium.ts                [NEW]
├── lib/
│   ├── auth-errors.ts               [NEW]
│   ├── whiteboard-state.ts          [NEW]
│   ├── avatar-animations.ts         [NEW]
│   └── trpc-interceptor.ts          [NEW]
├── modules/
│   ├── agents/
│   │   ├── constants/
│   │   │   └── sample-agents.ts     [NEW]
│   │   └── ui/components/
│   │       ├── agent-catalog.tsx    [NEW]
│   │       ├── agent-card.tsx       [NEW]
│   │       └── premium-badge.tsx    [NEW]
│   └── call/
│       └── ui/components/
│           ├── whiteboard/          [NEW DIR]
│           │   ├── whiteboard-canvas.tsx
│           │   ├── whiteboard-toolbar.tsx
│           │   └── whiteboard-sync.ts
│           └── avatar/              [NEW DIR]
│               ├── avatar-animated.tsx
│               └── avatar-gestures.ts
└── components/
    └── ui/
        └── global-loader.tsx        [NEW]
```

---

## Acceptance Criteria Checklist

- [ ] App is responsive and fast across devices (desktop, tablet, mobile)
- [ ] Global loader shows consistently during all server requests
- [ ] Production Google and GitHub sign-in work reliably on iOS devices
- [ ] At least 3 free and 2 premium sample agents available
- [ ] Premium meetings include interactive whiteboard, real-time avatar gestures
- [ ] All premium features gated behind subscription checks
- [ ] End-to-end tests cover critical paths
- [ ] Performance targets met (FCP < 1.5s, TTI < 3s)

---

## Next Steps

1. Review and approve this plan
2. Start with Milestone 1 (Responsiveness & Loader)
3. Set up testing infrastructure
4. Configure production OAuth credentials
5. Begin implementation following the staged approach

