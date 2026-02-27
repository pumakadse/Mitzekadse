import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useLivescores = (refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLivescores = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/livescores/all`);
      setData(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivescores();
    const interval = setInterval(fetchLivescores, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchLivescores, refreshInterval]);

  return { data, loading, error, refetch: fetchLivescores };
};

export const useFixtures = (date) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      if (!date) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API}/fixtures/date/${date}`);
        setData(response.data?.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, [date]);

  return { data, loading, error };
};

export const useFixture = (fixtureId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixture = async () => {
      if (!fixtureId) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API}/fixtures/${fixtureId}`);
        setData(response.data?.data || null);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFixture();
  }, [fixtureId]);

  return { data, loading, error };
};

export const useLeagues = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await axios.get(`${API}/leagues`);
        setData(response.data?.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagues();
  }, []);

  return { data, loading, error };
};

export const useStandings = (seasonId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      if (!seasonId) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API}/standings/${seasonId}`);
        setData(response.data?.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, [seasonId]);

  return { data, loading, error };
};

export const useTeam = (teamId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamId) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API}/teams/${teamId}`);
        setData(response.data?.data || null);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [teamId]);

  return { data, loading, error };
};

export const usePlayer = (playerId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!playerId) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API}/players/${playerId}`);
        setData(response.data?.data || null);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [playerId]);

  return { data, loading, error };
};

export const useHeadToHead = (team1Id, team2Id) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchH2H = async () => {
      if (!team1Id || !team2Id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${API}/h2h/${team1Id}/${team2Id}`);
        setData(response.data?.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchH2H();
  }, [team1Id, team2Id]);

  return { data, loading, error };
};

export const useTeamForm = (teamId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      if (!teamId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${API}/team-form/${teamId}`);
        setData(response.data?.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [teamId]);

  return { data, loading, error };
};

export const useSearch = () => {
  const [results, setResults] = useState({ teams: [], players: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults({ teams: [], players: [] });
      return;
    }
    
    setLoading(true);
    try {
      const [teamsRes, playersRes] = await Promise.all([
        axios.get(`${API}/search/teams?query=${encodeURIComponent(query)}`),
        axios.get(`${API}/search/players?query=${encodeURIComponent(query)}`),
      ]);
      setResults({
        teams: teamsRes.data?.data || [],
        players: playersRes.data?.data || [],
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
};
