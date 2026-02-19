import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Star, LogOut, Settings, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout, Header } from '../components/Layout';
import { EmptyState, LoadingSpinner } from '../components/MatchComponents';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../hooks/useApi';
import { Button } from '../components/ui/button';

const FavoriteTeamCard = ({ teamId }) => {
  const navigate = useNavigate();
  const { data: team, loading } = useTeam(teamId);
  const { removeFavoriteTeam } = useAuth();

  if (loading) {
    return (
      <div className="card p-4 flex items-center justify-center h-20">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!team) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card card-interactive flex items-center gap-4 p-4"
      data-testid={`favorite-team-${teamId}`}
    >
      <div 
        className="flex items-center gap-4 flex-1 cursor-pointer"
        onClick={() => navigate(`/team/${teamId}`)}
      >
        {team.image_path ? (
          <img src={team.image_path} alt="" className="w-12 h-12 object-contain" />
        ) : (
          <div className="w-12 h-12 bg-background-subtle rounded-full flex items-center justify-center">
            <Activity size={24} className="text-text-tertiary" />
          </div>
        )}
        <div>
          <h3 className="font-heading font-bold text-lg uppercase">{team.name}</h3>
          {team.short_code && (
            <span className="text-text-tertiary text-sm font-data">{team.short_code}</span>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeFavoriteTeam(teamId);
        }}
        className="p-2 text-text-tertiary hover:text-secondary transition-colors"
        data-testid={`remove-favorite-${teamId}`}
      >
        <Star size={20} fill="currentColor" />
      </button>
    </motion.div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="px-4 lg:px-6">
          <div className="card p-8 text-center max-w-md mx-auto mt-12">
            <User size={48} className="mx-auto text-text-tertiary mb-4" />
            <h2 className="font-heading font-bold text-2xl mb-2">Sign In Required</h2>
            <p className="text-text-tertiary mb-6">
              Create an account to save your favorite teams and get personalized updates.
            </p>
            <Button
              onClick={() => navigate('/auth')}
              className="btn-primary"
              data-testid="sign-in-btn"
            >
              Sign In / Register
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const favoriteTeams = user?.favorite_teams || [];

  return (
    <Layout>
      <Header title="Profile" />

      <div className="px-4 lg:px-6 max-w-2xl mx-auto">
        {/* User Info Card */}
        <div className="card p-6 mb-6" data-testid="user-info">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-xl">{user.username}</h2>
              <p className="text-text-tertiary text-sm">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-text-tertiary hover:text-secondary transition-colors"
              data-testid="logout-btn"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Favorite Teams */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg uppercase tracking-wide flex items-center gap-2">
              <Star size={18} className="text-accent" />
              Favorite Teams
            </h3>
            <span className="text-text-tertiary text-sm font-data">
              {favoriteTeams.length} teams
            </span>
          </div>

          {favoriteTeams.length === 0 ? (
            <div className="card p-8 text-center">
              <Star size={40} className="mx-auto text-text-tertiary mb-4" />
              <h4 className="font-heading font-bold text-lg mb-2">No Favorite Teams</h4>
              <p className="text-text-tertiary text-sm mb-4">
                Add teams to your favorites to quickly access their profiles and stats.
              </p>
              <Link 
                to="/search" 
                className="text-primary hover:underline"
              >
                Search for teams
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {favoriteTeams.map(teamId => (
                <FavoriteTeamCard key={teamId} teamId={teamId} />
              ))}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="card p-4">
          <div className="flex items-center gap-3 text-text-tertiary text-sm">
            <Settings size={16} />
            <span>Account created: {new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
