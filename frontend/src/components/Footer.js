import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-paper border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Activity size={24} className="text-primary" />
              <span className="font-heading text-xl font-black">
                FLASH<span className="text-primary">PULSE</span>
              </span>
            </Link>
            <p className="text-text-tertiary text-sm">
              Live Fußball-Ergebnisse, Spielpläne und Statistiken.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold uppercase text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-text-secondary hover:text-primary transition-colors">
                  Live Scores
                </Link>
              </li>
              <li>
                <Link to="/fixtures" className="text-text-secondary hover:text-primary transition-colors">
                  Spielplan
                </Link>
              </li>
              <li>
                <Link to="/standings" className="text-text-secondary hover:text-primary transition-colors">
                  Tabellen
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-text-secondary hover:text-primary transition-colors">
                  Suche
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-heading font-bold uppercase text-sm mb-4">Konto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/auth" className="text-text-secondary hover:text-primary transition-colors">
                  Anmelden
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-text-secondary hover:text-primary transition-colors">
                  Profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-bold uppercase text-sm mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/impressum" className="text-text-secondary hover:text-primary transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="text-text-secondary hover:text-primary transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/agb" className="text-text-secondary hover:text-primary transition-colors">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-tertiary text-xs">
            © {currentYear} FlashPulse Sports Media GmbH. Alle Rechte vorbehalten.
          </p>
          <p className="text-text-tertiary text-xs">
            Daten bereitgestellt von{' '}
            <a 
              href="https://www.sportmonks.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Sportmonks
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
