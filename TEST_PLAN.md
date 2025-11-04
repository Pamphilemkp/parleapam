# Test Plan: Enhanced Meeting Platform

## Overview
This document outlines the testing strategy for the enhanced Parle à Pam AI platform, including unit tests, integration tests, and end-to-end (E2E) tests.

---

## Testing Strategy

### Test Types
1. **Unit Tests** - Component logic, utilities, hooks
2. **Integration Tests** - API endpoints, data flows, auth flows
3. **E2E Tests** - Critical user journeys across the application
4. **Visual Regression Tests** - UI consistency across breakpoints
5. **Performance Tests** - Load time, responsiveness, bundle size

---

## Test Framework Setup

### Recommended Tools
- **Unit/Integration**: Jest + React Testing Library
- **E2E**: Playwright or Cypress
- **Visual Regression**: Percy or Chromatic
- **Performance**: Lighthouse CI, WebPageTest

### Test Structure
```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   ├── api/
│   └── auth/
├── e2e/
│   ├── auth-flows/
│   ├── meeting-flows/
│   └── premium-features/
└── visual/
    └── components/
```

---

## Critical Test Cases

### 1. Authentication Flows (iOS Production)

#### Test Case: Google Sign-In on iOS
**Priority:** Critical  
**Type:** E2E

**Steps:**
1. Open app on iOS device (Safari)
2. Tap "Sign in with Google"
3. Complete OAuth flow in ASWebAuthenticationSession
4. Verify redirect back to app
5. Verify session is established
6. Verify user data is loaded

**Expected Results:**
- OAuth flow completes without errors
- Session cookie is set correctly
- User is authenticated and redirected to dashboard
- No console errors

**Edge Cases:**
- User cancels OAuth flow → Should show cancellation message
- Network error during OAuth → Should show retry option
- Token refresh failure → Should redirect to sign-in

---

#### Test Case: GitHub Sign-In on iOS
**Priority:** Critical  
**Type:** E2E

**Steps:**
1. Open app on iOS device (Safari)
2. Tap "Sign in with GitHub"
3. Complete OAuth flow
4. Verify redirect and session establishment

**Expected Results:**
- Same as Google sign-in test
- GitHub-specific scopes are requested correctly

---

#### Test Case: Auth Token Refresh
**Priority:** High  
**Type:** Integration

**Steps:**
1. Authenticate user
2. Wait for token expiration (or manually expire)
3. Make API request
4. Verify token is refreshed automatically
5. Verify request completes successfully

**Expected Results:**
- Token refresh happens automatically
- No user-facing errors
- Session remains valid

---

### 2. Global Loading State

#### Test Case: Loader Shows on All Requests
**Priority:** High  
**Type:** Integration

**Steps:**
1. Open app
2. Trigger various tRPC requests (agents list, meetings list, etc.)
3. Verify loader appears for each request
4. Verify loader disappears when request completes

**Expected Results:**
- Loader appears consistently
- No flicker on rapid requests (debounce working)
- Loader is announced to screen readers

**Test Scenarios:**
- Single request
- Multiple concurrent requests
- Rapid successive requests (debounce test)
- Failed requests (loader should hide)

---

#### Test Case: Loader Accessibility
**Priority:** Medium  
**Type:** Unit

**Steps:**
1. Render loader component
2. Check ARIA attributes
3. Verify screen reader announcement

**Expected Results:**
- `role="status"` or `role="alert"` present
- `aria-live="polite"` for non-critical loaders
- `aria-label` describes loading state

---

### 3. Agent Catalog

#### Test Case: Free User Views Agent Catalog
**Priority:** High  
**Type:** E2E

**Steps:**
1. Sign in as free user
2. Navigate to agents page
3. Verify free agents are visible and clickable
4. Verify premium agents are visible but show upgrade prompt
5. Click on free agent → Verify meeting can be created
6. Click on premium agent → Verify upgrade modal appears

**Expected Results:**
- Free agents accessible
- Premium agents show upgrade CTA
- Meeting creation works for free agents
- Upgrade flow works correctly

---

#### Test Case: Premium User Views Agent Catalog
**Priority:** High  
**Type:** E2E

**Steps:**
1. Sign in as premium user
2. Navigate to agents page
3. Verify all agents (free + premium) are accessible
4. Create meeting with premium agent
5. Verify premium features are available in meeting

**Expected Results:**
- All agents accessible
- Premium features enabled in meetings
- No upgrade prompts shown

---

#### Test Case: Sample Agents Display
**Priority:** Medium  
**Type:** Integration

