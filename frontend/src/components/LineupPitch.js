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

// Formation position mapping - maps formation_position to actual pitch coordinates
// Formation positions are typically numbered 1-11 in a specific pattern
// Position 1 = GK, then defenders, midfielders, forwards
const getPositionCoordinates = (formationPosition, formation, isHome) => {
  // Parse formation like "4-4-2", "4-3-3", "3-5-2"
  const parts = formation?.split('-').map(n => parseInt(n) || 0) || [4, 4, 2];
  
  // Standard formation position mapping based on common formations
  // The formation_position field from Sportmonks follows this pattern:
  // 1 = GK
  // 2-5 = Defenders (depending on formation)
  // 6-8 or 6-10 = Midfielders
  // 9-11 = Forwards
  
  const positionMap = {
    // Formation positions for different formations
    // Each position maps to { row, col } where row is depth (0=GK, 4=striker)
    // and col is left-right position
    
    // 4-4-2 standard
    '4-4-2': {
      1: { row: 0, col: 0.5 },   // GK
      2: { row: 1, col: 0 },     // RB
      3: { row: 1, col: 0.33 },  // RCB
      4: { row: 1, col: 0.66 },  // LCB
      5: { row: 1, col: 1 },     // LB
      6: { row: 2, col: 0 },     // RM
      7: { row: 2, col: 0.33 },  // RCM
      8: { row: 2, col: 0.66 },  // LCM
      9: { row: 2, col: 1 },     // LM
      10: { row: 3, col: 0.33 }, // RS
      11: { row: 3, col: 0.66 }, // LS
    },
    // 4-3-3 
    '4-3-3': {
      1: { row: 0, col: 0.5 },   // GK
      2: { row: 1, col: 0 },     // RB
      3: { row: 1, col: 0.33 },  // RCB
      4: { row: 1, col: 0.66 },  // LCB
      5: { row: 1, col: 1 },     // LB
      6: { row: 2, col: 0.25 },  // RCM
      7: { row: 2, col: 0.5 },   // CM
      8: { row: 2, col: 0.75 },  // LCM
      9: { row: 3, col: 0 },     // RW
      10: { row: 3, col: 0.5 },  // ST
      11: { row: 3, col: 1 },    // LW
    },
    // 3-5-2
    '3-5-2': {
      1: { row: 0, col: 0.5 },   // GK
      2: { row: 1, col: 0.17 },  // RCB
      3: { row: 1, col: 0.5 },   // CB
      4: { row: 1, col: 0.83 },  // LCB
      5: { row: 2, col: 0 },     // RWB
      6: { row: 2, col: 0.25 },  // RCM
      7: { row: 2, col: 0.5 },   // CM
      8: { row: 2, col: 0.75 },  // LCM
      9: { row: 2, col: 1 },     // LWB
      10: { row: 3, col: 0.33 }, // RS
      11: { row: 3, col: 0.66 }, // LS
    },
    // 4-2-3-1
    '4-2-3-1': {
      1: { row: 0, col: 0.5 },   // GK
      2: { row: 1, col: 0 },     // RB
      3: { row: 1, col: 0.33 },  // RCB
      4: { row: 1, col: 0.66 },  // LCB
      5: { row: 1, col: 1 },     // LB
      6: { row: 2, col: 0.33 },  // RDM
      7: { row: 2, col: 0.66 },  // LDM
      8: { row: 2.5, col: 0 },   // RAM
      9: { row: 2.5, col: 0.5 }, // CAM
      10: { row: 2.5, col: 1 },  // LAM
      11: { row: 3.5, col: 0.5 }, // ST
    },
    // 5-3-2
    '5-3-2': {
      1: { row: 0, col: 0.5 },   // GK
      2: { row: 1, col: 0 },     // RWB
      3: { row: 1, col: 0.25 },  // RCB
      4: { row: 1, col: 0.5 },   // CB
      5: { row: 1, col: 0.75 },  // LCB
      6: { row: 1, col: 1 },     // LWB
      7: { row: 2, col: 0.25 },  // RCM
      8: { row: 2, col: 0.5 },   // CM
      9: { row: 2, col: 0.75 },  // LCM
      10: { row: 3, col: 0.33 }, // RS
      11: { row: 3, col: 0.66 }, // LS
    },
    // 3-4-3
    '3-4-3': {
      1: { row: 0, col: 0.5 },   // GK
      2: { row: 1, col: 0.17 },  // RCB
      3: { row: 1, col: 0.5 },   // CB
      4: { row: 1, col: 0.83 },  // LCB
      5: { row: 2, col: 0 },     // RM
      6: { row: 2, col: 0.33 },  // RCM
      7: { row: 2, col: 0.66 },  // LCM
      8: { row: 2, col: 1 },     // LM
      9: { row: 3, col: 0 },     // RW
      10: { row: 3, col: 0.5 },  // ST
      11: { row: 3, col: 1 },    // LW
    }
  };
  
  // Get the position map for this formation, or default to 4-4-2
  const map = positionMap[formation] || positionMap['4-4-2'];
  const pos = map[formationPosition] || { row: 2, col: 0.5 }; // Default to center midfield
  
  // Convert row/col to actual pitch percentages
  // Row: 0=GK (near goal), 3-4=Forwards (near opponent goal)
  // For home team (left side): GK at ~8%, forwards at ~45%
  // For away team (right side): GK at ~92%, forwards at ~55%
  
  let xPercent, yPercent;
  
  if (isHome) {
    // Home team on left side, attacking right
    xPercent = 8 + (pos.row * 10); // GK at 8%, forwards at ~38%
    yPercent = 15 + (pos.col * 55); // 15% to 70% vertically
  } else {
    // Away team on right side, attacking left
    xPercent = 92 - (pos.row * 10); // GK at 92%, forwards at ~62%
    yPercent = 15 + (pos.col * 55); // 15% to 70% vertically
  }
  
  return { x: xPercent, y: yPercent };
};

