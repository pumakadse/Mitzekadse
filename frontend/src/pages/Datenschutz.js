import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Database, Cookie, Eye, Lock, Users, Mail } from 'lucide-react';
import { Layout } from '../components/Layout';

const Datenschutz = () => {
  return (
    <Layout>
      <div className="px-4 lg:px-6 max-w-4xl mx-auto py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-6"
          data-testid="back-btn"
        >
          <ArrowLeft size={20} />
          <span>Zurück</span>
        </Link>

        <div className="card p-6 lg:p-8">
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight mb-2">
            Datenschutzerklärung
          </h1>
          <p className="text-text-tertiary text-sm mb-8">
            Gemäß DSGVO (Datenschutz-Grundverordnung) und DSG (Datenschutzgesetz Österreich)
          </p>

          {/* Table of Contents */}
          <nav className="bg-background-subtle p-4 rounded-lg mb-8">
            <h2 className="font-bold mb-3">Inhaltsverzeichnis</h2>
            <ol className="space-y-1 text-sm text-text-secondary list-decimal list-inside">
              <li><a href="#verantwortlicher" className="hover:text-primary">Verantwortlicher</a></li>
              <li><a href="#datenerfassung" className="hover:text-primary">Datenerfassung auf dieser Website</a></li>
              <li><a href="#cookies" className="hover:text-primary">Cookies und Tracking</a></li>
              <li><a href="#google-ads" className="hover:text-primary">Google AdSense</a></li>
              <li><a href="#analyse" className="hover:text-primary">Analyse-Tools</a></li>
              <li><a href="#rechte" className="hover:text-primary">Ihre Rechte</a></li>
              <li><a href="#kontakt" className="hover:text-primary">Kontakt</a></li>
            </ol>
          </nav>

          {/* Section 1: Controller */}
          <section id="verantwortlicher" className="mb-8 scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">1. Verantwortlicher</h2>
            </div>
            
            <div className="bg-background-subtle p-4 rounded-lg text-text-secondary">
              <p className="font-medium text-text-primary mb-2">FlashPulse Sports Media GmbH</p>
              <p>Sportplatzstraße 42</p>
              <p>1010 Wien, Österreich</p>
              <p className="mt-2">E-Mail: datenschutz@flashpulse.at</p>
              <p>Telefon: +43 1 234 56 78</p>
            </div>
          </section>

          {/* Section 2: Data Collection */}
          <section id="datenerfassung" className="mb-8 scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Database size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">2. Datenerfassung auf dieser Website</h2>
            </div>
            
            <div className="space-y-4 text-text-secondary text-sm">
              <div>
                <h3 className="font-bold text-text-primary mb-2">Automatisch erfasste Daten</h3>
                <p className="mb-2">Beim Besuch unserer Website werden automatisch folgende Daten erfasst:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>IP-Adresse (anonymisiert)</li>
                  <li>Browsertyp und -version</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Datum und Uhrzeit des Zugriffs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-text-primary mb-2">Benutzerkonto</h3>
                <p>
                  Bei der Registrierung erfassen wir: E-Mail-Adresse, Benutzername und Passwort (verschlüsselt).
                  Diese Daten werden zur Bereitstellung des Dienstes verarbeitet (Art. 6 Abs. 1 lit. b DSGVO).
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-text-primary mb-2">Favoriten</h3>
                <p>
                  Ihre gespeicherten Lieblingsmannschaften werden in Ihrem Benutzerkonto gespeichert, 
                  um Ihnen personalisierte Inhalte anzuzeigen.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Cookies */}
          <section id="cookies" className="mb-8 scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Cookie size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">3. Cookies und Tracking</h2>
            </div>
            
            <div className="space-y-4 text-text-secondary text-sm">
              <p>
                Unsere Website verwendet Cookies. Dies sind kleine Textdateien, die auf Ihrem Endgerät 
                gespeichert werden und bestimmte Einstellungen und Daten zum Austausch mit unserem System speichern.
              </p>
              
              <div className="bg-background-subtle p-4 rounded-lg">
                <h4 className="font-bold text-text-primary mb-2">Notwendige Cookies</h4>
                <p>Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.</p>
                <ul className="list-disc list-inside mt-2 ml-4">
                  <li>Session-Cookie (Sitzungsverwaltung)</li>
                  <li>Cookie-Einstellungen</li>
                  <li>Authentifizierung</li>
                </ul>
              </div>
              
              <div className="bg-background-subtle p-4 rounded-lg">
                <h4 className="font-bold text-text-primary mb-2">Analyse-Cookies</h4>
                <p>Helfen uns zu verstehen, wie Besucher mit der Website interagieren.</p>
                <ul className="list-disc list-inside mt-2 ml-4">
                  <li>PostHog Analytics</li>
                </ul>
              </div>
              
              <div className="bg-background-subtle p-4 rounded-lg">
                <h4 className="font-bold text-text-primary mb-2">Marketing-Cookies</h4>
                <p>Werden verwendet, um Besuchern relevante Werbung anzuzeigen.</p>
                <ul className="list-disc list-inside mt-2 ml-4">
                  <li>Google AdSense</li>
                  <li>Google Analytics (für Werbezwecke)</li>
                </ul>
              </div>
              
              <p>
                Sie können Ihre Cookie-Einstellungen jederzeit über unseren Cookie-Banner oder in Ihren 
                Browsereinstellungen ändern.
              </p>
            </div>
          </section>

          {/* Section 4: Google AdSense */}
          <section id="google-ads" className="mb-8 scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">4. Google AdSense</h2>
            </div>
            
            <div className="space-y-4 text-text-secondary text-sm">
              <p>
                Diese Website nutzt Google AdSense, einen Dienst zum Einbinden von Werbeanzeigen der 
                Google Ireland Limited ("Google"), Gordon House, Barrow Street, Dublin 4, Irland.
              </p>
              
              <div className="bg-background-subtle p-4 rounded-lg">
                <h4 className="font-bold text-text-primary mb-2">Verarbeitete Daten</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>IP-Adresse</li>
                  <li>Geräte- und Browserinformationen</li>
                  <li>Anzeigeninteraktionen</li>
                  <li>Cookies für Werbezwecke</li>
                </ul>
              </div>
              
              <p>
                <strong>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung 
                (Art. 6 Abs. 1 lit. a DSGVO), die Sie über unseren Cookie-Banner erteilen können.
              </p>
              
              <p>
                <strong>Widerruf:</strong> Sie können Ihre Einwilligung jederzeit widerrufen, indem Sie 
                Ihre Cookie-Einstellungen ändern oder die{' '}
                <a 
                  href="https://adssettings.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Ads-Einstellungen
                </a>
                {' '}besuchen.
              </p>
              
              <p>
                Weitere Informationen finden Sie in der{' '}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Datenschutzerklärung von Google
                </a>.
              </p>
            </div>
          </section>

          {/* Section 5: Analytics */}
          <section id="analyse" className="mb-8 scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">5. Analyse-Tools</h2>
            </div>
            
            <div className="space-y-4 text-text-secondary text-sm">
              <div>
                <h3 className="font-bold text-text-primary mb-2">PostHog Analytics</h3>
                <p>
                  Wir nutzen PostHog zur Analyse des Nutzerverhaltens. PostHog verwendet Cookies, 
                  um die Nutzung der Website auszuwerten.
                </p>
                <p className="mt-2">
                  <strong>Rechtsgrundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Your Rights */}
          <section id="rechte" className="mb-8 scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">6. Ihre Rechte</h2>
            </div>
            
            <div className="space-y-4 text-text-secondary text-sm">
              <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
              
              <div className="grid gap-3">
                <div className="bg-background-subtle p-3 rounded">
                  <h4 className="font-bold text-text-primary">Auskunftsrecht (Art. 15 DSGVO)</h4>
                  <p className="text-xs mt-1">Recht auf Auskunft über Ihre gespeicherten Daten</p>
                </div>
                
                <div className="bg-background-subtle p-3 rounded">
                  <h4 className="font-bold text-text-primary">Berichtigungsrecht (Art. 16 DSGVO)</h4>
                  <p className="text-xs mt-1">Recht auf Berichtigung unrichtiger Daten</p>
                </div>
                
                <div className="bg-background-subtle p-3 rounded">
                  <h4 className="font-bold text-text-primary">Löschungsrecht (Art. 17 DSGVO)</h4>
                  <p className="text-xs mt-1">Recht auf Löschung Ihrer Daten ("Recht auf Vergessenwerden")</p>
                </div>
                
                <div className="bg-background-subtle p-3 rounded">
                  <h4 className="font-bold text-text-primary">Einschränkung der Verarbeitung (Art. 18 DSGVO)</h4>
                  <p className="text-xs mt-1">Recht auf Einschränkung der Datenverarbeitung</p>
                </div>
                
                <div className="bg-background-subtle p-3 rounded">
                  <h4 className="font-bold text-text-primary">Datenübertragbarkeit (Art. 20 DSGVO)</h4>
                  <p className="text-xs mt-1">Recht auf Erhalt Ihrer Daten in einem übertragbaren Format</p>
                </div>
                
                <div className="bg-background-subtle p-3 rounded">
                  <h4 className="font-bold text-text-primary">Widerspruchsrecht (Art. 21 DSGVO)</h4>
                  <p className="text-xs mt-1">Recht auf Widerspruch gegen die Verarbeitung</p>
                </div>
              </div>
              
              <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-lg">
                <h4 className="font-bold text-secondary mb-2">Beschwerderecht</h4>
                <p>
                  Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren. 
                  In Österreich ist dies die:
                </p>
                <p className="mt-2">
                  <strong>Österreichische Datenschutzbehörde</strong><br />
                  Barichgasse 40-42<br />
                  1030 Wien<br />
                  <a href="mailto:dsb@dsb.gv.at" className="text-primary hover:underline">dsb@dsb.gv.at</a>
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Contact */}
          <section id="kontakt" className="mb-8 scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">7. Kontakt</h2>
            </div>
            
            <div className="bg-background-subtle p-4 rounded-lg text-text-secondary">
              <p className="mb-4">
                Bei Fragen zum Datenschutz können Sie uns jederzeit kontaktieren:
              </p>
              <p className="font-medium text-text-primary">Datenschutzbeauftragter</p>
              <p>FlashPulse Sports Media GmbH</p>
              <p>E-Mail: <a href="mailto:datenschutz@flashpulse.at" className="text-primary hover:underline">datenschutz@flashpulse.at</a></p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">Datensicherheit</h2>
            </div>
            
            <div className="text-text-secondary text-sm space-y-2">
              <p>
                Wir verwenden SSL/TLS-Verschlüsselung für die sichere Übertragung Ihrer Daten.
                Unsere Server befinden sich in der EU und unterliegen den europäischen Datenschutzbestimmungen.
              </p>
            </div>
          </section>

          {/* Links */}
          <section>
            <h2 className="font-heading font-bold text-xl uppercase mb-4">Weitere Informationen</h2>
            <div className="flex flex-wrap gap-4">
              <Link to="/impressum" className="text-primary hover:underline">
                Impressum
              </Link>
              <Link to="/agb" className="text-primary hover:underline">
                AGB
              </Link>
            </div>
          </section>

          {/* Last Updated */}
          <div className="mt-8 pt-6 border-t border-border text-text-tertiary text-xs">
            Stand: Januar 2026
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Datenschutz;
