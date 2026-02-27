import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'flashpulse_cookie_consent';

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay before showing banner
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 lg:p-6"
        data-testid="cookie-consent"
      >
        <div className="max-w-4xl mx-auto bg-background-paper border border-border rounded-lg shadow-2xl overflow-hidden">
          <div className="p-4 lg:p-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
                <Cookie className="text-primary" size={24} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-heading font-bold text-lg mb-2">Cookie-Einstellungen</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
                  Einige Cookies sind für den Betrieb der Website erforderlich, während andere uns helfen, 
                  die Website zu verbessern und personalisierte Werbung anzuzeigen.
                </p>
                
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mb-4 space-y-3"
                  >
                    <div className="bg-background-subtle p-3 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">Notwendige Cookies</span>
                        <span className="text-xs text-primary">Immer aktiv</span>
                      </div>
                      <p className="text-xs text-text-tertiary">
                        Diese Cookies sind für die Grundfunktionen der Website erforderlich.
                      </p>
                    </div>
                    
                    <div className="bg-background-subtle p-3 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">Analyse-Cookies</span>
                        <span className="text-xs text-text-tertiary">Optional</span>
                      </div>
                      <p className="text-xs text-text-tertiary">
                        Helfen uns zu verstehen, wie Besucher mit der Website interagieren.
                      </p>
                    </div>
                    
                    <div className="bg-background-subtle p-3 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">Marketing-Cookies</span>
                        <span className="text-xs text-text-tertiary">Optional</span>
                      </div>
                      <p className="text-xs text-text-tertiary">
                        Werden verwendet, um Besuchern relevante Werbung anzuzeigen.
                      </p>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={acceptAll}
                    className="btn-primary px-6 py-2 text-sm"
                    data-testid="accept-all-cookies"
                  >
                    Alle akzeptieren
                  </button>
                  <button
                    onClick={acceptNecessary}
                    className="btn-ghost border border-border px-6 py-2 text-sm"
                    data-testid="accept-necessary-cookies"
                  >
                    Nur notwendige
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-primary text-sm hover:underline"
                  >
                    {showDetails ? 'Weniger anzeigen' : 'Mehr erfahren'}
                  </button>
                </div>
                
                <p className="text-xs text-text-tertiary mt-4">
                  Weitere Informationen finden Sie in unserer{' '}
                  <Link to="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link>
                  {' '}und im{' '}
                  <Link to="/impressum" className="text-primary hover:underline">Impressum</Link>.
                </p>
              </div>
              
              <button
                onClick={acceptNecessary}
                className="text-text-tertiary hover:text-text-primary p-1"
                aria-label="Schließen"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
