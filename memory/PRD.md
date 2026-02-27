# FlashPulse - Soccer Live Scores App (Flashscore Clone)

## Original Problem Statement
Build a full-stack soccer application similar to Flashscore using Sportmonks API, with dark theme, user accounts, H2H section, visual lineup pitch, Google Ads, Impressum (Austrian standard), Privacy Policy, and cookie consent.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend:** FastAPI, Python
- **Database:** MongoDB
- **API:** Sportmonks Football API v3 (Free Plan - Danish Superliga + 3 other leagues)

## Architecture
```
/app/
├── backend/
│   ├── .env (SPORTMONKS_API_TOKEN, MONGO_URL, JWT_SECRET)
│   ├── server.py (All API endpoints)
│   └── tests/test_soccer_api.py
└── frontend/
    ├── src/
    │   ├── App.js (Routing)
    │   ├── components/ (Layout, Footer, CookieConsent, Ads, HeadToHead, LineupPitch, MatchComponents)
    │   ├── context/AuthContext.js
    │   ├── hooks/useApi.js
    │   └── pages/ (LiveScores, Fixtures, Standings, Search, TeamProfile, PlayerProfile, MatchDetail, Auth, Profile, Impressum, Datenschutz)
```

## Key API Endpoints
- `/api/livescores`, `/api/livescores/all`
- `/api/fixtures/date/{date}`, `/api/fixtures/{fixture_id}` (include: lineups.player), `/api/fixtures/{fixture_id}/full`
- `/api/leagues`, `/api/leagues/{league_id}`
- `/api/standings/{season_id}`
- `/api/teams/{team_id}` (include: players.player;venue)
- `/api/players/{player_id}`
- `/api/search/teams?query=`, `/api/search/players?query=`
- `/api/h2h/{team1_id}/{team2_id}`, `/api/team-form/{team_id}`
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- `/api/favorites/teams/{team_id}`

## What's Been Implemented
1. Full-stack foundation (React/FastAPI/MongoDB)
2. Sportmonks API integration for core data
3. User authentication (Register/Login with JWT)
4. Head-to-Head (H2H) with team form and past match details
5. Visual lineup pitch with player face photos (from Sportmonks CDN)
6. Event badges on lineup: goals, yellow/red cards, assists, sub in/out indicators
7. Dynamic formation support: handles any formation (3-segment: 4-4-2, 4-3-3, 3-5-2; 4-segment: 4-4-1-1, 4-2-3-1, 4-1-4-1, 3-4-1-2, etc.)
8. Substitutes bench section: separated into "Entered" (with entry minute) and "Bench" (unused), with player faces
9. FT/Live status bug fixed: finished matches correctly show "FT" without "LIVE" indicator
10. Cookie consent banner (DSGVO-compliant, German language)
11. Austrian Impressum page (with fake company details)
12. Datenschutz (Privacy Policy) page (DSGVO-compliant)
13. Footer with legal links (Impressum, Datenschutz, AGB)
14. Ad placeholder components (Google AdSense structure)
15. Search functionality (working for free plan teams)
16. Team Profile with player names (fixed include)
17. Dark theme throughout

## Known Limitations
- Sportmonks Free Plan: Only 4 leagues (Danish Superliga etc.)
- Google AdSense: Placeholder components only (need real AdSense account ID)
- AGB page: Link exists in footer but no page created yet

## Backlog
### P1
- Create AGB (Terms & Conditions) page

### P2
- Integrate real Google AdSense (requires user AdSense account)
- Enhance user favorites functionality
- Upgrade Sportmonks plan for more leagues

### P3
- Refactor HeadToHead.js and MatchComponents.js for maintainability

## Critical Notes
- LineupPitch.js uses formation_field (row:col) from Sportmonks for positioning. Dynamic spacing adapts to any number of formation segments.
- Event type_ids: 14=goal, 18=substitution, 19=card
- Sportmonks API token is in backend/.env
- Test with Danish teams: Brondby IF (ID 293), match 19425691
