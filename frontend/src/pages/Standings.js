import React, { useState, useEffect } from 'react';
import { Trophy, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout, Header } from '../components/Layout';
import { EmptyState, LoadingSpinner } from '../components/MatchComponents';
import { useLeagues, useStandings } from '../hooks/useApi';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const StandingsTable = ({ standings }) => {
  const navigate = useNavigate();
  
  if (!standings || standings.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No Standings Available"
        description="Standings data is not available for this season."
      />
    );
  }

  // Sort by position
  const sortedStandings = [...standings].sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="overflow-x-auto">
      <table className="w-full" data-testid="standings-table">
        <thead>
          <tr className="border-b border-border text-text-tertiary text-xs uppercase tracking-wide">
            <th className="text-left py-3 px-4 font-medium">#</th>
            <th className="text-left py-3 px-4 font-medium">Team</th>
            <th className="text-center py-3 px-2 font-medium">P</th>
            <th className="text-center py-3 px-2 font-medium">W</th>
            <th className="text-center py-3 px-2 font-medium">D</th>
            <th className="text-center py-3 px-2 font-medium">L</th>
            <th className="text-center py-3 px-2 font-medium hidden sm:table-cell">GF</th>
            <th className="text-center py-3 px-2 font-medium hidden sm:table-cell">GA</th>
            <th className="text-center py-3 px-2 font-medium">GD</th>
            <th className="text-center py-3 px-4 font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {sortedStandings.map((standing, index) => {
            const details = standing.details || [];
            const played = details.find(d => d.type_id === 129)?.value || 0;
            const won = details.find(d => d.type_id === 130)?.value || 0;
            const draw = details.find(d => d.type_id === 131)?.value || 0;
            const lost = details.find(d => d.type_id === 132)?.value || 0;
            const goalsFor = details.find(d => d.type_id === 133)?.value || 0;
            const goalsAgainst = details.find(d => d.type_id === 134)?.value || 0;
            const goalDiff = goalsFor - goalsAgainst;

            const getPositionStyle = (pos) => {
              if (pos <= 4) return 'border-l-2 border-primary';
              if (pos >= sortedStandings.length - 2) return 'border-l-2 border-secondary';
              return '';
            };

            return (
              <motion.tr
                key={standing.participant_id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`border-b border-border/50 hover:bg-white/5 cursor-pointer transition-colors ${getPositionStyle(standing.position)}`}
                onClick={() => navigate(`/team/${standing.participant_id}`)}
                data-testid={`standings-row-${standing.position}`}
              >
                <td className="py-3 px-4 font-data text-text-secondary">{standing.position}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {standing.participant?.image_path && (
                      <img 
                        src={standing.participant.image_path} 
                        alt="" 
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span className="font-heading font-bold text-sm uppercase tracking-wide truncate max-w-[150px] sm:max-w-[200px]">
                      {standing.participant?.name || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center font-data text-sm">{played}</td>
                <td className="py-3 px-2 text-center font-data text-sm text-status-live">{won}</td>
                <td className="py-3 px-2 text-center font-data text-sm text-text-secondary">{draw}</td>
                <td className="py-3 px-2 text-center font-data text-sm text-secondary">{lost}</td>
                <td className="py-3 px-2 text-center font-data text-sm hidden sm:table-cell">{goalsFor}</td>
                <td className="py-3 px-2 text-center font-data text-sm hidden sm:table-cell">{goalsAgainst}</td>
                <td className={`py-3 px-2 text-center font-data text-sm ${goalDiff > 0 ? 'text-primary' : goalDiff < 0 ? 'text-secondary' : ''}`}>
                  {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
                </td>
                <td className="py-3 px-4 text-center font-data text-lg font-bold text-primary">{standing.points}</td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Standings = () => {
  const { data: leagues, loading: leaguesLoading } = useLeagues();
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-select first league with current season
  useEffect(() => {
    if (leagues && leagues.length > 0 && !selectedLeague) {
      const leagueWithSeason = leagues.find(l => l.currentseason?.id);
      if (leagueWithSeason) {
        setSelectedLeague(leagueWithSeason);
      }
    }
  }, [leagues, selectedLeague]);

  const seasonId = selectedLeague?.currentseason?.id;
  const { data: standings, loading: standingsLoading } = useStandings(seasonId);

  const filteredLeagues = leagues?.filter(league => 
    league.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.country?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const popularLeagues = filteredLeagues.filter(l => 
    [8, 564, 384, 82, 301].includes(l.id) // Premier League, La Liga, Serie A, Bundesliga, Ligue 1
  );

  const otherLeagues = filteredLeagues.filter(l => 
    ![8, 564, 384, 82, 301].includes(l.id)
  );

  return (
    <Layout>
      <Header 
        title="Standings"
        subtitle={selectedLeague ? `${selectedLeague.name} - ${selectedLeague.currentseason?.name || 'Current Season'}` : 'Select a league'}
      />

      <div className="px-4 lg:px-6">
        {/* League Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* League Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-20">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                <Input
                  placeholder="Search leagues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background-subtle border-border text-text-primary placeholder:text-text-disabled"
                  data-testid="league-search"
                />
              </div>

              {leaguesLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
                  {popularLeagues.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-text-tertiary mb-2 font-bold">Popular</h4>
                      {popularLeagues.map(league => (
                        <button
                          key={league.id}
                          onClick={() => setSelectedLeague(league)}
                          className={`w-full flex items-center gap-3 p-2 rounded-sm transition-all ${
                            selectedLeague?.id === league.id 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-white/5 text-text-secondary'
                          }`}
                          data-testid={`league-btn-${league.id}`}
                        >
                          {league.image_path && (
                            <img src={league.image_path} alt="" className="w-5 h-5 object-contain" />
                          )}
                          <span className="text-sm truncate">{league.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {otherLeagues.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-text-tertiary mb-2 font-bold">All Leagues</h4>
                      {otherLeagues.slice(0, 20).map(league => (
                        <button
                          key={league.id}
                          onClick={() => setSelectedLeague(league)}
                          className={`w-full flex items-center gap-3 p-2 rounded-sm transition-all ${
                            selectedLeague?.id === league.id 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-white/5 text-text-secondary'
                          }`}
                          data-testid={`league-btn-${league.id}`}
                        >
                          {league.image_path && (
                            <img src={league.image_path} alt="" className="w-5 h-5 object-contain" />
                          )}
                          <span className="text-sm truncate">{league.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Standings Table */}
          <div className="lg:col-span-3">
            <div className="card overflow-hidden">
              {!selectedLeague ? (
                <EmptyState
                  icon={Trophy}
                  title="Select a League"
                  description="Choose a league from the sidebar to view standings"
                />
              ) : standingsLoading ? (
                <LoadingSpinner />
              ) : (
                <StandingsTable standings={standings} />
              )}
            </div>

            {/* Legend */}
            {standings && standings.length > 0 && (
              <div className="flex items-center gap-6 mt-4 text-xs text-text-tertiary">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-l-2 border-primary" />
                  <span>Champions League</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-l-2 border-secondary" />
                  <span>Relegation</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Standings;
