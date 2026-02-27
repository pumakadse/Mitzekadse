"""
Soccer API Backend Tests
Tests for search, team profile, and health endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_endpoint(self):
        """Test health check returns 200"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"
        assert "timestamp" in data


class TestSearchEndpoints:
    """Search functionality tests"""
    
    def test_search_teams_brondby(self):
        """Search for Brøndby IF team - should return results"""
        response = requests.get(f"{BASE_URL}/api/search/teams?query=brondby")
        assert response.status_code == 200
        data = response.json()
        
        # Verify data structure
        assert "data" in data
        assert isinstance(data["data"], list)
        
        # Verify results contain Brøndby IF
        assert len(data["data"]) > 0
        team_names = [t.get("name", "").lower() for t in data["data"]]
        assert any("brøndby" in name or "brondby" in name for name in team_names)
    
    def test_search_teams_nonexistent(self):
        """Search for non-existent team - should return empty data array, not error"""
        response = requests.get(f"{BASE_URL}/api/search/teams?query=xyznonexistent")
        assert response.status_code == 200
        data = response.json()
        
        # Should return empty data array, not error
        assert "data" in data
        assert isinstance(data["data"], list)
        assert len(data["data"]) == 0
    
    def test_search_teams_min_length(self):
        """Search requires minimum 2 characters"""
        response = requests.get(f"{BASE_URL}/api/search/teams?query=a")
        # Should return 422 (validation error) for query less than 2 chars
        assert response.status_code == 422
    
    def test_search_players_brondby(self):
        """Search for players - should work"""
        response = requests.get(f"{BASE_URL}/api/search/players?query=slisz")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)


class TestTeamEndpoints:
    """Team profile endpoint tests"""
    
    def test_get_team_brondby(self):
        """Get Brøndby IF team (ID 293) - should return team with players"""
        response = requests.get(f"{BASE_URL}/api/teams/293")
        assert response.status_code == 200
        data = response.json()
        
        # Verify team data structure
        assert "data" in data
        team = data["data"]
        assert team.get("id") == 293
        assert "brøndby" in team.get("name", "").lower() or "brondby" in team.get("name", "").lower()
        
        # Verify players array exists with nested player objects
        assert "players" in team
        assert isinstance(team["players"], list)
        assert len(team["players"]) > 0
        
        # Verify each player has nested player object with display_name
        for player_entry in team["players"][:5]:  # Check first 5 players
            assert "player" in player_entry
            assert "display_name" in player_entry["player"]
            assert player_entry["player"]["display_name"] != "Unknown"
            assert len(player_entry["player"]["display_name"]) > 0
    
    def test_get_team_includes_jersey_numbers(self):
        """Team response should include jersey numbers"""
        response = requests.get(f"{BASE_URL}/api/teams/293")
        assert response.status_code == 200
        data = response.json()
        
        players = data["data"]["players"]
        for player_entry in players[:5]:
            assert "jersey_number" in player_entry
            # Jersey numbers should be integers
            assert isinstance(player_entry["jersey_number"], int) or player_entry["jersey_number"] is None
    
    def test_get_team_invalid_id(self):
        """Get team with invalid ID - should return error or empty"""
        response = requests.get(f"{BASE_URL}/api/teams/999999999")
        # May return 404 or empty data depending on API implementation
        assert response.status_code in [200, 404, 500]


class TestRootEndpoint:
    """Root endpoint tests"""
    
    def test_root_endpoint(self):
        """Test root endpoint returns app info"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        # Should contain some basic app info
        assert isinstance(data, dict)


class TestLeagueAndStandings:
    """League and standings endpoint tests"""
    
    def test_get_leagues(self):
        """Get available leagues"""
        response = requests.get(f"{BASE_URL}/api/leagues")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)
    
    def test_get_livescores(self):
        """Get live scores (may be empty or return message for no matches)"""
        response = requests.get(f"{BASE_URL}/api/livescores/all")
        assert response.status_code == 200
        data = response.json()
        # May return data array or message if no live matches (free plan limitation)
        assert "data" in data or "message" in data


class TestFixtureEndpoints:
    """Fixture detail endpoint tests - verifies lineups.player include for player images"""
    
    def test_fixture_returns_state_id(self):
        """Test fixture 19425691 (Randers FC vs Fredericia) returns correct state_id=5 (FT)"""
        response = requests.get(f"{BASE_URL}/api/fixtures/19425691")
        assert response.status_code == 200
        data = response.json()
        
        # Verify fixture data
        assert "data" in data
        fixture = data["data"]
        assert fixture.get("id") == 19425691
        
        # State ID 5 = Full Time (FT) - critical for FT/Live bug fix
        assert fixture.get("state_id") == 5
    
    def test_fixture_lineups_have_player_data(self):
        """Test fixture includes nested player objects in lineups for player faces"""
        response = requests.get(f"{BASE_URL}/api/fixtures/19425691")
        assert response.status_code == 200
        data = response.json()
        
        fixture = data["data"]
        lineups = fixture.get("lineups", [])
        
        # Should have 40 lineup entries (22 starters + 18 subs)
        assert len(lineups) >= 22
        
        # Verify nested player data with image_path exists
        players_with_images = 0
        for lineup in lineups:
            player = lineup.get("player", {})
            if player and player.get("image_path"):
                players_with_images += 1
                # Verify image_path is from Sportmonks CDN
                assert "sportmonks" in player["image_path"]
        
        # Most/all players should have images
        assert players_with_images >= 20, f"Only {players_with_images} players have images"
    
    def test_fixture_has_formations(self):
        """Test fixture includes formations for pitch display"""
        response = requests.get(f"{BASE_URL}/api/fixtures/19425691")
        assert response.status_code == 200
        data = response.json()
        
        fixture = data["data"]
        formations = fixture.get("formations", [])
        
        # Should have formations for both teams
        assert len(formations) >= 2
        
        # Extract formation strings
        formation_strings = [f.get("formation") for f in formations]
        
        # Verify expected formations (home: 4-4-1-1, away: 4-2-3-1)
        assert "4-4-1-1" in formation_strings or "4-2-3-1" in formation_strings
    
    def test_fixture_has_events(self):
        """Test fixture includes events for event badges (goals, cards, subs)"""
        response = requests.get(f"{BASE_URL}/api/fixtures/19425691")
        assert response.status_code == 200
        data = response.json()
        
        fixture = data["data"]
        events = fixture.get("events", [])
        
        # Should have multiple events (17 expected)
        assert len(events) >= 10
        
        # Verify event structure - just check type_id exists and is an integer
        for event in events[:5]:
            assert "type_id" in event
            assert isinstance(event["type_id"], int)
            
        # Verify we have goals and/or cards - key event type_ids: 14=goal, 18=sub, 19=card
        type_ids = [e.get("type_id") for e in events]
        has_relevant_events = any(tid in [14, 18, 19] for tid in type_ids)
        assert has_relevant_events, "Should have goals, subs or cards"
    
    def test_fixture_participants_have_meta(self):
        """Test participants include meta.location for home/away identification"""
        response = requests.get(f"{BASE_URL}/api/fixtures/19425691")
        assert response.status_code == 200
        data = response.json()
        
        fixture = data["data"]
        participants = fixture.get("participants", [])
        
        assert len(participants) == 2
        
        # Verify home/away location
        locations = [p.get("meta", {}).get("location") for p in participants]
        assert "home" in locations
        assert "away" in locations


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
