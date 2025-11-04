# Database Migration Guide

## Schema Changes for Enhanced Features

This document outlines the database schema changes needed to support the enhanced meeting platform features.

---

## Agents Table Enhancements

### New Columns
Add the following columns to the `agents` table to support sample agents and premium features:

```sql
-- Add new columns to agents table
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS capabilities TEXT[],
ADD COLUMN IF NOT EXISTS use_cases TEXT[],
ADD COLUMN IF NOT EXISTS has_whiteboard BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_gestures BOOLEAN DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agents_tier ON agents(is_premium, is_sample);
CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category);
```

### Drizzle Migration

If using Drizzle ORM, create a migration file:

```typescript
// migrations/add_agent_fields.ts
import { pgTable, text, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export async function up(db: any) {
  await db.execute(sql`
    ALTER TABLE agents 
    ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS category TEXT,
    ADD COLUMN IF NOT EXISTS icon TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS capabilities TEXT[],
    ADD COLUMN IF NOT EXISTS use_cases TEXT[],
    ADD COLUMN IF NOT EXISTS has_whiteboard BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS has_gestures BOOLEAN DEFAULT FALSE;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS idx_agents_tier ON agents(is_premium, is_sample);
    CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category);
  `);
}

export async function down(db: any) {
  await db.execute(sql`
    DROP INDEX IF EXISTS idx_agents_category;
    DROP INDEX IF EXISTS idx_agents_tier;
    
    ALTER TABLE agents 
    DROP COLUMN IF EXISTS has_gestures,
    DROP COLUMN IF EXISTS has_whiteboard,
    DROP COLUMN IF EXISTS use_cases,
    DROP COLUMN IF EXISTS capabilities,
    DROP COLUMN IF EXISTS description,
    DROP COLUMN IF EXISTS icon,
    DROP COLUMN IF EXISTS category,
    DROP COLUMN IF EXISTS is_premium,
    DROP COLUMN IF EXISTS is_sample;
  `);
}
```

---

## Meetings Table Enhancements

### Whiteboard Data Storage

Add columns to store whiteboard session data:

```sql
-- Add whiteboard data column
ALTER TABLE meetings 
ADD COLUMN IF NOT EXISTS whiteboard_data JSONB,
ADD COLUMN IF NOT EXISTS whiteboard_snapshot_url TEXT;

-- Create index for whiteboard queries
CREATE INDEX IF NOT EXISTS idx_meetings_whiteboard ON meetings USING GIN (whiteboard_data);
```

---

## Update Schema File

Update `src/db/schema.ts` to reflect these changes:

```typescript
import { nanoid } from "nanoid";
import { pgTable, text, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";

// ... existing code ...

export const agents = pgTable("agents", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade"}),
    instructions: text("instructions").notNull(),
    // New fields
    isSample: boolean("is_sample").default(false).notNull(),
    isPremium: boolean("is_premium").default(false).notNull(),
    category: text("category"), // 'education' | 'career' | 'language' | 'productivity'
    icon: text("icon"),
    description: text("description"),
    capabilities: text("capabilities").array(), // Array of capability strings
    useCases: text("use_cases").array(), // Array of use case strings
    hasWhiteboard: boolean("has_whiteboard").default(false).notNull(),
    hasGestures: boolean("has_gestures").default(false).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const meetings = pgTable("meetings", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade"}),
    agentId: text("agent_id").notNull().references(() => agents.id, { onDelete: "cascade"}),
    status: meetingStatus("status").notNull().default("upcoming"),
    startedAt: timestamp("started_at"),
    endedAt: timestamp('ended_at'),
    transcriptUrl: text("transcript_url"),
    recordingUrl: text("recording_url"),
    summary: text("summary"),
    // New fields
    whiteboardData: jsonb("whiteboard_data"),
    whiteboardSnapshotUrl: text("whiteboard_snapshot_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
})
```

---

## Seeding Sample Agents

Create a seed script to populate sample agents:

```typescript
// scripts/seed-sample-agents.ts
import { db } from '@/db';
import { agents } from '@/db/schema';
import { SAMPLE_AGENTS } from '@/modules/agents/constants/sample-agents';

export async function seedSampleAgents() {
  // Insert sample agents (without userId - they're global)
  for (const agent of SAMPLE_AGENTS) {
    await db.insert(agents).values({
      id: agent.id,
      name: agent.name,
      userId: 'system', // Special system user ID for sample agents
      instructions: agent.instructions,
      isSample: true,
      isPremium: agent.tier === 'premium',
      category: agent.category,
      icon: agent.icon,
      description: agent.description,
      capabilities: agent.capabilities,
      useCases: agent.useCases,
      hasWhiteboard: agent.hasWhiteboard || false,
      hasGestures: agent.hasGestures || false,
    }).onConflictDoNothing();
  }
}
```

---

## Migration Steps

1. **Create migration file** using Drizzle Kit:
   ```bash
   npm run drizzle-kit generate
   ```

2. **Review migration** in the generated migration file

3. **Apply migration**:
   ```bash
   npm run db:push
   ```

4. **Seed sample agents**:
   ```bash
   # Add to package.json scripts:
   # "seed:agents": "tsx scripts/seed-sample-agents.ts"
   npm run seed:agents
   ```

---

## Verification

After migration, verify:

1. **Schema changes applied**:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'agents';
   ```

2. **Sample agents seeded**:
   ```sql
   SELECT id, name, is_sample, is_premium 
   FROM agents 
   WHERE is_sample = true;
   ```

3. **Indexes created**:
   ```sql
   SELECT indexname 
   FROM pg_indexes 
   WHERE tablename = 'agents';
   ```

---

## Rollback

If you need to rollback:

```sql
-- Remove new columns
ALTER TABLE agents 
DROP COLUMN IF EXISTS has_gestures,
DROP COLUMN IF EXISTS has_whiteboard,
DROP COLUMN IF EXISTS use_cases,
DROP COLUMN IF EXISTS capabilities,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS icon,
DROP COLUMN IF EXISTS category,
DROP COLUMN IF EXISTS is_premium,
DROP COLUMN IF EXISTS is_sample;

ALTER TABLE meetings
DROP COLUMN IF EXISTS whiteboard_snapshot_url,
DROP COLUMN IF EXISTS whiteboard_data;

-- Drop indexes
DROP INDEX IF EXISTS idx_agents_category;
DROP INDEX IF EXISTS idx_agents_tier;
DROP INDEX IF EXISTS idx_meetings_whiteboard;
```

---

## Notes

- All new columns are nullable or have defaults to ensure backward compatibility
- Sample agents use a special `userId` of 'system' to distinguish them from user-created agents
- The `capabilities` and `useCases` arrays can be queried using PostgreSQL array operators
- Whiteboard data is stored as JSONB for flexibility and efficient querying