**Steps:**
1. Call `agents.getSampleAgents` API
2. Verify response includes:
   - At least 3 free agents
   - At least 2 premium agents
   - Correct metadata (name, description, capabilities)
3. Verify UI displays agents correctly

**Expected Results:**
- All sample agents returned
- Correct categorization (free vs premium)
- UI renders agent cards properly

---

### 4. Premium Features - Whiteboard

#### Test Case: Premium User Accesses Whiteboard
**Priority:** High  
**Type:** E2E

**Steps:**
1. Sign in as premium user
2. Start meeting with premium agent
3. Click "Open Whiteboard" button
4. Verify whiteboard appears
5. Test drawing tools (pen, shapes, text)
6. Verify real-time sync (if multi-user)
7. Test export functionality

**Expected Results:**
- Whiteboard opens and functions correctly
- All drawing tools work
- Export generates valid image/PDF
- No errors in console

---

#### Test Case: Free User Attempts to Access Whiteboard
**Priority:** High  
**Type:** E2E

**Steps:**
1. Sign in as free user
2. Start meeting with free agent
3. Verify whiteboard button is hidden or disabled
4. If visible, click it → Verify upgrade prompt appears

**Expected Results:**
- Whiteboard feature gated correctly
- Upgrade prompt shows when attempted
- Clear messaging about premium requirement

---

#### Test Case: Whiteboard Real-Time Sync
**Priority:** Medium  
**Type:** Integration

**Steps:**
1. Open whiteboard in meeting
2. Draw on whiteboard
3. Verify changes sync to other participants (if applicable)
4. Test undo/redo functionality
5. Test concurrent edits (conflict resolution)

**Expected Results:**
- Changes sync in real-time
- No data loss
- Undo/redo works correctly
- Conflict resolution handles concurrent edits

---

### 5. Premium Features - Avatar Animations

#### Test Case: Avatar Animations in Premium Meeting
**Priority:** Medium  
**Type:** Integration

**Steps:**
1. Start premium meeting
2. Verify avatar is animated (blinking, gestures)
3. Trigger speech → Verify hand movements sync
4. Verify animations are smooth (60fps)
5. Test on mobile device (performance)

**Expected Results:**
- Animations are smooth and responsive
- Gestures sync with speech/actions
- Performance acceptable on mobile devices
- No jank or frame drops

---

#### Test Case: Avatar Animations Not in Free Meeting
**Priority:** Medium  
**Type:** Integration

**Steps:**
1. Start free meeting
2. Verify avatar is static (no animations)
3. Verify no performance impact from animation code

**Expected Results:**
- Animations disabled for free users
- No performance degradation
- Code gating works correctly

---

### 6. Responsive Design

#### Test Case: Mobile Responsiveness
**Priority:** High  
**Type:** Visual Regression

**Steps:**
1. Test on mobile viewport (375px, 414px)
2. Test key pages:
   - Homepage
   - Dashboard
   - Agents catalog
   - Meeting view
   - Call interface
3. Verify:
   - No horizontal scrolling
   - Touch targets are adequate (44x44px minimum)
   - Text is readable
   - Navigation is accessible

**Expected Results:**
- All pages render correctly on mobile
- Touch interactions work smoothly
- No layout issues

---

#### Test Case: Tablet Responsiveness
**Priority:** Medium  
**Type:** Visual Regression

**Steps:**
1. Test on tablet viewport (768px, 1024px)
2. Verify layout adapts appropriately
3. Test both portrait and landscape orientations

**Expected Results:**
- Layout optimized for tablet
- Efficient use of screen space
- Orientation changes handled gracefully

---

#### Test Case: Desktop Responsiveness
**Priority:** Medium  
**Type:** Visual Regression

**Steps:**
1. Test on desktop viewport (1280px, 1920px)
2. Verify layout doesn't stretch too wide
3. Test multi-column layouts
4. Verify hover states work

**Expected Results:**
- Content max-width enforced
- Multi-column layouts work
- Hover interactions function

---

### 7. Performance Tests

#### Test Case: First Contentful Paint (FCP)
**Priority:** High  
**Type:** Performance

**Target:** FCP < 1.5s on 3G connection

**Steps:**
1. Load homepage on throttled 3G connection
2. Measure FCP using Lighthouse
3. Verify target is met

**Expected Results:**
- FCP < 1.5s
- Optimized images and fonts
- Critical CSS inlined

---

#### Test Case: Time to Interactive (TTI)
**Priority:** High  
**Type:** Performance

**Target:** TTI < 3s on typical device

**Steps:**
1. Load app
2. Measure TTI using Lighthouse
3. Verify target is met

