import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, Calendar, Trophy, Search, User } from 'lucide-react';
import { Footer } from './Footer';

const navItems = [
  { path: '/', icon: Activity, label: 'Live' },
  { path: '/fixtures', icon: Calendar, label: 'Fixtures' },
  { path: '/standings', icon: Trophy, label: 'Standings' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-background-paper border-r border-border z-50 hidden lg:flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="font-heading text-3xl font-black text-primary tracking-tight">
          FLASH<span className="text-white">PULSE</span>
        </h1>
        <p className="text-text-tertiary text-sm mt-1">Live Football Scores</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || 
              (path !== '/' && location.pathname.startsWith(path));
            
            return (
              <li key={path}>
                <NavLink
                  to={path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  }`}
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  <Icon size={20} strokeWidth={1.5} />
                  <span className="font-heading font-bold uppercase tracking-wide">{label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-text-tertiary text-xs">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Live data powered by Sportmonks</span>
        </div>
      </div>
    </aside>
  );
};

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background-paper/95 backdrop-blur-lg border-t border-border z-50 flex justify-around py-2 lg:hidden safe-area-inset-bottom">
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path || 
          (path !== '/' && location.pathname.startsWith(path));
        
        return (
          <NavLink
            key={path}
            to={path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            data-testid={`mobile-nav-${label.toLowerCase()}`}
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export const Header = ({ title, subtitle, actions }) => {
  return (
    <header className="sticky top-0 z-40 glass-panel px-4 lg:px-6 py-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-black uppercase tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-text-tertiary text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar />
      <main className="lg:ml-64 pb-20 lg:pb-6 flex-1">
        {children}
      </main>
      <div className="lg:ml-64">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