// Get position category from position name or position ID
const getPositionFromName = (positionName, positionId) => {
  if (!positionName && !positionId) return { row: 2, col: 0.5 };
  
  const name = (positionName || '').toLowerCase();
  
  // Goalkeeper
  if (name.includes('goalkeeper') || name.includes('keeper') || positionId === 24) {
    return { row: 0, col: 0.5 };
  }
  
  // Defenders
  if (name.includes('right-back') || name.includes('right back') || positionId === 25) {
    return { row: 1, col: 0.15 };
  }
  if (name.includes('left-back') || name.includes('left back') || positionId === 26) {
    return { row: 1, col: 0.85 };
  }
  if (name.includes('centre-back') || name.includes('center-back') || name.includes('central defender') || positionId === 27) {
    return { row: 1, col: 0.5 };
  }
  if (name.includes('defender')) {
    return { row: 1, col: 0.5 };
  }
  
  // Midfielders  
  if (name.includes('right') && (name.includes('midfield') || name.includes('winger'))) {
    return { row: 2, col: 0.15 };
  }
  if (name.includes('left') && (name.includes('midfield') || name.includes('winger'))) {
    return { row: 2, col: 0.85 };
  }
  if (name.includes('defensive midfield') || positionId === 28) {
    return { row: 1.5, col: 0.5 };
  }
  if (name.includes('central midfield') || name.includes('centre midfield') || positionId === 29) {
    return { row: 2, col: 0.5 };
  }
  if (name.includes('attacking midfield') || positionId === 30) {
    return { row: 2.5, col: 0.5 };
  }
  if (name.includes('midfield')) {
    return { row: 2, col: 0.5 };
  }
  
  // Forwards
  if (name.includes('right wing') || positionId === 31) {
    return { row: 3, col: 0.15 };
  }
  if (name.includes('left wing') || positionId === 32) {
    return { row: 3, col: 0.85 };
  }
  if (name.includes('striker') || name.includes('centre-forward') || name.includes('center forward') || positionId === 33) {
    return { row: 3.5, col: 0.5 };
  }
  if (name.includes('forward') || name.includes('attacker')) {
    return { row: 3, col: 0.5 };
  }
  
  return { row: 2, col: 0.5 }; // Default to center midfield
};

