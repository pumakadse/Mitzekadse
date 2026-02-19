import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Ruler, Weight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Layout } from '../components/Layout';
import { LoadingSpinner, EmptyState } from '../components/MatchComponents';
import { usePlayer } from '../hooks/useApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const PlayerProfile = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { data: player, loading, error } = usePlayer(playerId);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error || !player) {
    return (
      <Layout>
        <EmptyState
          title="Player Not Found"
          description="Unable to load player details"
        />
      </Layout>
    );
  }

  const teams = player.teams || [];
  const statistics = player.statistics || [];
  const currentTeam = teams.find(t => !t.end) || teams[0];

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

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

        {/* Player Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
          data-testid="player-header"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {player.image_path && (
              <img 
                src={player.image_path} 
                alt="" 
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                {player.jersey_number && (
                  <span className="font-data text-4xl font-bold text-primary">#{player.jersey_number}</span>
                )}
                <h1 className="font-heading font-black text-3xl uppercase tracking-tight">
                  {player.display_name || player.name}
                </h1>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-text-secondary text-sm">
                {player.position?.name && (
                  <span className="bg-background-subtle px-2 py-1 rounded font-bold uppercase">
                    {player.position.name}
                  </span>
                )}
                {player.nationality && (
                  <span className="flex items-center gap-2">
                    {player.nationality.image_path && (
                      <img src={player.nationality.image_path} alt="" className="w-5 h-4 object-contain" />
                    )}
                    {player.nationality.name}
                  </span>
                )}
                {currentTeam?.team && (
                  <span 
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/team/${currentTeam.team.id}`)}
                  >
                    {currentTeam.team.image_path && (
                      <img src={currentTeam.team.image_path} alt="" className="w-5 h-5 object-contain" />
                    )}
                    {currentTeam.team.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Player Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            {player.date_of_birth && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-text-tertiary mb-1">
                  <Calendar size={14} />
                  <span className="text-xs uppercase">Age</span>
                </div>
                <p className="font-data text-lg font-bold">{calculateAge(player.date_of_birth)} years</p>
                <p className="text-xs text-text-tertiary">
                  {format(new Date(player.date_of_birth), 'MMM d, yyyy')}
                </p>
              </div>
            )}
            {player.height && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-text-tertiary mb-1">
                  <Ruler size={14} />
                  <span className="text-xs uppercase">Height</span>
                </div>
                <p className="font-data text-lg font-bold">{player.height} cm</p>
              </div>
            )}
            {player.weight && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-text-tertiary mb-1">
                  <Weight size={14} />
                  <span className="text-xs uppercase">Weight</span>
                </div>
                <p className="font-data text-lg font-bold">{player.weight} kg</p>
              </div>
            )}
            {player.city && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-text-tertiary mb-1">
                  <MapPin size={14} />
                  <span className="text-xs uppercase">Birthplace</span>
                </div>
                <p className="font-data text-sm font-bold">{player.city}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="w-full bg-background-paper border border-border mb-4">
            <TabsTrigger value="stats" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
              Statistics
            </TabsTrigger>
            <TabsTrigger value="career" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
              Career
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <div className="card p-4" data-testid="stats-tab">
              {statistics.length === 0 ? (
                <p className="text-text-tertiary text-center py-8">No statistics available</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {statistics.slice(0, 12).map((stat, idx) => (
                    <div key={idx} className="bg-background-subtle p-4 rounded-sm text-center">
                      <p className="font-data text-2xl font-bold text-primary">
                        {stat.data?.value ?? stat.total ?? 0}
                      </p>
                      <p className="text-xs text-text-tertiary uppercase mt-1">
                        {stat.type?.name || stat.type?.developer_name || 'Stat'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="career">
            <div className="card overflow-hidden" data-testid="career-tab">
              {teams.length === 0 ? (
                <p className="text-text-tertiary text-center py-8">No career history available</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-text-tertiary text-xs uppercase tracking-wide">
                      <th className="text-left py-3 px-4 font-medium">Team</th>
                      <th className="text-left py-3 px-4 font-medium">Period</th>
                      <th className="text-center py-3 px-4 font-medium hidden sm:table-cell">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((career, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border/50 hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => career.team?.id && navigate(`/team/${career.team.id}`)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {career.team?.image_path && (
                              <img src={career.team.image_path} alt="" className="w-6 h-6 object-contain" />
                            )}
                            <span className="font-medium">{career.team?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-data text-sm text-text-secondary">
                          {career.start ? format(new Date(career.start), 'MMM yyyy') : '?'} 
                          {' - '}
                          {career.end ? format(new Date(career.end), 'MMM yyyy') : 'Present'}
                        </td>
                        <td className="py-3 px-4 text-center hidden sm:table-cell">
                          <span className={`text-xs px-2 py-1 rounded ${
                            career.transfer?.type === 'loan' 
                              ? 'bg-accent/20 text-accent' 
                              : 'bg-primary/20 text-primary'
                          }`}>
                            {career.transfer?.type || 'Transfer'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PlayerProfile;
