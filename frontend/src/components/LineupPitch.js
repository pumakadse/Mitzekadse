import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Football pitch SVG background
const PitchSVG = () => (
  <svg viewBox="0 0 100 70" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Pitch background */}
    <rect x="0" y="0" width="100" height="70" fill="#1a472a" />
    
    {/* Pitch outline */}
    <rect x="2" y="2" width="96" height="66" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    
    {/* Center line */}
    <line x1="50" y1="2" x2="50" y2="68" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    
    {/* Center circle */}
    <circle cx="50" cy="35" r="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <circle cx="50" cy="35" r="0.5" fill="rgba(255,255,255,0.3)" />
    
    {/* Left penalty area */}
    <rect x="2" y="18" width="16" height="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    {/* Left goal area */}
    <rect x="2" y="26" width="6" height="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    {/* Left penalty arc */}
    <path d="M 18 28 A 9 9 0 0 1 18 42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    {/* Left penalty spot */}
    <circle cx="12" cy="35" r="0.4" fill="rgba(255,255,255,0.3)" />
    
    {/* Right penalty area */}
    <rect x="82" y="18" width="16" height="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    {/* Right goal area */}
    <rect x="92" y="26" width="6" height="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    {/* Right penalty arc */}
    <path d="M 82 28 A 9 9 0 0 0 82 42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    {/* Right penalty spot */}
    <circle cx="88" cy="35" r="0.4" fill="rgba(255,255,255,0.3)" />
    
    {/* Corner arcs */}
    <path d="M 2 5 A 3 3 0 0 0 5 2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <path d="M 95 2 A 3 3 0 0 0 98 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <path d="M 2 65 A 3 3 0 0 1 5 68" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <path d="M 95 68 A 3 3 0 0 1 98 65" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
  </svg>
);