// Main function to get player coordinates using formation_field
const getPlayerCoordinates = (player, formation, isHome, index, totalPlayers) => {
  const formationField = player?.formation_field;
  
  // If we have formation_field like "2:3" (row:column), use it directly
  if (formationField && formationField.includes(':')) {
    const [row, col] = formationField.split(':').map(n => parseInt(n) || 1);
    
    // Determine how many columns in this row based on formation
    // Row 1 = GK (1 player)
    // Row 2 = Defenders (typically 3-5)
    // Row 3 = Midfielders (typically 3-5)
    // Row 4 = Forwards (typically 1-3)
    
    const parts = formation?.split('-').map(n => parseInt(n) || 0) || [4, 4, 2];
    let maxColsInRow;
    
    if (row === 1) {
      maxColsInRow = 1; // GK
    } else if (row === 2) {
      maxColsInRow = parts[0] || 4; // Defenders
    } else if (row === 3) {
      maxColsInRow = parts[1] || 4; // Midfielders
    } else if (row === 4) {
      maxColsInRow = parts[2] || 2; // Forwards
    } else if (row === 5 && parts.length > 3) {
      maxColsInRow = parts[3] || 1;
    } else {
      maxColsInRow = 4;
    }
    
    // Calculate Y position (vertical - spread players across the pitch width)
    // INVERTED: Column 1 = bottom (85%), Column max = top (15%)
    // This makes RB appear on the right side, LB on left side when viewing
    let yPercent;
    if (maxColsInRow === 1) {
      yPercent = 50; // Center for GK
    } else if (row === 4 && maxColsInRow <= 2) {
      // Forwards: center them more (don't spread to edges)
      // 2 strikers: positions at 35% and 65% (centered)
      if (maxColsInRow === 2) {
        yPercent = col === 1 ? 35 : 65;
      } else if (maxColsInRow === 1) {
        yPercent = 50; // Single striker in center
      } else {
        // 3 forwards: 25%, 50%, 75%
        yPercent = 25 + ((col - 1) / (maxColsInRow - 1)) * 50;
      }
    } else {
      // Defenders and Midfielders: spread from 15% to 85%
      // INVERTED: col 1 at bottom (85%), col max at top (15%)
      yPercent = 85 - ((col - 1) / (maxColsInRow - 1)) * 70;
    }
    
    // Calculate X position (horizontal - depth on pitch)
    // Row 1 = GK near own goal
    // Row 4 = Forwards near center/opponent's half
    const totalRows = parts.length + 1; // +1 for GK row
    
    let xPercent;
    if (isHome) {
      // Home team on left side
      // GK (row 1) at 6%, Defenders at ~18%, Midfielders at ~30%, Forwards at ~42%
      xPercent = 6 + ((row - 1) / (totalRows - 1)) * 38;
    } else {
      // Away team on right side  
      // GK (row 1) at 94%, Defenders at ~82%, Midfielders at ~70%, Forwards at ~58%
      xPercent = 94 - ((row - 1) / (totalRows - 1)) * 38;
    }
    
    return { x: xPercent, y: yPercent };
  }
  
  // Fallback to formation_position if formation_field not available
  const formationPosition = player?.formation_position;
  if (formationPosition && formationPosition >= 1 && formationPosition <= 11) {
    return getPositionCoordinates(formationPosition, formation, isHome);
  }
  
  // Last resort fallback - spread evenly
  const rowIdx = Math.floor(index / 4);
  const colIdx = index % 4;
  let xPercent = isHome ? (10 + rowIdx * 12) : (90 - rowIdx * 12);
  let yPercent = 18 + (colIdx * 20);
  
  return { x: xPercent, y: yPercent };
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
  // Filter to only starting XI (type_id 11) and sort by formation position
  const homeStarters = useMemo(() => {
    const starters = homeLineup.filter(p => p.type_id === 11 || (!p.type_id && homeLineup.indexOf(p) < 11));
    return starters.sort((a, b) => (a.formation_position || 99) - (b.formation_position || 99)).slice(0, 11);
  }, [homeLineup]);
  
  const awayStarters = useMemo(() => {
    const starters = awayLineup.filter(p => p.type_id === 11 || (!p.type_id && awayLineup.indexOf(p) < 11));
    return starters.sort((a, b) => (a.formation_position || 99) - (b.formation_position || 99)).slice(0, 11);
  }, [awayLineup]);

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
        const pos = getPlayerCoordinates(player, homeFormation, true, idx, homeStarters.length);
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
        const pos = getPlayerCoordinates(player, awayFormation, false, idx, awayStarters.length);
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
  // Separate starters (type_id 11) and subs (type_id 12)
  const homeSubs = homeLineup.filter(p => p.type_id === 12);
  const awaySubs = awayLineup.filter(p => p.type_id === 12);

  return (
    <div>
      <LineupPitch
        homeLineup={homeLineup}
        awayLineup={awayLineup}
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
