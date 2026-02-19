import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { Layout, Header } from '../components/Layout';
import { LeagueSection, EmptyState, LoadingSpinner } from '../components/MatchComponents';
import { useFixtures } from '../hooks/useApi';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Button } from '../components/ui/button';

const Fixtures = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const { data: fixtures, loading, error } = useFixtures(dateStr);

  const groupedFixtures = useMemo(() => {
    if (!fixtures || fixtures.length === 0) return {};
    
    return fixtures.reduce((acc, fixture) => {
      const leagueId = fixture.league?.id || 'unknown';
      if (!acc[leagueId]) {
        acc[leagueId] = {
          league: fixture.league,
          fixtures: []
        };
      }
      acc[leagueId].fixtures.push(fixture);
      return acc;
    }, {});
  }, [fixtures]);

  const goToPrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const goToNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const goToToday = () => setSelectedDate(new Date());

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <Layout>
      <Header 
        title="Fixtures"
        subtitle={format(selectedDate, 'EEEE, MMMM d, yyyy')}
      />

      <div className="px-4 lg:px-6">
        {/* Date Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-background-paper border border-border rounded-lg">
          <button
            onClick={goToPrevDay}
            className="btn-ghost p-2"
            data-testid="prev-day-btn"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            {!isToday && (
              <button
                onClick={goToToday}
                className="text-primary text-sm font-bold hover:underline"
                data-testid="today-btn"
              >
                Today
              </button>
            )}
            
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-background-subtle border-border text-text-primary hover:bg-white/5"
                  data-testid="calendar-trigger"
                >
                  <CalendarIcon size={16} />
                  <span className="font-data">{format(selectedDate, 'MMM d, yyyy')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background-paper border-border" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  initialFocus
                  className="bg-background-paper text-text-primary"
                />
              </PopoverContent>
            </Popover>
          </div>

          <button
            onClick={goToNextDay}
            className="btn-ghost p-2"
            data-testid="next-day-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Quick Date Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {[-2, -1, 0, 1, 2, 3, 4].map(offset => {
            const date = addDays(new Date(), offset);
            const isSelected = format(date, 'yyyy-MM-dd') === dateStr;
            return (
              <button
                key={offset}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-4 py-2 rounded-sm text-sm font-data transition-all ${
                  isSelected 
                    ? 'bg-primary text-black' 
                    : 'bg-background-paper border border-border text-text-secondary hover:border-primary/50'
                }`}
                data-testid={`date-btn-${offset}`}
              >
                {offset === 0 ? 'Today' : format(date, 'EEE d')}
              </button>
            );
          })}
        </div>

        {/* Fixtures List */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState
            icon={CalendarIcon}
            title="Failed to Load Fixtures"
            description={error}
          />
        ) : fixtures.length === 0 ? (
          <EmptyState
            icon={CalendarIcon}
            title="No Fixtures"
            description={`No matches scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`}
          />
        ) : (
          <div data-testid="fixtures-list">
            {Object.values(groupedFixtures).map(({ league, fixtures: leagueFixtures }) => (
              <LeagueSection 
                key={league?.id || 'unknown'} 
                league={league} 
                fixtures={leagueFixtures} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Fixtures;
