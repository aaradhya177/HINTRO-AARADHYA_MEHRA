# Hintro Dashboard

## Overview
A responsive dashboard for Hintro built as part of the Frontend Developer internship assignment.
Displays call session stats, recent calls, and a feedback system — with full support for
empty (u1) and active (u2) user states via a live mock API.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS with CSS custom properties for theming
- shadcn/ui — Dialog, DropdownMenu, Skeleton, Sonner
- lucide-react for icons
- axios for API calls
- localStorage for feedback persistence

## Getting Started
```bash
npm install
npm run dev
```
Open http://localhost:3000

Login with any email/password → you'll be taken to the dashboard as User 2 (active user).

## Switching Users
Use the U1 / U2 toggle pill in the top bar:
- U1: empty/new user — zero stats, no calls, no subscription
- U2: active user — randomized data on every API call

## Project Structure
```
app/
  page.tsx               # Login
  dashboard/
    page.tsx             # Main dashboard
    feedback-history/    # Feedback history page
components/
  Sidebar.tsx
  TopBar.tsx
  LogoutModal.tsx
  dashboard/             # StatCard, RecentCalls, CallRow
  feedback/              # FeedbackModal, StarRating, FeedbackForm, FeedbackSuccess
context/
  AuthContext.tsx
  UserContext.tsx
lib/
  api.ts                 # axios client
  feedback.ts            # localStorage helpers
  utils/timeFormat.ts    # duration + date formatters
```

## Assumptions & Notes
- No real auth — login accepts any credentials and logs in as u2
- Feedback stored in localStorage under key "hintro_feedback"
- Call descriptions use the API `description` field as the call title
- Duration formatted as "Xm Ysec" to match Figma
- Call Insights, Knowledge Base, Prompts, Boxy Controls are nav placeholders (out of scope)
- Base URL: https://hintro-dashboard-ecru.vercel.app/dashboard

## API Endpoints Used
| Endpoint | Header | Purpose |
|---|---|---|
| GET /api/auth/profile | x-user-id | User name, email |
| GET /api/auth/dashboard | x-user-id | Subscription + usage |
| GET /api/call-sessions/stats | x-user-id | 4 stat cards |
| GET /api/call-sessions?limit=10 | x-user-id | Recent calls list |
