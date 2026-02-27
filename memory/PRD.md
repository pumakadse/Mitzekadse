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
    │   ├── components/ (Layout, Footer, CookieConsent, Ads, HeadToHead, LineupPitch)
    │   ├── context/AuthContext.js
    │   ├── hooks/useApi.js
    │   └── pages/ (LiveScores, Fixtures, Standings, Search, TeamProfile, PlayerProfile, MatchDetail, Auth, Profile, Impressum, Datenschutz)
```

## Key API Endpoints
- `/api/livescores`, `/api/livescores/all`
- `/api/fixtures/date/{date}`, `/api/fixtures/{fixture_id}`, `/api/fixtures/{fixture_id}/full`
- `/api/leagues`, `/api/leagues/{league_id}`
- `/api/standings/{season_id}`
- `/api/teams/{team_id}` (include: players.player;venue)
- `/api/players/{player_id}`
- `/api/search/teams?query=`, `/api/search/players?query=`
- `/api/h2h/{team1_id}/{team2_id}`, `/api/team-form/{team_id}`
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- `/api/favorites/teams/{team_id}`

## What's Been Implemented (Completed)
1. Full-stack foundation (React/FastAPI/MongoDB)
2. Sportmonks API integration for core data
3. User authentication (Register/Login with JWT)
4. Head-to-Head (H2H) feature with team form and past match details
5. Visual lineup component with correct player positioning
6. Cookie consent banner (DSGVO-compliant, German language)
7. Austrian Impressum page (with fake company details)
8. Datenschutz (Privacy Policy) page (DSGVO-compliant)
9. Footer with legal links (Impressum, Datenschutz, AGB)
10. Ad placeholder components (Google AdSense structure)
11. Search functionality (working for free plan teams)
12. Team Profile with player names (fixed include from squad.player to players.player)
13. Dark theme throughout

## Known Limitations
- Sportmonks Free Plan: Only 4 leagues (Danish Superliga etc.), no Premier League/La Liga etc.
- Google AdSense: Placeholder components only (need real AdSense account ID)
- AGB page: Link exists in footer but no page created yet

## Backlog
### P1
- Populate Impressum/Datenschutz with more realistic content if needed

### P2
- Integrate real Google AdSense (requires user AdSense account)
- Enhance user favorites functionality
- Create AGB (Terms & Conditions) page

### P3
- Refactor HeadToHead.js and MatchComponents.js for maintainability

## Critical Notes
- LineupPitch.js has specific positioning logic (left/right swaps, forward centering) iterated with user - DO NOT change without explicit request
- Sportmonks API token is in backend/.env
- Test with Danish teams: Brøndby IF (ID 293), AGF (ID 2905)
