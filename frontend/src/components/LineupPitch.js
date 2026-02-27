import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Football pitch SVG background
const PitchSVG = () => (
  <svg viewBox="0 0 100 70" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
    <rect x="0" y="0" width="100" height="70" fill="#1a472a" />
    <rect x="2" y="2" width="96" height="66" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <line x1="50" y1="2" x2="50" y2="68" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <circle cx="50" cy="35" r="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <circle cx="50" cy="35" r="0.5" fill="rgba(255,255,255,0.3)" />
    <rect x="2" y="18" width="16" height="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <rect x="2" y="26" width="6" height="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <path d="M 18 28 A 9 9 0 0 1 18 42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <circle cx="12" cy="35" r="0.4" fill="rgba(255,255,255,0.3)" />
    <rect x="82" y="18" width="16" height="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <rect x="92" y="26" width="6" height="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <path d="M 82 28 A 9 9 0 0 0 82 42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <circle cx="88" cy="35" r="0.4" fill="rgba(255,255,255,0.3)" />
    <path d="M 2 5 A 3 3 0 0 0 5 2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <path d="M 95 2 A 3 3 0 0 0 98 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <path d="M 2 65 A 3 3 0 0 1 5 68" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
    <path d="M 95 68 A 3 3 0 0 1 98 65" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
  </svg>
);

