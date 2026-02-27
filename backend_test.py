#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class FlashPulseAPITester:
    def __init__(self, base_url="https://match-analytics-pro-2.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_user_email = f"test_user_{datetime.now().strftime('%Y%m%d_%H%M%S')}@test.com"

    def log_test(self, name, success, details=""):
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        result = {
            "test": name,
            "status": "PASS" if success else "FAIL",
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status_emoji = "✅" if success else "❌"
        print(f"{status_emoji} {name}: {'PASS' if success else 'FAIL'}")
        if details and not success:
            print(f"   Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        request_headers = {'Content-Type': 'application/json'}
        if self.token:
            request_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            request_headers.update(headers)

        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=request_headers, timeout=10)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=request_headers, timeout=10)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=request_headers, timeout=10)
            else:
                self.log_test(name, False, f"Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            response_data = {}
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}

            details = f"Status: {response.status_code}, Expected: {expected_status}"
            if not success:
                details += f", Response: {response_data}"
            
            self.log_test(name, success, details if not success else "")
            return success, response_data

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "/health", 200)

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "/", 200)

    def test_register_user(self):
        """Test user registration"""
        user_data = {
            "email": self.created_user_email,
            "password": "TestPassword123!",
            "username": "testuser"
        }
        success, response = self.run_test("User Registration", "POST", "/auth/register", 200, user_data)
        if success and 'access_token' in response:
            self.token = response['access_token']
            return True, response
        return success, response

    def test_login_user(self):
        """Test user login"""
        login_data = {
            "email": self.created_user_email,
            "password": "TestPassword123!"
        }
        success, response = self.run_test("User Login", "POST", "/auth/login", 200, login_data)
        if success and 'access_token' in response:
            self.token = response['access_token']
            return True, response
        return success, response

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.token:
            self.log_test("Get Current User", False, "No auth token available")
            return False, {}
        return self.run_test("Get Current User", "GET", "/auth/me", 200)

    def test_add_favorite_team(self, team_id=85):
        """Test adding a favorite team"""
        if not self.token:
            self.log_test("Add Favorite Team", False, "No auth token available")
            return False, {}
        return self.run_test(f"Add Favorite Team {team_id}", "POST", f"/favorites/teams/{team_id}", 200)

    def test_get_favorite_teams(self):
        """Test getting favorite teams"""
        if not self.token:
            self.log_test("Get Favorite Teams", False, "No auth token available")
            return False, {}
        return self.run_test("Get Favorite Teams", "GET", "/favorites/teams", 200)

    def test_remove_favorite_team(self, team_id=85):
        """Test removing a favorite team"""
        if not self.token:
            self.log_test("Remove Favorite Team", False, "No auth token available")
            return False, {}
        return self.run_test(f"Remove Favorite Team {team_id}", "DELETE", f"/favorites/teams/{team_id}", 200)

    def test_livescores(self):
        """Test livescores endpoint"""
        return self.run_test("Get Livescores", "GET", "/livescores", 200)

    def test_leagues(self):
        """Test leagues endpoint"""
        return self.run_test("Get Leagues", "GET", "/leagues", 200)

    def test_standings(self, season_id=23776):
        """Test standings endpoint with a season ID"""
        return self.run_test(f"Get Standings for Season {season_id}", "GET", f"/standings/{season_id}", 200)

    def test_head_to_head(self, team1_id=1789, team2_id=85):
        """Test H2H endpoint - last 5 matches between teams"""
        return self.run_test(f"H2H: Team {team1_id} vs {team2_id}", "GET", f"/h2h/{team1_id}/{team2_id}", 200)

    def test_team_form(self, team_id=1789):
        """Test team form endpoint - last 5 matches for a team"""
        return self.run_test(f"Team Form: Team {team_id}", "GET", f"/team-form/{team_id}", 200)

    def test_fixture_details(self, fixture_id=19425690):
        """Test fixture details endpoint"""
        return self.run_test(f"Fixture Details: {fixture_id}", "GET", f"/fixtures/{fixture_id}", 200)

    def test_team_details(self, team_id=1789):
        """Test team details endpoint"""
        return self.run_test(f"Team Details: {team_id}", "GET", f"/teams/{team_id}", 200)

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting FlashPulse API Tests...")
        print(f"Base URL: {self.base_url}")
        print("=" * 50)

        # Basic API tests
        self.test_health_check()
        self.test_root_endpoint()

        # Authentication flow tests
        register_success, register_response = self.test_register_user()
        if not register_success:
            # Try login with existing user
            self.test_login_user()
        
        self.test_get_current_user()

        # Favorites tests (only if authenticated)
        if self.token:
            self.test_add_favorite_team()
            self.test_get_favorite_teams()
            self.test_remove_favorite_team()

        # Sportmonks API integration tests
        self.test_livescores()
        self.test_leagues()
        self.test_standings()

        # H2H specific endpoint tests
        print("\n🏆 Testing H2H Feature Endpoints...")
        self.test_head_to_head(1789, 85)  # Odense BK vs FC København
        self.test_team_form(1789)  # Odense BK form
        self.test_team_form(85)    # FC København form
        self.test_fixture_details(19425690)  # Match details
        self.test_team_details(1789)  # Odense BK details
        self.test_team_details(85)   # FC København details

        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"🎯 Success Rate: {success_rate:.1f}%")

        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "success_rate": success_rate,
            "results": self.test_results
        }

def main():
    tester = FlashPulseAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if results["success_rate"] >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())