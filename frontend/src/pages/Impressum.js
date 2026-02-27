import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Phone, Globe, FileText } from 'lucide-react';
import { Layout } from '../components/Layout';

const Impressum = () => {
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
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight mb-6">
            Impressum
          </h1>
          
          <p className="text-text-secondary text-sm mb-8">
            Angaben gemäß § 5 E-Commerce-Gesetz (ECG) und § 25 Mediengesetz
          </p>

          {/* Company Information */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">Betreiber der Website</h2>
            </div>
            
            <div className="bg-background-subtle p-4 rounded-lg space-y-2">
              <p className="font-bold">FlashPulse Sports Media GmbH</p>
              <p className="text-text-secondary">Sportplatzstraße 42</p>
              <p className="text-text-secondary">1010 Wien</p>
              <p className="text-text-secondary">Österreich</p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">Kontakt</h2>
            </div>
            
            <div className="bg-background-subtle p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-text-tertiary" />
                <a href="mailto:kontakt@flashpulse.at" className="text-primary hover:underline">
                  kontakt@flashpulse.at
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-text-tertiary" />
                <a href="tel:+4312345678" className="text-primary hover:underline">
                  +43 1 234 56 78
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-text-tertiary" />
                <span className="text-text-secondary">www.flashpulse.at</span>
              </div>
            </div>
          </section>

          {/* Business Registration */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-primary" />
              <h2 className="font-heading font-bold text-xl uppercase">Unternehmensgegenstand</h2>
            </div>
            
            <div className="bg-background-subtle p-4 rounded-lg space-y-2 text-text-secondary">
              <p><span className="text-text-primary font-medium">Firmenbuchnummer:</span> FN 123456a</p>
              <p><span className="text-text-primary font-medium">Firmenbuchgericht:</span> Handelsgericht Wien</p>
              <p><span className="text-text-primary font-medium">UID-Nummer:</span> ATU12345678</p>
              <p><span className="text-text-primary font-medium">Kammerzugehörigkeit:</span> Wirtschaftskammer Wien</p>
              <p><span className="text-text-primary font-medium">Unternehmensgegenstand:</span> Online-Medien und Sportinformationsdienste</p>
            </div>
          </section>

          {/* Management */}
          <section className="mb-8">
            <h2 className="font-heading font-bold text-xl uppercase mb-4">Geschäftsführung</h2>
            <div className="bg-background-subtle p-4 rounded-lg">
              <p className="text-text-secondary">
                <span className="text-text-primary font-medium">Geschäftsführer:</span> Mag. Maximilian Sportner
              </p>
            </div>
          </section>

          {/* Regulatory Authority */}
          <section className="mb-8">
            <h2 className="font-heading font-bold text-xl uppercase mb-4">Aufsichtsbehörde</h2>
            <div className="bg-background-subtle p-4 rounded-lg text-text-secondary">
              <p>Magistratisches Bezirksamt des I. Bezirkes</p>
              <p>Wipplingerstraße 8</p>
              <p>1010 Wien</p>
            </div>
          </section>

          {/* Editorial Responsibility */}
          <section className="mb-8">
            <h2 className="font-heading font-bold text-xl uppercase mb-4">
              Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)
            </h2>
            <div className="bg-background-subtle p-4 rounded-lg text-text-secondary">
              <p className="font-medium text-text-primary">Mag. Maximilian Sportner</p>
              <p>Sportplatzstraße 42</p>
              <p>1010 Wien</p>
              <p>Österreich</p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-8">
            <h2 className="font-heading font-bold text-xl uppercase mb-4">Haftungsausschluss</h2>
            
            <div className="space-y-4 text-text-secondary text-sm">
              <div>
                <h3 className="font-bold text-text-primary mb-2">Haftung für Inhalte</h3>
                <p>
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                  Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 ECG für eigene Inhalte auf diesen Seiten 
                  nach den allgemeinen Gesetzen verantwortlich.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-text-primary mb-2">Haftung für Links</h3>
                <p>
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
                  Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber 
                  der Seiten verantwortlich.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-text-primary mb-2">Urheberrecht</h3>
                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                  dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede 
                  Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                  Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>
            </div>
          </section>

          {/* Online Dispute Resolution */}
          <section className="mb-8">
            <h2 className="font-heading font-bold text-xl uppercase mb-4">
              Online-Streitbeilegung
            </h2>
            <div className="bg-background-subtle p-4 rounded-lg text-text-secondary text-sm">
              <p className="mb-2">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              </p>
              <a 
                href="https://ec.europa.eu/consumers/odr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              <p className="mt-2">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          {/* Links */}
          <section>
            <h2 className="font-heading font-bold text-xl uppercase mb-4">Weitere Informationen</h2>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/datenschutz" 
                className="text-primary hover:underline flex items-center gap-2"
              >
                <FileText size={16} />
                Datenschutzerklärung
              </Link>
              <Link 
                to="/agb" 
                className="text-primary hover:underline flex items-center gap-2"
              >
                <FileText size={16} />
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

export default Impressum;
