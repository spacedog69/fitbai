# FitBAI - Fitness Body Analytics Intelligence

## Architecture

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + custom dark theme matching existing design
- **Charts**: Recharts (as in existing code)
- **Auth**: NextAuth.js (Google, Apple Health, email/password)
- **Database**: PostgreSQL via Prisma ORM
- **File Storage**: Local uploads with compression (existing logic preserved)
- **AI**: Claude API for premium nutritionist features
- **State**: React Context + server components where possible

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout with dark theme
    page.tsx                # Landing/marketing page
    (auth)/
      login/page.tsx        # Login page
      register/page.tsx     # Registration page
    (dashboard)/
      dashboard/page.tsx    # Main dashboard (StatCards, summary, weight chart)
      charts/page.tsx       # Detailed charts (weight vs waist, composition, deltas)
      history/page.tsx      # Table of all entries with edit/delete
      gallery/page.tsx      # Image gallery from entries + docs
      documents/page.tsx    # Document management (categories, upload)
      profile/page.tsx      # User profile, goals, connected apps
      share/page.tsx        # Social sharing & export
      achievements/page.tsx # Gamification: badges, streaks, scores
      ai-coach/page.tsx     # Premium: AI nutritionist chat
    api/
      auth/[...nextauth]/route.ts
      entries/route.ts      # CRUD for body comp entries
      entries/[id]/route.ts
      documents/route.ts    # CRUD for health documents
      documents/[id]/route.ts
      profile/route.ts      # User profile & goals
      achievements/route.ts # Gamification data
      ai-coach/route.ts     # AI chat endpoint (premium)
      export/route.ts       # CSV/PDF export
      share/route.ts        # Generate shareable links
  components/
    ui/                     # Reusable UI components
      StatCard.tsx
      ChartCard.tsx
      CustomTooltip.tsx
      FilePreview.tsx
      ImageModal.tsx
      Button.tsx
      Input.tsx
      Modal.tsx
      Badge.tsx
      ProgressBar.tsx
      Tabs.tsx
    forms/
      EntryForm.tsx         # Weight/measures input form
      DocumentUpload.tsx    # Document upload with categories
    charts/
      WeightChart.tsx
      CompositionChart.tsx
      WeightVsWaistChart.tsx
      DeltaBarChart.tsx
    gamification/
      AchievementCard.tsx
      StreakCounter.tsx
      LevelBadge.tsx
      MotivationalQuote.tsx
    ai/
      ChatInterface.tsx     # AI nutritionist chat
      WeeklyPlan.tsx        # AI-generated weekly diet
    layout/
      Sidebar.tsx
      Header.tsx
      MobileNav.tsx
  lib/
    prisma.ts              # Prisma client singleton
    auth.ts                # NextAuth config
    image-compress.ts      # Image compression (from existing code)
    constants.ts           # Colors, goals, categories
    utils.ts               # Formatting helpers
    achievements.ts        # Gamification logic
    ai-client.ts           # Claude API client
  prisma/
    schema.prisma          # Database schema
```

## Database Schema (Prisma)

- **User**: id, email, name, image, goals (JSON), premium, createdAt
- **Entry**: id, userId, date, weight, waist, bodyFat, muscle, notes, createdAt
- **EntryFile**: id, entryId, name, path, size, type, createdAt
- **Document**: id, userId, name, category, path, size, type, createdAt
- **Achievement**: id, userId, type, unlockedAt, metadata (JSON)
- **AiConversation**: id, userId, messages (JSON), createdAt
- **SharedLink**: id, userId, token, expiresAt, config (JSON)

## Implementation Phases

### Phase 1: Foundation (Current Sprint)
1. Initialize Next.js project with TypeScript + Tailwind
2. Set up Prisma schema + SQLite for dev (easy setup, swap to PG later)
3. Port existing component code into new structure
4. Set up constants, utils, and shared UI components

### Phase 2: Core Features
5. Build entry CRUD (create, read, update, delete measurements)
6. Build document management with categories
7. Build charts page with all 4 chart types
8. Build history table with inline actions
9. Build gallery view

### Phase 3: Auth & Persistence
10. Set up NextAuth with credentials provider
11. Connect all API routes to database
12. File upload handling (server-side)

### Phase 4: Social & Export
13. CSV/PDF export of data
14. Shareable progress links
15. Social media share cards (OG images)

### Phase 5: Gamification
16. Achievement system (first entry, streak, milestones)
17. Motivational quotes rotation
18. Level/XP system based on consistency

### Phase 6: Premium AI Features
19. Claude API integration for AI nutritionist
20. Weekly diet plan generation
21. Chat interface for health questions
