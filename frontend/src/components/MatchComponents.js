import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const getMatchStatus = (state) => {
  if (!state) return { text: 'TBD', type: 'scheduled' };
  
  const stateId = state.id || state.state_id;
  const stateName = state.name || state.state || '';
  
  // Finished states (check FIRST - state 5 = FT = Full Time)
  if ([5, 6, 7, 8, 9, 10, 11].includes(stateId) || stateName.toLowerCase().includes('finished') || stateName === 'FT') {
    return { text: 'FT', type: 'finished' };
  }
  
  // Live states
  if ([2, 3, 4, 25].includes(stateId) || stateName.toLowerCase().includes('live') || stateName.toLowerCase().includes('half')) {
    return { text: state.short_name || 'LIVE', type: 'live' };
  }
  
  // Scheduled
  return { text: state.short_name || 'SCH', type: 'scheduled' };
};

export const getScore = (scores, participantId, isHome) => {
  if (!scores || !Array.isArray(scores)) return '-';
  
  const currentScore = scores.find(s => 
    s.description === 'CURRENT' && 
    s.score?.participant === (isHome ? 'home' : 'away')
  );
  
  if (currentScore) return currentScore.score?.goals ?? '-';
  
  const participantScore = scores.find(s => 
    s.participant_id === participantId && s.description === 'CURRENT'
  );
  
  return participantScore?.score?.goals ?? '-';
};

export const MatchRow = ({ fixture, showLeague = false }) => {
  const navigate = useNavigate();
  
  const participants = fixture.participants || [];
  const homeTeam = participants.find(p => p.meta?.location === 'home') || participants[0];
  const awayTeam = participants.find(p => p.meta?.location === 'away') || participants[1];
  
  const status = getMatchStatus(fixture.state);
  const isLive = status.type === 'live';
  
  const homeScore = getScore(fixture.scores, homeTeam?.id, true);
  const awayScore = getScore(fixture.scores, awayTeam?.id, false);
  
  const matchTime = fixture.starting_at 
    ? new Date(fixture.starting_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`match-row ${isLive ? 'live' : ''}`}
      onClick={() => navigate(`/match/${fixture.id}`)}
      data-testid={`match-row-${fixture.id}`}
    >
      {/* Time/Status */}
      <div className="w-16 text-center">
        {isLive ? (
          <div className="flex flex-col items-center">
            <span className="font-data text-sm text-primary font-bold animate-pulse">
              {fixture.state?.clock?.minute || status.text}'
            </span>
          </div>
        ) : status.type === 'finished' ? (
          <span className="font-data text-sm text-status-finished">{status.text}</span>
        ) : (
          <span className="font-data text-sm text-text-tertiary">{matchTime}</span>
        )}
      </div>
      
      {/* Home Team */}
      <div className="flex items-center gap-3 justify-end">
        <span className="team-name text-right">{homeTeam?.name || 'TBD'}</span>
        {homeTeam?.image_path && (
          <img src={homeTeam.image_path} alt="" className="w-6 h-6 object-contain" />
        )}
      </div>
      
      {/* Score */}
      <div className="flex items-center justify-center gap-2 min-w-[80px]">
        <motion.span
          key={`home-${homeScore}`}
          initial={isLive ? { scale: 1.2, color: '#00FF88' } : false}
          animate={{ scale: 1, color: '#FFFFFF' }}
          className="score-display"
        >
          {homeScore}
        </motion.span>
        <span className="text-text-tertiary">-</span>
        <motion.span
          key={`away-${awayScore}`}
          initial={isLive ? { scale: 1.2, color: '#00FF88' } : false}
          animate={{ scale: 1, color: '#FFFFFF' }}
          className="score-display"
        >
          {awayScore}
        </motion.span>
      </div>
      
      {/* Away Team */}
      <div className="flex items-center gap-3">
        {awayTeam?.image_path && (
          <img src={awayTeam.image_path} alt="" className="w-6 h-6 object-contain" />
        )}
        <span className="team-name">{awayTeam?.name || 'TBD'}</span>
      </div>
      
      {/* League badge (optional) */}
      {showLeague && fixture.league && (
        <div className="hidden md:flex items-center gap-2 text-text-tertiary text-xs">
          {fixture.league.image_path && (
            <img src={fixture.league.image_path} alt="" className="w-4 h-4 object-contain" />
          )}
          <span className="truncate max-w-[120px]">{fixture.league.name}</span>
        </div>
      )}
    </motion.div>
  );
};

export const LeagueSection = ({ league, fixtures }) => {
  if (!fixtures || fixtures.length === 0) return null;

  return (
    <div className="mb-6" data-testid={`league-section-${league?.id}`}>
      <div className="league-header">
        {league?.image_path && (
          <img src={league.image_path} alt="" className="w-5 h-5 object-contain" />
        )}
        <div className="flex-1">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-text-primary">
            {league?.name || 'Unknown League'}
          </h3>
          <span className="text-text-tertiary text-xs">{league?.country?.name || ''}</span>
        </div>
        <span className="text-text-tertiary text-xs font-data">{fixtures.length} matches</span>
      </div>
      <div className="bg-background-paper border-x border-b border-border">
        {fixtures.map(fixture => (
          <MatchRow key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </div>
  );
};

export const MatchCard = ({ fixture }) => {
  const navigate = useNavigate();
  
  const participants = fixture.participants || [];
  const homeTeam = participants.find(p => p.meta?.location === 'home') || participants[0];
  const awayTeam = participants.find(p => p.meta?.location === 'away') || participants[1];
  
  const status = getMatchStatus(fixture.state);
  const isLive = status.type === 'live';
  
  const homeScore = getScore(fixture.scores, homeTeam?.id, true);
  const awayScore = getScore(fixture.scores, awayTeam?.id, false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card card-interactive p-4 ${isLive ? 'border-primary/30' : ''}`}
      onClick={() => navigate(`/match/${fixture.id}`)}
      data-testid={`match-card-${fixture.id}`}
    >
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {fixture.league?.image_path && (
            <img src={fixture.league.image_path} alt="" className="w-4 h-4 object-contain" />
          )}
          <span className="text-text-tertiary text-xs">{fixture.league?.name}</span>
        </div>
        {isLive ? (
          <span className="flex items-center gap-1 text-primary text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {fixture.state?.clock?.minute || 'LIVE'}'
          </span>
        ) : (
          <span className="text-text-tertiary text-xs font-data">
            {fixture.starting_at && new Date(fixture.starting_at).toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          {homeTeam?.image_path && (
            <img src={homeTeam.image_path} alt="" className="w-10 h-10 object-contain mx-auto mb-2" />
          )}
          <p className="font-heading font-bold text-sm uppercase truncate">{homeTeam?.short_code || homeTeam?.name?.substring(0, 3)}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="score-display text-3xl">{homeScore}</span>
          <span className="text-text-tertiary text-xl">:</span>
          <span className="score-display text-3xl">{awayScore}</span>
        </div>
        
        <div className="flex-1 text-center">
          {awayTeam?.image_path && (
            <img src={awayTeam.image_path} alt="" className="w-10 h-10 object-contain mx-auto mb-2" />
          )}
          <p className="font-heading font-bold text-sm uppercase truncate">{awayTeam?.short_code || awayTeam?.name?.substring(0, 3)}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && <Icon size={48} className="text-text-tertiary mb-4" strokeWidth={1} />}
      <h3 className="font-heading font-bold text-xl text-text-secondary mb-2">{title}</h3>
      {description && <p className="text-text-tertiary text-sm max-w-md">{description}</p>}
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full animate-spin`} />
    </div>
  );
};

export default MatchRow;
