import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Users, User, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout, Header } from '../components/Layout';
import { LoadingSpinner, EmptyState } from '../components/MatchComponents';
import { useSearch } from '../hooks/useApi';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { results, loading, error, search } = useSearch();

  const debouncedSearch = useCallback(
    debounce((q) => search(q), 300),
    [search]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const hasResults = results.teams.length > 0 || results.players.length > 0;

  return (
    <Layout>
      <Header title="Search" subtitle="Find teams and players" />

      <div className="px-4 lg:px-6">
        {/* Search Input */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
          <Input
            type="text"
            placeholder="Search teams or players..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-12 py-4 text-lg bg-background-paper border-border text-text-primary placeholder:text-text-disabled"
            data-testid="search-input"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              data-testid="clear-search-btn"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Results */}
        {!query ? (
          <EmptyState
            icon={SearchIcon}
            title="Search for Teams or Players"
            description="Enter at least 2 characters to search"
          />
        ) : loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState
            title="Search Error"
            description={error}
          />
        ) : !hasResults ? (
          <EmptyState
            icon={SearchIcon}
            title="No Results Found"
            description={`No teams or players match "${query}"`}
          />
        ) : (
          <Tabs defaultValue="teams" className="w-full">
            <TabsList className="w-full bg-background-paper border border-border mb-4">
              <TabsTrigger value="teams" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
                Teams ({results.teams.length})
              </TabsTrigger>
              <TabsTrigger value="players" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
                Players ({results.players.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teams">
              <div className="space-y-2" data-testid="teams-results">
                {results.teams.length === 0 ? (
                  <EmptyState icon={Users} title="No Teams Found" />
                ) : (
                  results.teams.map((team, idx) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="card card-interactive flex items-center gap-4 p-4"
                      onClick={() => navigate(`/team/${team.id}`)}
                      data-testid={`team-result-${team.id}`}
                    >
                      {team.image_path ? (
                        <img src={team.image_path} alt="" className="w-12 h-12 object-contain" />
                      ) : (
                        <div className="w-12 h-12 bg-background-subtle rounded-full flex items-center justify-center">
                          <Users size={24} className="text-text-tertiary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg uppercase">{team.name}</h3>
                        <div className="flex items-center gap-2 text-text-tertiary text-sm">
                          {team.short_code && <span className="font-data">{team.short_code}</span>}
                          {team.country && (
                            <>
                              <span>•</span>
                              {team.country.image_path && (
                                <img src={team.country.image_path} alt="" className="w-4 h-3 object-contain" />
                              )}
                              <span>{team.country.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="players">
              <div className="space-y-2" data-testid="players-results">
                {results.players.length === 0 ? (
                  <EmptyState icon={User} title="No Players Found" />
                ) : (
                  results.players.map((player, idx) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="card card-interactive flex items-center gap-4 p-4"
                      onClick={() => navigate(`/player/${player.id}`)}
                      data-testid={`player-result-${player.id}`}
                    >
                      {player.image_path ? (
                        <img src={player.image_path} alt="" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-background-subtle rounded-full flex items-center justify-center">
                          <User size={24} className="text-text-tertiary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg uppercase">
                          {player.display_name || player.name}
                        </h3>
                        <div className="flex items-center gap-2 text-text-tertiary text-sm">
                          {player.position?.name && (
                            <span className="bg-background-subtle px-2 py-0.5 rounded text-xs">
                              {player.position.name}
                            </span>
                          )}
                          {player.nationality && (
                            <>
                              {player.nationality.image_path && (
                                <img src={player.nationality.image_path} alt="" className="w-4 h-3 object-contain" />
                              )}
                              <span>{player.nationality.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