**Expected Results:**
- TTI < 3s
- JavaScript bundle optimized
- Code splitting implemented

---

#### Test Case: Bundle Size
**Priority:** Medium  
**Type:** Performance

**Target:** Initial bundle < 200KB (gzipped)

**Steps:**
1. Build production bundle
2. Analyze bundle size
3. Verify code splitting is working
4. Check for duplicate dependencies

**Expected Results:**
- Bundle size within targets
- Code splitting effective
- No unnecessary dependencies

---

## Sample Test Code

### Unit Test Example: Loading Hook
```typescript
// tests/unit/hooks/use-loading.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLoading } from '@/hooks/use-loading';
import { LoadingProvider } from '@/contexts/loading-context';

describe('useLoading', () => {
  it('should show loader when request starts', () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: LoadingProvider,
    });

    act(() => {
      result.current.startLoading('test-request');
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should hide loader when request completes', () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: LoadingProvider,
    });

    act(() => {
      result.current.startLoading('test-request');
      result.current.stopLoading('test-request');
    });

    expect(result.current.isLoading).toBe(false);
  });
});
```

---

### Integration Test Example: Auth Flow
```typescript
// tests/integration/auth/google-signin.test.ts
import { test, expect } from '@playwright/test';

test.describe('Google Sign-In on iOS', () => {
  test('should complete OAuth flow on iOS', async ({ page, context }) => {
    // Set user agent to iOS Safari
    await context.addCookies([]);
    
    await page.goto('/sign-in');
    
    // Click Google sign-in button
    await page.click('text=Sign in with Google');
    
    // Wait for OAuth redirect
    await page.waitForURL(/accounts\.google\.com/);
    
    // Complete OAuth (would need test credentials)
    // ...
    
    // Verify redirect back to app
    await page.waitForURL(/dashboard/);
    
    // Verify session is established
    const sessionCookie = await context.cookies();
    expect(sessionCookie.some(c => c.name.includes('session'))).toBe(true);
  });
});
```

---

### E2E Test Example: Agent Meeting Flow
```typescript
// tests/e2e/meeting-flows/agent-meeting.test.ts
import { test, expect } from '@playwright/test';

test.describe('Agent Meeting Flow', () => {
  test('premium user can start meeting with premium agent', async ({ page }) => {
    // Sign in as premium user
    await page.goto('/sign-in');
    // ... authentication steps
    
    // Navigate to agents
    await page.goto('/agents');
    
    // Find premium agent
    const premiumAgent = page.locator('[data-agent-tier="premium"]').first();
    await expect(premiumAgent).toBeVisible();
    
    // Click to start meeting
    await premiumAgent.click();
    await page.click('text=Start Meeting');
    
    // Verify meeting lobby
    await expect(page.locator('[data-testid="call-lobby"]')).toBeVisible();
    
    // Join meeting
    await page.click('text=Join Meeting');
    
    // Verify premium features available
    await expect(page.locator('[data-testid="whiteboard-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="avatar-animated"]')).toBeVisible();
  });
});
```

---

## Test Execution Plan

### Pre-commit Hooks
- Run unit tests
- Run linting
- Check TypeScript compilation

### CI/CD Pipeline
1. **Unit Tests** - Run on every PR
2. **Integration Tests** - Run on every PR
3. **E2E Tests** - Run on main branch and PRs to main
4. **Visual Regression** - Run on PRs affecting UI
5. **Performance Tests** - Run weekly or on demand

### Manual Testing Checklist
- [ ] Test on iOS device (Safari)
- [ ] Test on Android device (Chrome)
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test premium features with premium account
- [ ] Test free features with free account
- [ ] Verify loading states
- [ ] Verify error handling
- [ ] Verify accessibility (keyboard navigation, screen reader)

---

## Coverage Goals

- **Unit Tests**: 80%+ coverage for utilities, hooks, and business logic
- **Integration Tests**: 100% coverage for critical API endpoints
- **E2E Tests**: 100% coverage for critical user journeys
- **Visual Regression**: All UI components

---

## Reporting

### Test Reports
- Unit test results in CI output
- E2E test results in Playwright HTML report
- Visual regression diffs in Percy/Chromatic
- Performance metrics in Lighthouse CI

### Metrics to Track
- Test pass rate
- Test execution time
- Coverage percentage
- Flaky test frequency
- Bug detection rate

---

## Continuous Improvement

### Regular Reviews
- Review test coverage quarterly
- Update tests when features change
- Remove obsolete tests
- Add tests for new edge cases

### Test Maintenance
- Keep dependencies updated
- Refactor tests for clarity
- Improve test performance
- Document complex test scenarios

