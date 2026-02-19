import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";

// Pages
import LiveScores from "./pages/LiveScores";
import Fixtures from "./pages/Fixtures";
import Standings from "./pages/Standings";
import MatchDetail from "./pages/MatchDetail";
import TeamProfile from "./pages/TeamProfile";
import PlayerProfile from "./pages/PlayerProfile";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <div className="App dark">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LiveScores />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/match/:fixtureId" element={<MatchDetail />} />
            <Route path="/team/:teamId" element={<TeamProfile />} />
            <Route path="/player/:playerId" element={<PlayerProfile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </div>
    </AuthProvider>
  );
}

export default App;
