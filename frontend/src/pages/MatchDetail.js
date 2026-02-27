import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, Star, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Layout, Header } from '../components/Layout';
import { getMatchStatus, getScore, LoadingSpinner, EmptyState } from '../components/MatchComponents';
import { HeadToHeadSection } from '../components/HeadToHead';
import { FullLineupView } from '../components/LineupPitch';
import { useFixture } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const EventIcon = ({ type }) => {
  const iconMap = {
    goal: <span className="text-primary font-bold">GOAL</span>,
    yellowcard: <span className="w-3 h-4 bg-status-card-yellow rounded-sm" />,
    redcard: <span className="w-3 h-4 bg-status-card-red rounded-sm" />,
    substitution: <span className="text-text-tertiary">SUB</span>,
    penalty: <span className="text-accent font-bold">PEN</span>,
    owngoal: <span className="text-secondary font-bold">OG</span>,
  };
  return iconMap[type?.toLowerCase()] || <span className="text-text-tertiary">•</span>;
};

const MatchDetail = () => {
  const { fixtureId } = useParams();
  const navigate = useNavigate();
  const { data: fixture, loading, error } = useFixture(fixtureId);
  const { isAuthenticated, isFavoriteTeam, addFavoriteTeam, removeFavoriteTeam } = useAuth();

  const participants = fixture?.participants || [];
  const homeTeam = participants.find(p => p.meta?.location === 'home') || participants[0];
  const awayTeam = participants.find(p => p.meta?.location === 'away') || participants[1];
  
  const status = fixture ? getMatchStatus(fixture.state) : { text: 'TBD', type: 'scheduled' };
  const isLive = status.type === 'live';
  
  const homeScore = fixture ? getScore(fixture.scores, homeTeam?.id, true) : '-';
  const awayScore = fixture ? getScore(fixture.scores, awayTeam?.id, false) : '-';

  const events = useMemo(() => {
    if (!fixture?.events) return [];
    return [...fixture.events].sort((a, b) => (a.minute || 0) - (b.minute || 0));
  }, [fixture?.events]);

  const statistics = useMemo(() => {
    if (!fixture?.statistics) return [];
    return fixture.statistics;
  }, [fixture?.statistics]);

  const homeLineup = fixture?.lineups?.filter(p => p.team_id === homeTeam?.id) || [];
  const awayLineup = fixture?.lineups?.filter(p => p.team_id === awayTeam?.id) || [];

  // Extract formations from the fixture
  const formations = useMemo(() => {
    const formationsData = fixture?.formations || [];
    const homeForm = formationsData.find(f => f.location === 'home' || f.participant_id === homeTeam?.id);
    const awayForm = formationsData.find(f => f.location === 'away' || f.participant_id === awayTeam?.id);
    return {
      home: homeForm?.formation || '4-4-2',
      away: awayForm?.formation || '4-4-2'
    };
  }, [fixture?.formations, homeTeam?.id, awayTeam?.id]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error || !fixture) {
    return (
      <Layout>
        <EmptyState
          icon={Activity}
          title="Match Not Found"
          description="Unable to load match details"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 lg:px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-4"
          data-testid="back-btn"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Match Header Card */}
        <div className={`card p-6 mb-6 ${isLive ? 'border-primary/30' : ''}`} data-testid="match-header">
          {isLive && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          )}

          {/* League Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {fixture.league?.image_path && (
                <img src={fixture.league.image_path} alt="" className="w-5 h-5 object-contain" />
              )}
              <span className="text-text-secondary text-sm">{fixture.league?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-text-tertiary text-sm">
              <Clock size={14} />
              {fixture.starting_at && format(new Date(fixture.starting_at), 'MMM d, yyyy • HH:mm')}
            </div>
          </div>

          {/* Score Display */}
          <div className="flex items-center justify-between gap-8">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/team/${homeTeam?.id}`)}
              >
                {homeTeam?.image_path && (
                  <img src={homeTeam.image_path} alt="" className="w-16 h-16 object-contain mx-auto mb-3" />
                )}
                <h2 className="font-heading font-black text-xl uppercase tracking-tight">{homeTeam?.name}</h2>
              </div>
              {isAuthenticated && homeTeam?.id && (
                <button
                  onClick={() => isFavoriteTeam(homeTeam.id) ? removeFavoriteTeam(homeTeam.id) : addFavoriteTeam(homeTeam.id)}
                  className={`mt-2 p-1 ${isFavoriteTeam(homeTeam.id) ? 'text-accent' : 'text-text-tertiary hover:text-accent'}`}
                  data-testid="favorite-home-btn"
                >
                  <Star size={16} fill={isFavoriteTeam(homeTeam.id) ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>

            {/* Score */}
            <div className="text-center">
              {isLive && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary font-data text-sm font-bold">
                    {fixture.state?.clock?.minute || 'LIVE'}'
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <motion.span
                  key={homeScore}
                  initial={isLive ? { scale: 1.2 } : false}
                  animate={{ scale: 1 }}
                  className="font-data text-5xl font-bold"
                >
                  {homeScore}
                </motion.span>
                <span className="text-text-tertiary text-3xl">:</span>
                <motion.span
                  key={awayScore}
                  initial={isLive ? { scale: 1.2 } : false}
                  animate={{ scale: 1 }}
                  className="font-data text-5xl font-bold"
                >
                  {awayScore}
                </motion.span>
              </div>
              <span className={`text-sm font-bold mt-2 ${
                isLive ? 'text-primary' : status.type === 'finished' ? 'text-status-finished' : 'text-text-tertiary'
              }`}>
                {status.text}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/team/${awayTeam?.id}`)}
              >
                {awayTeam?.image_path && (
                  <img src={awayTeam.image_path} alt="" className="w-16 h-16 object-contain mx-auto mb-3" />
                )}
                <h2 className="font-heading font-black text-xl uppercase tracking-tight">{awayTeam?.name}</h2>
              </div>
              {isAuthenticated && awayTeam?.id && (
                <button
                  onClick={() => isFavoriteTeam(awayTeam.id) ? removeFavoriteTeam(awayTeam.id) : addFavoriteTeam(awayTeam.id)}
                  className={`mt-2 p-1 ${isFavoriteTeam(awayTeam.id) ? 'text-accent' : 'text-text-tertiary hover:text-accent'}`}
                  data-testid="favorite-away-btn"
                >
                  <Star size={16} fill={isFavoriteTeam(awayTeam.id) ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>
          </div>

          {/* Venue */}
          {fixture.venue && (
            <div className="flex items-center justify-center gap-2 mt-6 text-text-tertiary text-sm">
              <MapPin size={14} />
              <span>{fixture.venue.name}, {fixture.venue.city}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="h2h" className="w-full">
          <TabsList className="w-full bg-background-paper border border-border mb-4">
            <TabsTrigger value="h2h" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
              H2H
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
              Events
            </TabsTrigger>
            <TabsTrigger value="lineups" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
              Lineups
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="h2h">
            <div className="card p-4" data-testid="h2h-tab">
              <HeadToHeadSection 
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                currentLineups={fixture?.lineups || []}
              />
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="card p-4" data-testid="events-tab">
              {events.length === 0 ? (
                <p className="text-text-tertiary text-center py-8">No events recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {events.map((event, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center gap-4 py-2 ${
                        event.participant_id === homeTeam?.id ? 'justify-start' : 'justify-end flex-row-reverse'
                      }`}
                    >
                      <span className="font-data text-sm text-text-secondary w-8">{event.minute}'</span>
                      <EventIcon type={event.type?.code || event.type_id?.toString()} />
                      <span className="text-sm">{event.player_name || event.player?.display_name || 'Unknown'}</span>
                      {event.related_player_name && (
                        <span className="text-text-tertiary text-xs">({event.related_player_name})</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lineups">
            <div className="card p-4" data-testid="lineups-tab">
              {homeLineup.length === 0 && awayLineup.length === 0 ? (
                <p className="text-text-tertiary text-center py-8">Lineups not available yet</p>
              ) : (
                <FullLineupView
                  homeLineup={homeLineup}
                  awayLineup={awayLineup}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  homeFormation={formations.home}
                  awayFormation={formations.away}
                  onPlayerClick={(player) => {
                    const playerId = player?.player_id || player?.player?.id;
                    if (playerId) navigate(`/player/${playerId}`);
                  }}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="card p-4" data-testid="stats-tab">
              {statistics.length === 0 ? (
                <p className="text-text-tertiary text-center py-8">Statistics not available</p>
              ) : (
                <div className="space-y-4">
                  {statistics
                    .filter(stat => stat.type?.developer_name)
                    .slice(0, 10)
                    .map((stat, idx) => {
                      const homeValue = stat.data?.home || 0;
                      const awayValue = stat.data?.away || 0;
                      const total = homeValue + awayValue || 1;
                      const homePercent = (homeValue / total) * 100;

                      return (
                        <div key={`stat-${stat.type?.id || idx}`}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-data">{homeValue}</span>
                            <span className="text-text-tertiary">{stat.type?.name || stat.type?.developer_name}</span>
                            <span className="font-data">{awayValue}</span>
                          </div>
                          <div className="flex h-2 bg-background-subtle rounded-full overflow-hidden">
                            <div 
                              className="bg-primary transition-all"
                              style={{ width: `${homePercent}%` }}
                            />
                            <div 
                              className="bg-secondary transition-all"
                              style={{ width: `${100 - homePercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MatchDetail;
