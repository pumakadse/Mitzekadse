import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Users, ArrowRightLeft, Target, Square, Clock } from 'lucide-react';
import { LoadingSpinner } from './MatchComponents';
import { LineupPitch } from './LineupPitch';
import { useHeadToHead, useTeamForm } from '../hooks/useApi';

// Helper to get score from fixture
const getTeamScore = (fixture, teamId) => {
  const scores = fixture?.scores || [];
  const participants = fixture?.participants || [];
  const team = participants.find(p => p.id === teamId);
  
  if (!team) return '-';
  
  const isHome = team.meta?.location === 'home';
  const currentScore = scores.find(s => 
    s.description === 'CURRENT' && 
    s.score?.participant === (isHome ? 'home' : 'away')
  );
  
  return currentScore?.score?.goals ?? '-';
};

// Helper to determine match result for a team
const getMatchResult = (fixture, teamId) => {
  const participants = fixture?.participants || [];
  const team = participants.find(p => p.id === teamId);
  const opponent = participants.find(p => p.id !== teamId);
  
  if (!team || !opponent) return 'D';
  
  const teamScore = parseInt(getTeamScore(fixture, teamId)) || 0;
  const opponentScore = parseInt(getTeamScore(fixture, opponent.id)) || 0;
  
  if (teamScore > opponentScore) return 'W';
  if (teamScore < opponentScore) return 'L';
  return 'D';
};

// Result badge component
const ResultBadge = ({ result }) => {
  const styles = {
    W: 'bg-primary text-black',
    D: 'bg-text-tertiary text-white',
    L: 'bg-secondary text-white',
  };
  
  return (
    <span className={`w-6 h-6 flex items-center justify-center rounded-sm font-data text-xs font-bold ${styles[result]}`}>
      {result}
    </span>
  );
};

// Event icon component
const EventIcon = ({ event }) => {
  const typeId = event.type_id || event.type?.id;
  const typeName = event.type?.code || event.type?.developer_name || '';
  
  // Goal
  if (typeId === 14 || typeName.toLowerCase().includes('goal')) {
    return <Target size={14} className="text-primary" />;
  }
  // Yellow card
  if (typeId === 84 || typeName.toLowerCase().includes('yellow')) {
    return <div className="w-3 h-4 bg-status-card-yellow rounded-sm" />;
  }
  // Red card
  if (typeId === 83 || typeName.toLowerCase().includes('red')) {
    return <div className="w-3 h-4 bg-status-card-red rounded-sm" />;
  }
  // Substitution
  if (typeId === 18 || typeId === 19 || typeName.toLowerCase().includes('substitution')) {
    return <ArrowRightLeft size={14} className="text-text-tertiary" />;
  }
  
  return null;
};

