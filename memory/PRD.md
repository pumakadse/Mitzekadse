# FlashPulse - Soccer Live Scores App (Flashscore Clone)

## Original Problem Statement
Build a full-stack soccer application similar to Flashscore using Sportmonks API, with dark theme, user accounts, H2H section, visual lineup pitch, Google Ads, Impressum (Austrian standard), Privacy Policy, and cookie consent.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend:** FastAPI, Python
- **Database:** MongoDB
- **API:** Sportmonks Football API v3 (Free Plan - Danish Superliga + 3 other leagues)

## What's Been Implemented
1. Full-stack foundation (React/FastAPI/MongoDB)
2. Sportmonks API integration for core data
3. User authentication (Register/Login with JWT)
4. Head-to-Head (H2H) with team form and past match details
5. Visual lineup pitch with player face photos + jersey number badges
6. Event badges on lineup: goals, yellow/red cards, assists, sub in/out
7. Dynamic formation support: any formation (3 or 4 segments)
8. Substitutes bench: "Entered" with entry minute + "Bench" unused, with player faces
9. Tab state persistence via URL params (no more broken lineup on back navigation)
10. FT/Live status bug fixed
11. Cookie consent, Impressum, Datenschutz, Footer, Ad placeholders
12. Search functionality, Team Profile with player names
13. Dark theme throughout

## Known Limitations
- Sportmonks Free Plan: Only 4 leagues (Danish Superliga etc.)
- Google AdSense: Placeholder only
- AGB page: Link in footer but no page yet

## Backlog
### P1
- Create AGB (Terms & Conditions) page
### P2
- Integrate real Google AdSense
- Enhance user favorites
### P3
- Refactor HeadToHead.js / MatchComponents.js
