import React, { useState, useMemo } from 'react';
import { RefreshCw, Activity, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Header } from '../components/Layout';
import { LeagueSection, MatchCard, EmptyState, LoadingSpinner } from '../components/MatchComponents';
import { useLivescores } from '../hooks/useApi';

const LiveScores = () => {
  const { data: fixtures, loading, error, refetch } = useLivescores(30000);
  const [viewMode, setViewMode] = useState('list');

  const groupedFixtures = useMemo(() => {
    if (!fixtures || fixtures.length === 0) return {};
    
    return fixtures.reduce((acc, fixture) => {
      const leagueId = fixture.league?.id || 'unknown';
      if (!acc[leagueId]) {
        acc[leagueId] = {
          league: fixture.league,
          fixtures: []
        };
      }
      acc[leagueId].fixtures.push(fixture);
      return acc;
    }, {});
  }, [fixtures]);

  const liveCount = useMemo(() => {
    return fixtures.filter(f => {
      const stateId = f.state?.id;
      return [2, 3, 4, 5, 25].includes(stateId);
    }).length;
  }, [fixtures]);

  return (
    <Layout>
      <Header 
        title="Live Scores"
        subtitle={`${liveCount} live matches • ${fixtures.length} total`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={refetch}
              className="btn-ghost flex items-center gap-2"
              data-testid="refresh-btn"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <div className="flex bg-background-subtle rounded-sm overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-primary text-black' : 'text-text-secondary'}`}
                data-testid="view-list-btn"
              >
                List
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-sm ${viewMode === 'cards' ? 'bg-primary text-black' : 'text-text-secondary'}`}
                data-testid="view-cards-btn"
              >
                Cards
              </button>
            </div>
          </div>
        }
      />

      <div className="px-4 lg:px-6">
        {loading && fixtures.length === 0 ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState
            icon={WifiOff}
            title="Connection Error"
            description={error}
          />
        ) : fixtures.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No Live Matches"
            description="There are no matches currently in progress. Check back later or view upcoming fixtures."
          />
        ) : viewMode === 'list' ? (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-testid="matches-list"
            >
              {Object.values(groupedFixtures).map(({ league, fixtures: leagueFixtures }) => (
                <LeagueSection 
                  key={league?.id || 'unknown'} 
                  league={league} 
                  fixtures={leagueFixtures} 
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              data-testid="matches-grid"
            >
              {fixtures.map(fixture => (
                <MatchCard key={fixture.id} fixture={fixture} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Live indicator */}
        {liveCount > 0 && (
          <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-30">
            <div className="flex items-center gap-2 bg-background-paper border border-primary/30 rounded-full px-4 py-2 shadow-glow">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-data text-primary">{liveCount} LIVE</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LiveScores;