// Single match card for H2H display
const H2HMatchCard = ({ fixture, highlightTeamId, showDetails = false, currentLineups = null }) => {
  const [expanded, setExpanded] = useState(showDetails);
  const navigate = useNavigate();
  
  const participants = fixture?.participants || [];
  const homeTeam = participants.find(p => p.meta?.location === 'home') || participants[0];
  const awayTeam = participants.find(p => p.meta?.location === 'away') || participants[1];
  
  const homeScore = getTeamScore(fixture, homeTeam?.id);
  const awayScore = getTeamScore(fixture, awayTeam?.id);
  
  const events = fixture?.events || [];
  const lineups = fixture?.lineups || [];
  
  // Group events by team
  const homeEvents = events.filter(e => e.participant_id === homeTeam?.id);
  const awayEvents = events.filter(e => e.participant_id === awayTeam?.id);
  
  // Group lineups by team
  const homeLineup = lineups.filter(p => p.team_id === homeTeam?.id);
  const awayLineup = lineups.filter(p => p.team_id === awayTeam?.id);
  
  // Filter events by type
  const getGoals = (teamEvents) => teamEvents.filter(e => 
    e.type_id === 14 || e.type?.code?.toLowerCase().includes('goal')
  );
  const getCards = (teamEvents) => teamEvents.filter(e => 
    [83, 84].includes(e.type_id) || 
    e.type?.code?.toLowerCase().includes('card')
  );
  const getSubstitutions = (teamEvents) => teamEvents.filter(e => 
    [18, 19].includes(e.type_id) || 
    e.type?.code?.toLowerCase().includes('substitution')
  );

  // Check if player is in current match lineup
  const isInCurrentLineup = (playerId, teamId) => {
    if (!currentLineups) return false;
    const currentTeamLineup = currentLineups.filter(p => p.team_id === teamId);
    return currentTeamLineup.some(p => p.player_id === playerId || p.player?.id === playerId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-paper border border-border rounded-lg overflow-hidden mb-3"
    >
      {/* Match Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-text-tertiary text-xs">
            {fixture.league?.image_path && (
              <img src={fixture.league.image_path} alt="" className="w-4 h-4 object-contain" />
            )}
            <span>{fixture.league?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-text-tertiary text-xs font-data">
            <Clock size={12} />
            {fixture.starting_at && format(new Date(fixture.starting_at), 'MMM d, yyyy')}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {homeTeam?.image_path && (
              <img src={homeTeam.image_path} alt="" className="w-8 h-8 object-contain" />
            )}
            <span className={`font-heading font-bold uppercase text-sm ${homeTeam?.id === highlightTeamId ? 'text-primary' : ''}`}>
              {homeTeam?.short_code || homeTeam?.name?.substring(0, 3)}
            </span>
          </div>
          
          <div className="flex items-center gap-3 px-4">
            <span className="font-data text-2xl font-bold">{homeScore}</span>
            <span className="text-text-tertiary">-</span>
            <span className="font-data text-2xl font-bold">{awayScore}</span>
          </div>
          
          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className={`font-heading font-bold uppercase text-sm ${awayTeam?.id === highlightTeamId ? 'text-primary' : ''}`}>
              {awayTeam?.short_code || awayTeam?.name?.substring(0, 3)}
            </span>
            {awayTeam?.image_path && (
              <img src={awayTeam.image_path} alt="" className="w-8 h-8 object-contain" />
            )}
          </div>
          
          <button className="ml-4 text-text-tertiary">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      
      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border"
          >
            {/* Visual Lineup Pitch */}
            {(homeLineup.length > 0 || awayLineup.length > 0) && (
              <div className="p-4 border-b border-border">
                <h5 className="text-xs text-text-tertiary uppercase mb-3 flex items-center gap-1">
                  <Users size={12} /> Lineups Comparison
                </h5>
                <div className="relative">
                  <LineupPitch
                    homeLineup={homeLineup}
                    awayLineup={awayLineup}
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                    homeFormation={
                      (Array.isArray(fixture?.formations)
                        ? fixture.formations.find(f => f.location === 'home')?.formation
                        : fixture?.formations?.localteam_formation) || '4-4-2'
                    }
                    awayFormation={
                      (Array.isArray(fixture?.formations)
                        ? fixture.formations.find(f => f.location === 'away')?.formation
                        : fixture?.formations?.visitorteam_formation) || '4-4-2'
                    }
                    events={events}
                  />
                  {currentLineups && currentLineups.length > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-text-tertiary">
                      <span className="w-3 h-3 rounded-full bg-accent" />
                      <span>Players also in today's lineup</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Home Team Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  {homeTeam?.image_path && (
                    <img src={homeTeam.image_path} alt="" className="w-5 h-5 object-contain" />
                  )}
                  <span className="font-heading font-bold uppercase text-sm">{homeTeam?.name}</span>
                </div>
                
                {/* Goals */}
                {getGoals(homeEvents).length > 0 && (
                  <div>
                    <h5 className="text-xs text-text-tertiary uppercase mb-2 flex items-center gap-1">
                      <Target size={12} className="text-primary" /> Goals
                    </h5>
                    <div className="space-y-1">
                      {getGoals(homeEvents).map((event, idx) => (
                        <div key={`home-goal-${idx}`} className="flex items-center gap-2 text-sm">
                          <span className="font-data text-text-tertiary w-8">{event.minute}'</span>
                          <span>{event.player_name || event.player?.display_name}</span>
                          {event.related_player_name && (
                            <span className="text-text-tertiary text-xs">(assist: {event.related_player_name})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Cards */}
                {getCards(homeEvents).length > 0 && (
                  <div>
                    <h5 className="text-xs text-text-tertiary uppercase mb-2 flex items-center gap-1">
                      <Square size={12} className="text-status-card-yellow" /> Cards
                    </h5>
                    <div className="space-y-1">
                      {getCards(homeEvents).map((event, idx) => (
                        <div key={`home-card-${idx}`} className="flex items-center gap-2 text-sm">
                          <span className="font-data text-text-tertiary w-8">{event.minute}'</span>
                          <EventIcon event={event} />
                          <span>{event.player_name || event.player?.display_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Substitutions */}
                {getSubstitutions(homeEvents).length > 0 && (
                  <div>
                    <h5 className="text-xs text-text-tertiary uppercase mb-2 flex items-center gap-1">
                      <ArrowRightLeft size={12} /> Substitutions
                    </h5>
                    <div className="space-y-1">
                      {getSubstitutions(homeEvents).map((event, idx) => (
                        <div key={`home-sub-${idx}`} className="flex items-center gap-2 text-sm">
                          <span className="font-data text-text-tertiary w-8">{event.minute}'</span>
                          <span className="text-primary">IN:</span>
                          <span>{event.player_name || event.player?.display_name}</span>
                          {event.related_player_name && (
                            <>
                              <span className="text-secondary">OUT:</span>
                              <span>{event.related_player_name}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Away Team Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  {awayTeam?.image_path && (
                    <img src={awayTeam.image_path} alt="" className="w-5 h-5 object-contain" />
                  )}
                  <span className="font-heading font-bold uppercase text-sm">{awayTeam?.name}</span>
                </div>
                
                {/* Goals */}
                {getGoals(awayEvents).length > 0 && (
                  <div>
                    <h5 className="text-xs text-text-tertiary uppercase mb-2 flex items-center gap-1">
                      <Target size={12} className="text-primary" /> Goals
                    </h5>
                    <div className="space-y-1">
                      {getGoals(awayEvents).map((event, idx) => (
                        <div key={`away-goal-${idx}`} className="flex items-center gap-2 text-sm">
                          <span className="font-data text-text-tertiary w-8">{event.minute}'</span>
                          <span>{event.player_name || event.player?.display_name}</span>
                          {event.related_player_name && (
                            <span className="text-text-tertiary text-xs">(assist: {event.related_player_name})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Cards */}
                {getCards(awayEvents).length > 0 && (
                  <div>
                    <h5 className="text-xs text-text-tertiary uppercase mb-2 flex items-center gap-1">
                      <Square size={12} className="text-status-card-yellow" /> Cards
                    </h5>
                    <div className="space-y-1">
                      {getCards(awayEvents).map((event, idx) => (
                        <div key={`away-card-${idx}`} className="flex items-center gap-2 text-sm">
                          <span className="font-data text-text-tertiary w-8">{event.minute}'</span>
                          <EventIcon event={event} />
                          <span>{event.player_name || event.player?.display_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Substitutions */}
                {getSubstitutions(awayEvents).length > 0 && (
                  <div>
                    <h5 className="text-xs text-text-tertiary uppercase mb-2 flex items-center gap-1">
                      <ArrowRightLeft size={12} /> Substitutions
                    </h5>
                    <div className="space-y-1">
                      {getSubstitutions(awayEvents).map((event, idx) => (
                        <div key={`away-sub-${idx}`} className="flex items-center gap-2 text-sm">
                          <span className="font-data text-text-tertiary w-8">{event.minute}'</span>
                          <span className="text-primary">IN:</span>
                          <span>{event.player_name || event.player?.display_name}</span>
                          {event.related_player_name && (
                            <>
                              <span className="text-secondary">OUT:</span>
                              <span>{event.related_player_name}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* View Full Match Link */}
            <div className="px-4 pb-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/match/${fixture.id}`);
                }}
                className="text-primary text-sm hover:underline"
              >
                View full match details →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Form display for a team
const TeamFormSection = ({ teamId, teamName, teamLogo, currentLineups }) => {
  const { data: formMatches, loading, error } = useTeamForm(teamId);
  
  if (loading) return <LoadingSpinner size="sm" />;
  if (error) return <p className="text-text-tertiary text-sm">Failed to load form data</p>;
  if (!formMatches || formMatches.length === 0) {
    return <p className="text-text-tertiary text-sm">No recent matches found</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {teamLogo && <img src={teamLogo} alt="" className="w-6 h-6 object-contain" />}
        <h4 className="font-heading font-bold uppercase">{teamName} Form</h4>
        <div className="flex gap-1 ml-auto">
          {formMatches.slice(0, 5).map((match, idx) => (
            <ResultBadge key={idx} result={getMatchResult(match, teamId)} />
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        {formMatches.map((match, idx) => (
          <H2HMatchCard 
            key={match.id || idx} 
            fixture={match} 
            highlightTeamId={teamId}
            currentLineups={currentLineups}
          />
        ))}
      </div>
    </div>
  );
};

// Main H2H Section component
export const HeadToHeadSection = ({ homeTeam, awayTeam, currentLineups }) => {
  const [activeTab, setActiveTab] = useState('h2h');
  
  const { data: h2hMatches, loading: h2hLoading, error: h2hError } = useHeadToHead(
    homeTeam?.id, 
    awayTeam?.id
  );
  
  // Calculate H2H stats
  const h2hStats = useMemo(() => {
    if (!h2hMatches || h2hMatches.length === 0) return null;
    
    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;
    let homeGoals = 0;
    let awayGoals = 0;
    
    h2hMatches.forEach(match => {
      const hScore = parseInt(getTeamScore(match, homeTeam?.id)) || 0;
      const aScore = parseInt(getTeamScore(match, awayTeam?.id)) || 0;
      
      homeGoals += hScore;
      awayGoals += aScore;
      
      if (hScore > aScore) homeWins++;
      else if (aScore > hScore) awayWins++;
      else draws++;
    });
    
    return { homeWins, awayWins, draws, homeGoals, awayGoals, total: h2hMatches.length };
  }, [h2hMatches, homeTeam?.id, awayTeam?.id]);

  return (
    <div data-testid="h2h-section">
      {/* Tab Navigation */}
      <div className="flex bg-background-subtle rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('h2h')}
          className={`flex-1 py-2 px-4 rounded-md font-heading font-bold uppercase text-sm transition-all ${
            activeTab === 'h2h' ? 'bg-primary text-black' : 'text-text-secondary hover:text-white'
          }`}
          data-testid="h2h-tab-btn"
        >
          Head to Head
        </button>
        <button
          onClick={() => setActiveTab('home-form')}
          className={`flex-1 py-2 px-4 rounded-md font-heading font-bold uppercase text-sm transition-all ${
            activeTab === 'home-form' ? 'bg-primary text-black' : 'text-text-secondary hover:text-white'
          }`}
          data-testid="home-form-tab-btn"
        >
          {homeTeam?.short_code || 'Home'} Form
        </button>
        <button
          onClick={() => setActiveTab('away-form')}
          className={`flex-1 py-2 px-4 rounded-md font-heading font-bold uppercase text-sm transition-all ${
            activeTab === 'away-form' ? 'bg-primary text-black' : 'text-text-secondary hover:text-white'
          }`}
          data-testid="away-form-tab-btn"
        >
          {awayTeam?.short_code || 'Away'} Form
        </button>
      </div>

      {/* H2H Tab Content */}
      {activeTab === 'h2h' && (
        <div>
          {h2hLoading ? (
            <LoadingSpinner />
          ) : h2hError ? (
            <p className="text-text-tertiary text-center py-8">Failed to load head-to-head data</p>
          ) : h2hMatches.length === 0 ? (
            <p className="text-text-tertiary text-center py-8">No previous meetings found</p>
          ) : (
            <>
              {/* H2H Summary Stats */}
              {h2hStats && (
                <div className="bg-background-paper border border-border rounded-lg p-4 mb-6">
                  <h4 className="font-heading font-bold uppercase text-sm text-text-tertiary mb-4 text-center">
                    Last {h2hStats.total} Meetings
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {homeTeam?.image_path && (
                          <img src={homeTeam.image_path} alt="" className="w-8 h-8 object-contain" />
                        )}
                      </div>
                      <p className="font-data text-3xl font-bold text-primary">{h2hStats.homeWins}</p>
                      <p className="text-xs text-text-tertiary uppercase">Wins</p>
                    </div>
                    <div>
                      <p className="font-data text-3xl font-bold text-text-secondary mb-2 mt-5">{h2hStats.draws}</p>
                      <p className="text-xs text-text-tertiary uppercase">Draws</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {awayTeam?.image_path && (
                          <img src={awayTeam.image_path} alt="" className="w-8 h-8 object-contain" />
                        )}
                      </div>
                      <p className="font-data text-3xl font-bold text-secondary">{h2hStats.awayWins}</p>
                      <p className="text-xs text-text-tertiary uppercase">Wins</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-border text-sm">
                    <span className="text-text-tertiary">Total Goals: <span className="text-primary font-data">{h2hStats.homeGoals}</span></span>
                    <span className="text-text-tertiary">Total Goals: <span className="text-secondary font-data">{h2hStats.awayGoals}</span></span>
                  </div>
                </div>
              )}
              
              {/* H2H Matches List */}
              <div>
                <h4 className="font-heading font-bold uppercase text-sm text-text-tertiary mb-4">
                  Previous Meetings
                </h4>
                {h2hMatches.map((match, idx) => (
                  <H2HMatchCard 
                    key={match.id || idx} 
                    fixture={match} 
                    showDetails={idx === 0}
                    currentLineups={currentLineups}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Home Team Form Tab */}
      {activeTab === 'home-form' && (
        <TeamFormSection 
          teamId={homeTeam?.id}
          teamName={homeTeam?.name}
          teamLogo={homeTeam?.image_path}
          currentLineups={currentLineups}
        />
      )}

      {/* Away Team Form Tab */}
      {activeTab === 'away-form' && (
        <TeamFormSection 
          teamId={awayTeam?.id}
          teamName={awayTeam?.name}
          teamLogo={awayTeam?.image_path}
          currentLineups={currentLineups}
        />
      )}
    </div>
  );
};

export default HeadToHeadSection;
