import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Users, Calendar, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { LoadingSpinner, EmptyState } from '../components/MatchComponents';
import { useTeam } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const TeamProfile = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { data: team, loading, error } = useTeam(teamId);
  const { isAuthenticated, isFavoriteTeam, addFavoriteTeam, removeFavoriteTeam } = useAuth();

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error || !team) {
    return (
      <Layout>
        <EmptyState
          icon={Users}
          title="Team Not Found"
          description="Unable to load team details"
        />
      </Layout>
    );
  }

  const players = team.squad || team.players || [];
  const venue = team.venue;

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

        {/* Team Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
          data-testid="team-header"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {team.image_path && (
              <img src={team.image_path} alt="" className="w-24 h-24 object-contain" />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-heading font-black text-3xl uppercase tracking-tight mb-2">
                {team.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-text-secondary text-sm">
                {team.short_code && (
                  <span className="bg-background-subtle px-2 py-1 rounded font-data">{team.short_code}</span>
                )}
                {team.founded && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Founded {team.founded}
                  </span>
                )}
                {venue && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {venue.name}
                  </span>
                )}
              </div>
            </div>
            
            {isAuthenticated && (
              <button
                onClick={() => isFavoriteTeam(team.id) ? removeFavoriteTeam(team.id) : addFavoriteTeam(team.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-all ${
                  isFavoriteTeam(team.id) 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-background-subtle text-text-secondary hover:text-accent'
                }`}
                data-testid="favorite-team-btn"
              >
                <Star size={18} fill={isFavoriteTeam(team.id) ? 'currentColor' : 'none'} />
                <span className="font-heading font-bold uppercase text-sm">
                  {isFavoriteTeam(team.id) ? 'Favorited' : 'Add to Favorites'}
                </span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="squad" className="w-full">
          <TabsList className="w-full bg-background-paper border border-border mb-4">
            <TabsTrigger value="squad" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
              Squad
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="squad">
            <div className="card overflow-hidden" data-testid="squad-tab">
              {players.length === 0 ? (
                <div className="p-8 text-center text-text-tertiary">
                  Squad information not available
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-text-tertiary text-xs uppercase tracking-wide">
                      <th className="text-left py-3 px-4 font-medium">#</th>
                      <th className="text-left py-3 px-4 font-medium">Player</th>
                      <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Position</th>
                      <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Nationality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, idx) => (
                      <motion.tr
                        key={player.id || idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-border/50 hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => navigate(`/player/${player.id}`)}
                      >
                        <td className="py-3 px-4 font-data text-text-secondary">
                          {player.jersey_number || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {player.image_path && (
                              <img src={player.image_path} alt="" className="w-8 h-8 rounded-full object-cover" />
                            )}
                            <span className="font-medium">{player.display_name || player.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-text-secondary hidden sm:table-cell">
                          {player.position?.name || player.detailed_position?.name || '-'}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            {player.nationality?.image_path && (
                              <img src={player.nationality.image_path} alt="" className="w-5 h-4 object-contain" />
                            )}
                            <span className="text-text-secondary text-sm">
                              {player.nationality?.name || '-'}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="info-tab">
              {/* Venue Info */}
              {venue && (
                <div className="card p-4">
                  <h3 className="font-heading font-bold uppercase text-sm mb-4 text-text-secondary">Stadium</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-bold">{venue.name}</p>
                      <p className="text-text-tertiary text-sm">{venue.city}, {venue.country?.name}</p>
                    </div>
                    {venue.capacity && (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Users size={16} />
                        <span>Capacity: {venue.capacity.toLocaleString()}</span>
                      </div>
                    )}
                    {venue.image_path && (
                      <img src={venue.image_path} alt="" className="w-full h-40 object-cover rounded-sm mt-2" />
                    )}
                  </div>
                </div>
              )}

              {/* Coach Info */}
              {coach && (
                <div className="card p-4">
                  <h3 className="font-heading font-bold uppercase text-sm mb-4 text-text-secondary">Manager</h3>
                  <div className="flex items-center gap-4">
                    {coach.image_path && (
                      <img src={coach.image_path} alt="" className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="text-lg font-bold">{coach.display_name || coach.name}</p>
                      {coach.nationality && (
                        <div className="flex items-center gap-2 text-text-tertiary text-sm mt-1">
                          {coach.nationality.image_path && (
                            <img src={coach.nationality.image_path} alt="" className="w-4 h-3 object-contain" />
                          )}
                          <span>{coach.nationality.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Team Stats */}
              {team.statistics && team.statistics.length > 0 && (
                <div className="card p-4 md:col-span-2">
                  <h3 className="font-heading font-bold uppercase text-sm mb-4 text-text-secondary">Season Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {team.statistics.slice(0, 8).map((stat, idx) => (
                      <div key={idx} className="bg-background-subtle p-3 rounded-sm text-center">
                        <p className="font-data text-2xl font-bold text-primary">{stat.data?.value || 0}</p>
                        <p className="text-xs text-text-tertiary uppercase">{stat.type?.name || 'Stat'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TeamProfile;
