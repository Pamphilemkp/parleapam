# Quick Start Guide

## 🚀 Getting Started with Enhanced Features

This guide helps you quickly implement and test the new features.

---

## Step 1: Database Migration

```bash
# 1. Update src/db/schema.ts with new agent fields (see DATABASE_MIGRATION.md)
# 2. Generate migration
npm run drizzle-kit generate

# 3. Apply migration
npm run db:push

# 4. Seed sample agents (create script first from DATABASE_MIGRATION.md)
npm run seed:agents
```

---

## Step 2: Environment Variables

Add to your `.env` file:

```bash
# Production OAuth (required for iOS)
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GITHUB_CLIENT_ID=your_production_client_id
GITHUB_CLIENT_SECRET=your_production_client_secret

# Auth URL for OAuth callbacks
AUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Step 3: Test Global Loader

1. Start the dev server: `npm run dev`
2. Navigate to any page that makes tRPC requests
3. You should see the global loader appear during requests
4. Check console for any errors

**Test it:**
- Navigate to `/agents` - loader should show when loading agents
- Navigate to `/meetings` - loader should show when loading meetings

---

## Step 4: Test iOS Auth (Production)

### Prerequisites
- Have production OAuth apps configured
- Test on actual iOS device (Safari)

### Test Steps
1. Open app on iOS device
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Verify redirect back to app
5. Verify session is established

### Expected Behavior
- OAuth opens in ASWebAuthenticationSession
- After auth, redirects back to app
- Session cookie is set
- User is authenticated

---

## Step 5: Verify Sample Agents

### Check Database
```sql
SELECT id, name, is_sample, is_premium, category 
FROM agents 
WHERE is_sample = true;
```

### Expected Results
- 5 sample agents created
- 3 free agents (Math Tutor, Career Coach, Language Partner)
- 2 premium agents (Productivity Coach, Advanced Math Tutor)

---

## Step 6: Test Premium Features Hook

In any component, test the premium hook:

```typescript
import { usePremium } from '@/hooks/use-premium';

function MyComponent() {
  const { isPremium, isLoading } = usePremium();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isPremium ? 'Premium User' : 'Free User'}
    </div>
  );
}
```

---

## Common Issues & Fixes

### Issue: Loader not showing
**Fix:** Ensure `LoadingProvider` wraps `TRPCProvider` in `layout.tsx`

### Issue: iOS OAuth fails
**Fix:** 
- Verify production OAuth credentials
- Check `AUTH_URL` is set correctly
- Ensure `useSecureCookies: true` in auth config
- Test on actual iOS device, not simulator

### Issue: Sample agents not found
**Fix:**
- Run database migration
- Run seed script
- Verify `userId: 'system'` is allowed in your system

### Issue: TypeScript errors
**Fix:**
- Run `npm install` to ensure all dependencies are installed
- Check that all imports are correct
- Verify TypeScript version matches project requirements

---

## Next Steps

1. **Implement Agent Catalog UI** (Week 3)
   - See `IMPLEMENTATION_PLAN.md` for details
   - Create `agent-catalog.tsx` component
   - Add catalog tab to agents page

2. **Build Premium Features** (Week 4)
   - Whiteboard component
   - Avatar animations
   - See `IMPLEMENTATION_PLAN.md` for details

3. **Performance Optimization**
   - Run Lighthouse audit
   - Optimize bundle size
   - Add code splitting

4. **Testing**
   - Write unit tests (see `TEST_PLAN.md`)
   - Set up E2E tests
   - Test on multiple devices

---

## Documentation Reference

- **Full Implementation Plan:** `IMPLEMENTATION_PLAN.md`
- **Agent Specifications:** `AGENT_DESIGN_SPEC.md`
- **Test Plan:** `TEST_PLAN.md`
- **Database Migration:** `DATABASE_MIGRATION.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`

---

## Support

If you encounter issues:
1. Check the documentation files
2. Review error messages in console
3. Verify environment variables are set
4. Ensure database migration completed successfully