// Event badge icons shown on player markers
const EventBadges = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 flex flex-col gap-0.5 z-20">
      {events.map((evt, i) => {
        if (evt.type === 'goal') {
          return (
            <div key={i} className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md" title={`Goal ${evt.minute}'`}>
              <svg viewBox="0 0 16 16" className="w-3 h-3">
                <circle cx="8" cy="8" r="7" fill="#000" stroke="#fff" strokeWidth="0.5"/>
                <path d="M8 1.5 L9.5 5.5 L13.5 5.5 L10.5 8.5 L11.5 12.5 L8 10 L4.5 12.5 L5.5 8.5 L2.5 5.5 L6.5 5.5 Z" fill="#fff" opacity="0.3"/>
              </svg>
            </div>
          );
        }
        if (evt.type === 'yellowcard') {
          return <div key={i} className="w-3 h-4 rounded-[1px] bg-yellow-400 shadow-md" title={`Yellow card ${evt.minute}'`} />;
        }
        if (evt.type === 'redcard') {
          return <div key={i} className="w-3 h-4 rounded-[1px] bg-red-600 shadow-md" title={`Red card ${evt.minute}'`} />;
        }
        if (evt.type === 'yellowred') {
          return (
            <div key={i} className="relative w-4 h-4" title={`2nd Yellow ${evt.minute}'`}>
              <div className="absolute left-0 top-0 w-3 h-4 rounded-[1px] bg-yellow-400 shadow-md" />
              <div className="absolute left-1 top-0.5 w-3 h-4 rounded-[1px] bg-red-600 shadow-md" />
            </div>
          );
        }
        if (evt.type === 'assist') {
          return (
            <div key={i} className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shadow-md text-[7px] text-white font-bold" title={`Assist ${evt.minute}'`}>
              A
            </div>
          );
        }
        if (evt.type === 'subout') {
          return (
            <div key={i} className="w-4 h-4 rounded-full bg-red-500/80 flex items-center justify-center shadow-md" title={`Subbed off ${evt.minute}'`}>
              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white"><path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          );
        }
        if (evt.type === 'subin') {
          return (
            <div key={i} className="w-4 h-4 rounded-full bg-green-500/80 flex items-center justify-center shadow-md" title={`Subbed in ${evt.minute}'`}>
              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

// Player marker with face, events, and name
const PlayerMarker = ({ player, x, y, isHome, delay = 0, events = [], onClick }) => {
  const displayName = player?.player?.display_name || player?.player_name || player?.display_name || 'Unknown';
  const shortName = displayName.split(' ').pop() || displayName.substring(0, 8);
  const jerseyNumber = player?.jersey_number || '?';
  const imagePath = player?.player?.image_path || null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay * 0.04, type: 'spring', stiffness: 200 }}
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={() => onClick && onClick(player)}
      data-testid={`player-marker-${jerseyNumber}`}
    >
      {/* Player circle with face or jersey number */}
      <div className="relative">
        {imagePath ? (
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 shadow-lg transition-transform group-hover:scale-110"
            style={{
              borderColor: isHome ? '#00FF88' : '#FF0055',
            }}
          >
            <img
              src={imagePath}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center font-bold text-sm" style="background:${isHome ? 'linear-gradient(135deg,#00FF88,#00CC6A)' : 'linear-gradient(135deg,#FF0055,#CC0044)'};color:${isHome ? '#000' : '#FFF'}">${jerseyNumber}</div>`; }}
            />
          </div>
        ) : (
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-data font-bold text-sm sm:text-base shadow-lg transition-transform group-hover:scale-110"
            style={{
              background: isHome
                ? 'linear-gradient(135deg, #00FF88 0%, #00CC6A 100%)'
                : 'linear-gradient(135deg, #FF0055 0%, #CC0044 100%)',
              color: isHome ? '#000' : '#FFF',
            }}
          >
            {jerseyNumber}
          </div>
        )}
        {/* Event badges */}
        <EventBadges events={events} />
        {/* Jersey number badge */}
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-data font-bold text-[9px] shadow-md z-10 border border-black/30"
          style={{
            background: isHome ? '#00CC6A' : '#CC0044',
            color: isHome ? '#000' : '#FFF',
          }}
        >
          {jerseyNumber}
        </div>
        {/* Captain badge */}
        {player?.captain && (
          <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-yellow-500 text-black rounded-full flex items-center justify-center text-[7px] font-black shadow z-10">
            C
          </div>
        )}
      </div>

      {/* Player name */}
      <div className="mt-0.5 px-1 py-px rounded text-[9px] sm:text-[11px] font-medium text-center max-w-[55px] sm:max-w-[75px] truncate bg-black/80 text-white">
        {shortName}
      </div>
    </motion.div>
  );
};

// Get player coordinates from formation_field
const getPlayerCoordinates = (player, formation, isHome, index) => {
  const formationField = player?.formation_field;
  const parts = formation?.split('-').map(n => parseInt(n) || 0) || [4, 4, 2];
  const numSegments = parts.length; // 2, 3, or 4 segments (+ GK row)

  if (formationField && formationField.includes(':')) {
    const [row, col] = formationField.split(':').map(n => parseInt(n) || 1);

    let maxColsInRow;
    if (row === 1) {
      maxColsInRow = 1; // GK
    } else {
      const segIndex = row - 2; // 0-based index into parts
      maxColsInRow = (segIndex >= 0 && segIndex < parts.length) ? parts[segIndex] : 4;
    }

    // Y position (vertical spread across pitch width)
    let yPercent;
    if (maxColsInRow === 1) {
      yPercent = 50;
    } else if (row === numSegments + 1) {
      // Last row (strikers): center them closer together
      if (maxColsInRow === 2) {
        yPercent = col === 1 ? 40 : 60;
      } else if (maxColsInRow === 3) {
        yPercent = 30 + ((col - 1) / 2) * 40;
      } else {
        yPercent = 85 - ((col - 1) / (maxColsInRow - 1)) * 70;
      }
    } else {
      // All other rows: spread 85 -> 15 (col 1=top, col max=bottom)
      if (maxColsInRow === 1) {
        yPercent = 50;
      } else {
        yPercent = 85 - ((col - 1) / (maxColsInRow - 1)) * 70;
      }
    }

    // X position (horizontal depth) - dynamic based on number of formation segments
    const totalRows = numSegments + 1; // +1 for GK
    let xPercent;
    if (isHome) {
      // Home on left: GK at 5%, most forward at ~45%
      const xRange = 40; // from 5 to 45
      xPercent = 5 + ((row - 1) / (totalRows - 1)) * xRange;
    } else {
      // Away on right: GK at 95%, most forward at ~55%
      const xRange = 40;
      xPercent = 95 - ((row - 1) / (totalRows - 1)) * xRange;
    }

    return { x: xPercent, y: yPercent };
  }

  // Fallback: spread evenly
  const rowIdx = Math.floor(index / 4);
  const colIdx = index % 4;
  return {
    x: isHome ? (10 + rowIdx * 12) : (90 - rowIdx * 12),
    y: 18 + (colIdx * 20),
  };
};

// Build player event map from fixture events
const buildPlayerEventMap = (events, lineups) => {
  const map = {}; // player_id -> [{ type, minute }]

  if (!events) return map;

  for (const evt of events) {
    const playerId = evt.player_id;
    const relatedId = evt.related_player_id;
    const typeId = evt.type_id;
    const minute = evt.minute || 0;
    const info = (evt.info || '').toLowerCase();
    const addition = (evt.addition || '').toLowerCase();

    if (typeId === 14) {
      // Goal
      if (playerId) {
        if (!map[playerId]) map[playerId] = [];
        map[playerId].push({ type: 'goal', minute });
      }
      // Assist (related_player on goal events)
      if (relatedId) {
        if (!map[relatedId]) map[relatedId] = [];
        map[relatedId].push({ type: 'assist', minute });
      }
    } else if (typeId === 19) {
      // Card
      if (playerId) {
        if (!map[playerId]) map[playerId] = [];
        if (addition.includes('2nd yellow') || info.includes('2nd yellow')) {
          map[playerId].push({ type: 'yellowred', minute });
        } else if (addition.includes('red') || info.includes('red')) {
          map[playerId].push({ type: 'redcard', minute });
        } else {
          map[playerId].push({ type: 'yellowcard', minute });
        }
      }
    } else if (typeId === 18) {
      // Substitution: player = coming on, related = going off
      if (playerId) {
        if (!map[playerId]) map[playerId] = [];
        map[playerId].push({ type: 'subin', minute });
      }
      if (relatedId) {
        if (!map[relatedId]) map[relatedId] = [];
        map[relatedId].push({ type: 'subout', minute });
      }
    }
  }

  return map;
};

// Main LineupPitch component
export const LineupPitch = ({
  homeLineup = [],
  awayLineup = [],
  homeTeam,
  awayTeam,
  homeFormation = '4-4-2',
  awayFormation = '4-4-2',
  events = [],
  onPlayerClick
}) => {
  const homeStarters = useMemo(() => {
    const starters = homeLineup.filter(p => p.type_id === 11);
    return starters.sort((a, b) => (a.formation_position || 99) - (b.formation_position || 99)).slice(0, 11);
  }, [homeLineup]);

  const awayStarters = useMemo(() => {
    const starters = awayLineup.filter(p => p.type_id === 11);
    return starters.sort((a, b) => (a.formation_position || 99) - (b.formation_position || 99)).slice(0, 11);
  }, [awayLineup]);

  const playerEventMap = useMemo(() => buildPlayerEventMap(events, [...homeLineup, ...awayLineup]), [events, homeLineup, awayLineup]);

  return (
    <div className="relative w-full" style={{ aspectRatio: '100/70' }} data-testid="lineup-pitch">
      <PitchSVG />

      {/* Team formation labels */}
      <div className="absolute top-2 left-4 flex items-center gap-2 z-10">
        {homeTeam?.image_path && <img src={homeTeam.image_path} alt="" className="w-6 h-6 object-contain" />}
        <span className="text-white text-xs font-heading font-bold uppercase bg-black/50 px-2 py-0.5 rounded">
          {homeFormation}
        </span>
      </div>
      <div className="absolute top-2 right-4 flex items-center gap-2 z-10">
        <span className="text-white text-xs font-heading font-bold uppercase bg-black/50 px-2 py-0.5 rounded">
          {awayFormation}
        </span>
        {awayTeam?.image_path && <img src={awayTeam.image_path} alt="" className="w-6 h-6 object-contain" />}
      </div>

      {/* Home team players */}
      {homeStarters.map((player, idx) => {
        const pos = getPlayerCoordinates(player, homeFormation, true, idx);
        const pid = player.player_id || player.id;
        return (
          <PlayerMarker
            key={`home-${pid || idx}`}
            player={player}
            x={pos.x}
            y={pos.y}
            isHome={true}
            delay={idx}
            events={playerEventMap[pid] || []}
            onClick={onPlayerClick}
          />
        );
      })}

      {/* Away team players */}
      {awayStarters.map((player, idx) => {
        const pos = getPlayerCoordinates(player, awayFormation, false, idx);
        const pid = player.player_id || player.id;
        return (
          <PlayerMarker
            key={`away-${pid || idx}`}
            player={player}
            x={pos.x}
            y={pos.y}
            isHome={false}
            delay={idx + 11}
            events={playerEventMap[pid] || []}
            onClick={onPlayerClick}
          />
        );
      })}

      {/* Center VS */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/15 font-heading text-4xl font-black pointer-events-none select-none">
        VS
      </div>
    </div>
  );
};

// Substitute player shown in bench area
const SubPlayer = ({ player, isHome, events = [], onClick }) => {
  const displayName = player?.player?.display_name || player?.player_name || player?.display_name || 'Unknown';
  const shortName = displayName.split(' ').pop();
  const jerseyNumber = player?.jersey_number || '?';
  const imagePath = player?.player?.image_path || null;

  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer transition-colors"
      onClick={() => onClick && onClick(player)}
      data-testid={`sub-player-${jerseyNumber}`}
    >
      {/* Mini face or number */}
      <div className="relative flex-shrink-0">
        {imagePath ? (
          <div
            className="w-7 h-7 rounded-full overflow-hidden border-[1.5px]"
            style={{ borderColor: isHome ? '#00FF88' : '#FF0055' }}
          >
            <img src={imagePath} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-data font-bold text-xs"
            style={{
              background: isHome
                ? 'linear-gradient(135deg, #00FF88, #00CC6A)'
                : 'linear-gradient(135deg, #FF0055, #CC0044)',
              color: isHome ? '#000' : '#FFF',
            }}
          >
            {jerseyNumber}
          </div>
        )}
        {/* Mini event badges */}
        {events.length > 0 && (
          <div className="absolute -top-0.5 -right-0.5 flex gap-px">
            {events.slice(0, 2).map((evt, i) => {
              if (evt.type === 'goal') return <div key={i} className="w-2.5 h-2.5 rounded-full bg-white shadow" />;
              if (evt.type === 'yellowcard') return <div key={i} className="w-2 h-2.5 rounded-[1px] bg-yellow-400 shadow" />;
              if (evt.type === 'redcard' || evt.type === 'yellowred') return <div key={i} className="w-2 h-2.5 rounded-[1px] bg-red-600 shadow" />;
              if (evt.type === 'assist') return <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow" />;
              return null;
            })}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <span className="text-xs font-medium text-text-primary truncate block">{shortName}</span>
        {events.some(e => e.type === 'subin') && (
          <span className="text-[9px] text-green-400">
            {events.find(e => e.type === 'subin')?.minute}'
          </span>
        )}
      </div>
    </div>
  );
};

// Substitutes bench section
export const SubstitutesList = ({ substitutes, teamName, teamLogo, isHome = true, playerEventMap = {}, onPlayerClick }) => {
  if (!substitutes || substitutes.length === 0) return null;

  // Sort: subs who entered the game first
  const sorted = [...substitutes].sort((a, b) => {
    const aIn = (playerEventMap[a.player_id] || []).some(e => e.type === 'subin');
    const bIn = (playerEventMap[b.player_id] || []).some(e => e.type === 'subin');
    if (aIn && !bIn) return -1;
    if (!aIn && bIn) return 1;
    return 0;
  });

  const usedSubs = sorted.filter(p => (playerEventMap[p.player_id] || []).some(e => e.type === 'subin'));
  const benchSubs = sorted.filter(p => !(playerEventMap[p.player_id] || []).some(e => e.type === 'subin'));

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {teamLogo && <img src={teamLogo} alt="" className="w-4 h-4 object-contain" />}
        <span className="text-xs text-text-tertiary uppercase font-bold tracking-wide">Substitutes</span>
      </div>

      {/* Subs who entered the game */}
      {usedSubs.length > 0 && (
        <div className="mb-2">
          <p className="text-[10px] text-green-400 uppercase tracking-wide mb-1 font-semibold">Entered</p>
          <div className="grid grid-cols-1 gap-0.5">
            {usedSubs.map((player, idx) => (
              <SubPlayer
                key={`used-${player.player_id || idx}`}
                player={player}
                isHome={isHome}
                events={playerEventMap[player.player_id] || []}
                onClick={onPlayerClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bench (unused subs) */}
      {benchSubs.length > 0 && (
        <div>
          {usedSubs.length > 0 && <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1 font-semibold">Bench</p>}
          <div className="grid grid-cols-1 gap-0.5">
            {benchSubs.map((player, idx) => (
              <SubPlayer
                key={`bench-${player.player_id || idx}`}
                player={player}
                isHome={isHome}
                events={playerEventMap[player.player_id] || []}
                onClick={onPlayerClick}
              />
            ))}
          </div>
        </div>
      )}
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
  events = [],
  onPlayerClick
}) => {
  const homeSubs = homeLineup.filter(p => p.type_id === 12);
  const awaySubs = awayLineup.filter(p => p.type_id === 12);
  const playerEventMap = useMemo(() => buildPlayerEventMap(events, [...homeLineup, ...awayLineup]), [events, homeLineup, awayLineup]);

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mb-3 text-[10px] text-text-tertiary">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-white shadow" /><span>Goal</span></div>
        <div className="flex items-center gap-1"><div className="w-2.5 h-3 rounded-[1px] bg-yellow-400 shadow" /><span>Yellow</span></div>
        <div className="flex items-center gap-1"><div className="w-2.5 h-3 rounded-[1px] bg-red-600 shadow" /><span>Red</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500 shadow" /><span>Assist</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500/80 shadow flex items-center justify-center"><span className="text-white text-[6px]">-</span></div><span>Sub out</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500/80 shadow flex items-center justify-center"><span className="text-white text-[6px]">+</span></div><span>Sub in</span></div>
      </div>

      <LineupPitch
        homeLineup={homeLineup}
        awayLineup={awayLineup}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeFormation={homeFormation}
        awayFormation={awayFormation}
        events={events}
        onPlayerClick={onPlayerClick}
      />

      {/* Substitutes bench */}
      {(homeSubs.length > 0 || awaySubs.length > 0) && (
        <div className="grid grid-cols-2 gap-4 mt-4 bg-background-subtle/50 rounded-lg p-3">
          <SubstitutesList
            substitutes={homeSubs}
            teamName={homeTeam?.name}
            teamLogo={homeTeam?.image_path}
            isHome={true}
            playerEventMap={playerEventMap}
            onPlayerClick={onPlayerClick}
          />
          <SubstitutesList
            substitutes={awaySubs}
            teamName={awayTeam?.name}
            teamLogo={awayTeam?.image_path}
            isHome={false}
            playerEventMap={playerEventMap}
            onPlayerClick={onPlayerClick}
          />
        </div>
      )}
    </div>
  );
};

export default LineupPitch;