// Player marker component
const PlayerMarker = ({ player, x, y, isHome, delay = 0, isHighlighted = false, onClick }) => {
  const displayName = player?.player?.display_name || player?.player_name || player?.display_name || 'Unknown';
  const shortName = displayName.split(' ').pop() || displayName.substring(0, 8);
  const jerseyNumber = player?.jersey_number || '?';
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay * 0.05, type: 'spring', stiffness: 200 }}
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={() => onClick && onClick(player)}
      data-testid={`player-marker-${jerseyNumber}`}
    >
      {/* Jersey circle */}
      <div 
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-data font-bold text-sm sm:text-base shadow-lg transition-transform group-hover:scale-110 ${
          isHighlighted 
            ? 'ring-2 ring-accent ring-offset-1 ring-offset-transparent'
            : ''
        }`}
        style={{
          background: isHome 
            ? 'linear-gradient(135deg, #00FF88 0%, #00CC6A 100%)' 
            : 'linear-gradient(135deg, #FF0055 0%, #CC0044 100%)',
          color: isHome ? '#000' : '#FFF',
        }}
      >
        {jerseyNumber}
      </div>
      
      {/* Player name */}
      <div className={`mt-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium text-center max-w-[60px] sm:max-w-[80px] truncate ${
        isHighlighted ? 'bg-accent text-black' : 'bg-black/70 text-white'
      }`}>
        {shortName}
      </div>
      
      {/* Captain badge */}
      {player?.captain && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-black rounded-full flex items-center justify-center text-[8px] font-bold">
          C
        </div>
      )}
    </motion.div>
  );
};

// Parse formation string like "4-4-2" or "4-3-3"
const parseFormation = (formationStr) => {
  if (!formationStr) return [4, 4, 2]; // Default
  const parts = formationStr.split('-').map(n => parseInt(n) || 0);
  return parts.length >= 2 ? parts : [4, 4, 2];
};

// Get player positions based on formation
const getFormationPositions = (formation, isHome = true) => {
  const positions = [];
  const parts = parseFormation(formation);
  const totalRows = parts.length + 1; // +1 for goalkeeper
  
  // Goalkeeper position
  positions.push({ row: 0, col: 0, total: 1 });
  
  // Field player positions by row
  parts.forEach((count, rowIndex) => {
    for (let i = 0; i < count; i++) {
      positions.push({ row: rowIndex + 1, col: i, total: count });
    }
  });
  
  // Convert to x,y percentages
  return positions.map((pos, idx) => {
    const rowPercent = isHome 
      ? 8 + (pos.row * (42 / totalRows)) // Home team on left side (8% to 50%)
      : 92 - (pos.row * (42 / totalRows)); // Away team on right side (50% to 92%)
    
    // Distribute players evenly in their row
    const spacing = 60 / (pos.total + 1);
    const yPercent = 20 + (spacing * (pos.col + 1));
    
    return { x: rowPercent, y: yPercent, index: idx };
  });
};

// Try to determine position from position name
const getPositionCategory = (positionName) => {
  if (!positionName) return 'midfielder';
  const name = positionName.toLowerCase();
  
  if (name.includes('goalkeeper') || name.includes('keeper') || name === 'gk') return 'goalkeeper';
  if (name.includes('defender') || name.includes('back') || name === 'cb' || name === 'lb' || name === 'rb') return 'defender';
  if (name.includes('midfielder') || name.includes('mid') || name === 'cm' || name === 'dm' || name === 'am') return 'midfielder';
  if (name.includes('forward') || name.includes('striker') || name.includes('winger') || name === 'cf' || name === 'st' || name === 'lw' || name === 'rw') return 'forward';
  
  return 'midfielder';
};

// Sort players by position for lineup display
const sortPlayersByPosition = (players) => {
  const positionOrder = { goalkeeper: 0, defender: 1, midfielder: 2, forward: 3 };
  
  return [...players].sort((a, b) => {
    const posA = a.position?.name || a.player?.position?.name || '';
    const posB = b.position?.name || b.player?.position?.name || '';
    
    const catA = getPositionCategory(posA);
    const catB = getPositionCategory(posB);
    
    return positionOrder[catA] - positionOrder[catB];
  });
};

// Main LineupPitch component
export const LineupPitch = ({ 
  homeLineup = [], 
  awayLineup = [], 
  homeTeam, 
  awayTeam,
  homeFormation = '4-4-2',
  awayFormation = '4-4-2',
  highlightedPlayers = [],
  onPlayerClick
}) => {
  // Sort and limit to starting 11
  const homeStarters = useMemo(() => {
    const sorted = sortPlayersByPosition(homeLineup);
    return sorted.slice(0, 11);
  }, [homeLineup]);
  
  const awayStarters = useMemo(() => {
    const sorted = sortPlayersByPosition(awayLineup);
    return sorted.slice(0, 11);
  }, [awayLineup]);
  
  const homePositions = useMemo(() => getFormationPositions(homeFormation, true), [homeFormation]);
  const awayPositions = useMemo(() => getFormationPositions(awayFormation, false), [awayFormation]);

  const isHighlighted = (player) => {
    const playerId = player?.player_id || player?.player?.id || player?.id;
    return highlightedPlayers.includes(playerId);
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: '100/70' }} data-testid="lineup-pitch">
      {/* Pitch background */}
      <PitchSVG />
      
      {/* Team labels */}
      <div className="absolute top-2 left-4 flex items-center gap-2 z-10">
        {homeTeam?.image_path && (
          <img src={homeTeam.image_path} alt="" className="w-6 h-6 object-contain" />
        )}
        <span className="text-white text-xs font-heading font-bold uppercase bg-black/50 px-2 py-0.5 rounded">
          {homeFormation}
        </span>
      </div>
      
      <div className="absolute top-2 right-4 flex items-center gap-2 z-10">
        <span className="text-white text-xs font-heading font-bold uppercase bg-black/50 px-2 py-0.5 rounded">
          {awayFormation}
        </span>
        {awayTeam?.image_path && (
          <img src={awayTeam.image_path} alt="" className="w-6 h-6 object-contain" />
        )}
      </div>
      
      {/* Home team players */}
      {homeStarters.map((player, idx) => {
        const pos = homePositions[idx] || { x: 25, y: 50 };
        return (
          <PlayerMarker
            key={`home-${player.player_id || player.id || idx}`}
            player={player}
            x={pos.x}
            y={pos.y}
            isHome={true}
            delay={idx}
            isHighlighted={isHighlighted(player)}
            onClick={onPlayerClick}
          />
        );
      })}
      
      {/* Away team players */}
      {awayStarters.map((player, idx) => {
        const pos = awayPositions[idx] || { x: 75, y: 50 };
        return (
          <PlayerMarker
            key={`away-${player.player_id || player.id || idx}`}
            player={player}
            x={pos.x}
            y={pos.y}
            isHome={false}
            delay={idx + 11}
            isHighlighted={isHighlighted(player)}
            onClick={onPlayerClick}
          />
        );
      })}
      
      {/* Center line indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/20 font-heading text-4xl font-black pointer-events-none">
        VS
      </div>
    </div>
  );
};

// Substitutes list component
export const SubstitutesList = ({ substitutes, teamName, teamLogo, isHome = true }) => {
  if (!substitutes || substitutes.length === 0) return null;
  
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        {teamLogo && <img src={teamLogo} alt="" className="w-4 h-4 object-contain" />}
        <span className="text-xs text-text-tertiary uppercase font-bold">Substitutes</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {substitutes.map((player, idx) => {
          const displayName = player?.player?.display_name || player?.player_name || player?.display_name || 'Unknown';
          const shortName = displayName.split(' ').pop();
          const jerseyNumber = player?.jersey_number || '?';
          
          return (
            <div 
              key={`sub-${player.player_id || player.id || idx}`}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                isHome ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
              }`}
            >
              <span className="font-data font-bold">{jerseyNumber}</span>
              <span>{shortName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Combined lineup view with pitch and subs
export const FullLineupView = ({
  homeLineup = [],
  awayLineup = [],
  homeTeam,
  awayTeam,
  homeFormation,
  awayFormation,
  highlightedPlayers = [],
  onPlayerClick
}) => {
  const homeStarters = homeLineup.slice(0, 11);
  const homeSubs = homeLineup.slice(11);
  const awayStarters = awayLineup.slice(0, 11);
  const awaySubs = awayLineup.slice(11);

  return (
    <div>
      <LineupPitch
        homeLineup={homeStarters}
        awayLineup={awayStarters}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeFormation={homeFormation}
        awayFormation={awayFormation}
        highlightedPlayers={highlightedPlayers}
        onPlayerClick={onPlayerClick}
      />
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <SubstitutesList 
          substitutes={homeSubs} 
          teamName={homeTeam?.name} 
          teamLogo={homeTeam?.image_path}
          isHome={true}
        />
        <SubstitutesList 
          substitutes={awaySubs} 
          teamName={awayTeam?.name} 
          teamLogo={awayTeam?.image_path}
          isHome={false}
        />
      </div>
    </div>
  );
};

export default LineupPitch;
