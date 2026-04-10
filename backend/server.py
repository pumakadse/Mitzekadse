from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
from jose import JWTError, jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sportmonks API config
SPORTMONKS_API_TOKEN = os.environ.get('SPORTMONKS_API_TOKEN', '')
SPORTMONKS_BASE_URL = os.environ.get('SPORTMONKS_BASE_URL', 'https://api.sportmonks.com/v3/football')

# JWT config
JWT_SECRET = os.environ.get('JWT_SECRET', 'flashpulse_secret')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', 24))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

# Create the main app
app = FastAPI(title="FlashPulse API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ==================== PYDANTIC MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    username: str
    created_at: str
    favorite_teams: List[int] = []

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class FavoriteTeam(BaseModel):
    team_id: int

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# ==================== SPORTMONKS API CLIENT ====================

class SportmonksClient:
    def __init__(self):
        self.base_url = SPORTMONKS_BASE_URL
        self.api_token = SPORTMONKS_API_TOKEN
        self.timeout = 30

    async def _make_request(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if params is None:
            params = {}
        params["api_token"] = self.api_token
        url = f"{self.base_url}/{endpoint}"
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()
        except httpx.TimeoutException:
            logger.error(f"Request to {url} timed out")
            raise HTTPException(status_code=504, detail="External API timeout")
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error {e.response.status_code}: {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail="External API error")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to fetch data")

    async def get_livescores(self, include: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if include:
            params["include"] = include
        return await self._make_request("livescores/inplay", params)

    async def get_livescores_all(self, include: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if include:
            params["include"] = include
        return await self._make_request("livescores/latest", params)

    async def get_fixtures_by_date(self, date: str, include: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if include:
            params["include"] = include
        return await self._make_request(f"fixtures/date/{date}", params)

    async def get_fixture_by_id(self, fixture_id: int, include: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if include:
            params["include"] = include
        return await self._make_request(f"fixtures/{fixture_id}", params)

    async def get_leagues(self, include: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if include:
            params["include"] = include
        return await self._make_request("leagues", params)

    async def get_league_by_id(self, league_id: int, include: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if include:
            params["include"] = include
        return await self._make_request(f"leagues/{league_id}", params)

    async def get_standings(self, season_id: int, include: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if include:
            params["include"] = include
        return await self._make_request(f"standings/seasons/{season_id}", params)

    async def get_team(self, team_id: int, include: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if include:
            params["include"] = include
        return await self._make_request(f"teams/{team_id}", params)

    async def get_player(self, player_id: int, include: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if include:
            params["include"] = include
        return await self._make_request(f"players/{player_id}", params)

    async def search_teams(self, query: str) -> Dict[str, Any]:
        return await self._make_request(f"teams/search/{query}")

    async def search_players(self, query: str) -> Dict[str, Any]:
        return await self._make_request(f"players/search/{query}")

    async def get_head_to_head(self, team1_id: int, team2_id: int) -> Dict[str, Any]:
        """Get head-to-head matches between two teams"""
        params = {
            "include": "participants;scores;events;lineups.player;state;league;formations"
        }
        return await self._make_request(f"fixtures/head-to-head/{team1_id}/{team2_id}", params)

    async def get_team_fixtures(self, team_id: int, include: Optional[str] = None) -> Dict[str, Any]:
        """Get recent fixtures for a team using correct endpoint"""
        params = {
            "per_page": 10,
            "order": "desc"
        }
        if include:
            params["include"] = include
        return await self._make_request(f"fixtures/between/2024-01-01/2026-12-31/{team_id}", params)

    async def get_fixture_with_full_details(self, fixture_id: int) -> Dict[str, Any]:
        """Get fixture with all details for H2H comparison"""
        params = {
            "include": "participants;scores;events;lineups.player;state;league;statistics"
        }
        return await self._make_request(f"fixtures/{fixture_id}", params)

sportmonks_client = SportmonksClient()


# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            return None
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
        return user
    except JWTError:
        return None

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "username": user_data.username,
        "password": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "favorite_teams": []
    }
    await db.users.insert_one(user_doc)
    
    token = create_access_token({"sub": user_id})
    user_response = UserResponse(
        id=user_id,
        email=user_data.email,
        username=user_data.username,
        created_at=user_doc["created_at"],
        favorite_teams=[]
    )
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user["id"]})
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        username=user["username"],
        created_at=user["created_at"],
        favorite_teams=user.get("favorite_teams", [])
    )
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(require_auth)):
    return UserResponse(**current_user)


# ==================== FAVORITES ROUTES ====================

@api_router.post("/favorites/teams/{team_id}")
async def add_favorite_team(team_id: int, current_user: dict = Depends(require_auth)):
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$addToSet": {"favorite_teams": team_id}}
    )
    return {"success": True, "message": "Team added to favorites"}

@api_router.delete("/favorites/teams/{team_id}")
async def remove_favorite_team(team_id: int, current_user: dict = Depends(require_auth)):
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$pull": {"favorite_teams": team_id}}
    )
    return {"success": True, "message": "Team removed from favorites"}

@api_router.get("/favorites/teams")
async def get_favorite_teams(current_user: dict = Depends(require_auth)):
    return {"favorite_teams": current_user.get("favorite_teams", [])}


# ==================== SPORTMONKS ROUTES ====================

@api_router.get("/livescores")
async def get_livescores(include: Optional[str] = Query("participants;scores;league;state")):
    return await sportmonks_client.get_livescores(include=include)

@api_router.get("/livescores/all")
async def get_all_livescores(include: Optional[str] = Query("participants;scores;league;state")):
    return await sportmonks_client.get_livescores_all(include=include)

@api_router.get("/fixtures/date/{date}")
async def get_fixtures_by_date(date: str, include: Optional[str] = Query("participants;scores;league;state")):
    return await sportmonks_client.get_fixtures_by_date(date, include=include)

@api_router.get("/fixtures/{fixture_id}")
async def get_fixture(fixture_id: int, include: Optional[str] = Query("participants;scores;league;events;lineups.player;statistics;state;formations")):
    return await sportmonks_client.get_fixture_by_id(fixture_id, include=include)

@api_router.get("/leagues")
async def get_leagues(include: Optional[str] = Query("currentSeason")):
    return await sportmonks_client.get_leagues(include=include)

@api_router.get("/leagues/{league_id}")
async def get_league(league_id: int, include: Optional[str] = Query("currentSeason;seasons")):
    return await sportmonks_client.get_league_by_id(league_id, include=include)

@api_router.get("/standings/{season_id}")
async def get_standings(season_id: int, include: Optional[str] = Query("participant;details")):
    return await sportmonks_client.get_standings(season_id, include=include)

@api_router.get("/teams/{team_id}")
async def get_team(team_id: int, include: Optional[str] = Query("players.player;venue")):
    return await sportmonks_client.get_team(team_id, include=include)

@api_router.get("/players/{player_id}")
async def get_player(player_id: int, include: Optional[str] = Query("statistics;teams;nationality")):
    return await sportmonks_client.get_player(player_id, include=include)

@api_router.get("/search/teams")
async def search_teams(query: str = Query(..., min_length=2)):
    result = await sportmonks_client.search_teams(query)
    if "data" not in result:
        return {"data": []}
    return result

@api_router.get("/search/players")
async def search_players(query: str = Query(..., min_length=2)):
    result = await sportmonks_client.search_players(query)
    if "data" not in result:
        return {"data": []}
    return result


# ==================== HEAD-TO-HEAD ROUTES ====================

@api_router.get("/h2h/{team1_id}/{team2_id}")
async def get_head_to_head(team1_id: int, team2_id: int):
    """Get head-to-head matches between two teams (last 5)"""
    try:
        result = await sportmonks_client.get_head_to_head(team1_id, team2_id)
        # Limit to last 5 matches and sort by date
        matches = result.get("data", [])
        if isinstance(matches, list):
            matches = sorted(matches, key=lambda x: x.get("starting_at", ""), reverse=True)[:5]
            result["data"] = matches
        return result
    except Exception as e:
        logger.error(f"Error fetching H2H: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch head-to-head data")

@api_router.get("/team-form/{team_id}")
async def get_team_form(team_id: int):
    """Get last 5 matches for a team (form)"""
    try:
        result = await sportmonks_client.get_team_fixtures(
            team_id, 
            include="participants;scores;events;lineups.player;state;league;formations"
        )
        matches = result.get("data", [])
        if isinstance(matches, list):
            # Filter only finished matches and sort by date
            finished_matches = [m for m in matches if m.get("state", {}).get("id") in [5, 6, 7, 8, 9, 10, 11] or 
                               'finished' in str(m.get("state", {}).get("name", "")).lower()]
            finished_matches = sorted(finished_matches, key=lambda x: x.get("starting_at", ""), reverse=True)[:5]
            result["data"] = finished_matches
        return result
    except Exception as e:
        logger.error(f"Error fetching team form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch team form data")

@api_router.get("/fixtures/{fixture_id}/full")
async def get_fixture_full_details(fixture_id: int):
    """Get fixture with complete details for H2H comparison"""
    return await sportmonks_client.get_fixture_with_full_details(fixture_id)


# ==================== STATUS ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "FlashPulse API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
