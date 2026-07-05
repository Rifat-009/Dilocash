import React, { useState } from 'react';
import Ticker from './components/Ticker';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CardCustomizer from './components/CardCustomizer';
import FXWidget from './components/FXWidget';
import SpendingSimulator from './components/SpendingSimulator';
import MarketHeatmap from './components/MarketHeatmap';
import CryptoPortfolio from './components/CryptoPortfolio';
import CryptoTrendScanner from './components/CryptoTrendScanner';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Pricing from './components/Pricing';
import Logo from './components/Logo';
import OfflineIndicator from './components/OfflineIndicator';

import { 
  ShieldCheck, 
  HelpCircle, 
  Lock, 
  Mail, 
  Check, 
  ArrowRight, 
  X, 
  ChevronRight, 
  Linkedin, 
  Twitter, 
  Github, 
  DollarSign,
  Facebook,
  Instagram,
  MessageCircle,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });
  
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Newsletter subscription states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Handler for custom actions
  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
    setIsAuthSuccess(false);
    setAuthEmail('');
    setAuthPassword('');
  };

  const handleCloseAuth = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    // Simulate fintech verification latency
    setTimeout(() => {
      setIsAuthLoading(false);
      setIsAuthSuccess(true);
    }, 1800);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-charcoal-deep text-white font-sans antialiased relative">
      
      {/* Top Live Crypto Prices Marquee */}
      <Ticker />

      {/* Sticky Glassmorphic Navbar */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Hero Section */}
      <Hero onGetStarted={() => handleOpenAuth('signup')} />

      {/* Live Fintech Operations Hub: interactive playground for users */}
      <section id="interactive-hub" className="py-20 md:py-28 relative bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.03),transparent_70%)] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold text-gold tracking-wider font-mono uppercase">
              INTERACTIVE HUB // SANDBOX PLAYGROUND
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 leading-tight">
              Test Dilocash Features In Real-Time
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-2xl">
              Interact with our live simulation dashboard. Adjust monthly thresholds, buy simulated crypto portfolios with real-time donut allocation graphs, monitor global market volatility heatmaps, and customize physical card finishes.
            </p>
          </div>

          {/* Interactive elements: customizer and FX converter */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
            
            {/* Credit Card Customizer - takes up 7 cols */}
            <div className="xl:col-span-7 flex flex-col justify-between" id="customizer-hub-wrapper">
              <CardCustomizer />
            </div>

            {/* FX Converter Widget - takes up 5 cols */}
            <div className="xl:col-span-5 flex flex-col justify-between" id="fx-hub-wrapper">
              <FXWidget />
            </div>

          </div>

          {/* Secondary Interactive row: Spending Threshold, Crypto Portfolio, AI Trend Scanner, and Volatility Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mt-8 min-w-0">
            
            {/* Spending Simulator card */}
            <div id="spending-simulator-wrapper" className="flex flex-col justify-between min-w-0">
              <SpendingSimulator />
            </div>

            {/* Crypto Portfolio card */}
            <div id="crypto-portfolio-wrapper" className="flex flex-col justify-between min-w-0">
              <CryptoPortfolio />
            </div>

            {/* AI Crypto Trend Scanner card */}
            <div id="crypto-trend-scanner-wrapper" className="flex flex-col justify-between min-w-0">
              <CryptoTrendScanner />
            </div>

            {/* Market Heatmap card */}
            <div id="market-heatmap-wrapper" className="flex flex-col justify-between min-w-0">
              <MarketHeatmap />
            </div>

          </div>

        </div>
      </section>

      {/* Detailed Services grid section */}
      <Services />

      {/* Detailed step-by-step Timeline sequence */}
      <HowItWorks />

      {/* Dynamic Benefits table comparison section */}
      <Benefits />

      {/* Membership Cycles and Custom sandbox reservation modal */}
      <Pricing />

      {/* Bottom FAQ accordion section */}
      <section id="faqs" className="py-20 md:py-28 bg-charcoal-deep border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-gold tracking-wider font-mono uppercase">
              RESOURCES // FAQ
            </span>
            <h3 className="text-3xl font-extrabold text-white mt-2">Frequently Answered Queries</h3>
            <p className="text-gray-400 text-sm mt-3">
              Learn how we protect assets, process cross-border conversions, and maintain FDIC standards.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto" id="faqs-accordion-wrapper">
            {[
              {
                q: 'How does the virtual burner card prevent fraud?',
                a: 'Burner cards are single-use tokens authorized for a unique merchant value. The moment a transaction triggers, the security key self-destructs instantly. If an attacker gains access to the card number, any subsequent processing will be auto-rejected.'
              },
              {
                q: 'What material weight are the physical metal cards?',
                a: 'Our physical alloy finishes are made of 18g solid-weight matte titanium or authentic multi-plated 24k gold cores. These are not standard plastic skins; they are solid metallic status assets.'
              },
              {
                q: 'Are rates synchronized in real-time?',
                a: 'Yes. Our server queries global clearing rates continuously using public FX APIs. This allows us to offer transparent mid-market rates on top currencies (EUR, GBP, JPY, INR) with a micro-thin flat margin of 0.15%.'
              },
              {
                q: 'Is Dilocash a registered financial institution?',
                a: 'Dilocash is a leading fintech platform partnering with licensed, fully regulated FDIC-insured clearing banks. Your cash funds are secure, fully insured up to $2.5M USD, and protected by sovereign regulatory mandates.'
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-6 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-gold/20 [&_summary::-webkit-details-marker]:hidden transition-all duration-300"
              >
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                  <h5 className="font-bold text-sm sm:text-base text-white group-hover:text-gold transition-colors">
                    {faq.q}
                  </h5>
                  <span className="text-gray-500 group-open:rotate-180 transition-transform duration-300">
                    <ChevronRight size={18} />
                  </span>
                </summary>
                <p className="text-xs sm:text-sm text-gray-400 mt-4 leading-relaxed font-normal">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final Bottom Call to Action banner */}
      <section className="py-20 bg-gradient-to-t from-charcoal-deep to-black relative overflow-hidden text-center border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-premium/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 text-[10px] font-mono text-gold rounded-full font-bold">
            MINT IN 2 MINUTES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Ready to Issue Your First Alloy?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Secure bank-grade access, zero-latency transfers, and gorgeous physical titanium finishes are waiting for you.
          </p>
          <div className="pt-4">
            <button
              onClick={() => handleOpenAuth('signup')}
              className="px-8 py-4 rounded-xl font-extrabold text-black bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 shadow-lg shadow-gold/25 text-sm transition-all duration-300"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Pixel Perfect Footer */}
      <footer className="bg-charcoal-deep/90 border-t border-white/5 py-16 text-gray-500 relative z-30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Footer Logo & Newsletter Form */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center" id="footer-logo">
              <Logo size={36} showText={true} />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Dilocash is a digital banking technology provider. Physical metal card manufacturing is completed in partner certified mint facilities.
            </p>

            {/* Newsletter input */}
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-mono font-semibold tracking-wider block">
                NEWSLETTER // INTELLIGENCE REPORTS
              </span>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email for updates"
                  className="bg-white/5 border border-white/5 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none flex-1 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-black font-bold text-xs font-mono transition-colors"
                >
                  Join
                </button>
              </form>
              <AnimatePresence>
                {newsletterSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-emerald-400 font-mono font-bold"
                  >
                    ✓ SUCCESS. Check your inbox for security intelligence.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Nav Categories */}
          <div className="md:col-span-2 space-y-4 col-span-1">
            <h5 className="text-xs font-bold text-white tracking-widest font-mono uppercase">NAVIGATION</h5>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#service" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#benefits" className="hover:text-white transition-colors">Core Benefits</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Tier Plans</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4 col-span-1">
            <h5 className="text-xs font-bold text-white tracking-widest font-mono uppercase">FINANCIALS</h5>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Treasury Yields</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liquidity Pools</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Clearing Margins</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FDIC Disclosures</a></li>
            </ul>
          </div>

          {/* Socials & Compliance */}
          <div className="md:col-span-3 space-y-6">
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-white tracking-widest font-mono uppercase">CREATOR PORTFOLIO</h5>
              <a 
                href="https://rifat-009.github.io/Profile/" 
                target="_blank" 
                rel="noreferrer" 
                className="group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gold/10 to-transparent hover:from-gold/15 border border-gold/20 hover:border-gold/40 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                    <Globe size={14} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white group-hover:text-gold transition-colors">Arafatullah Rifat</span>
                    <span className="text-[10px] font-mono text-gray-400">rifat-009.github.io</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gold group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="space-y-2.5">
              <h5 className="text-xs font-bold text-white tracking-widest font-mono uppercase">SOCIAL CONNECT</h5>
              <div className="grid grid-cols-6 gap-2">
                <a 
                  href="https://github.com/Rifat-009" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/10 transition-all" 
                  aria-label="Github social"
                  title="GitHub Profile"
                >
                  <Github size={16} />
                </a>
                <a 
                  href="https://www.linkedin.com/jobs/?skipRedirect=true&lipi=urn%3Ali%3Apage%3Ap_mwlite_my_network%3B20%2FZbiTIQ4uul9IN0kpJGA%3D%3D" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/10 transition-all" 
                  aria-label="LinkedIn social"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={16} />
                </a>
                <a 
                  href="https://www.facebook.com/share/17iGBRuHxW/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/10 transition-all" 
                  aria-label="Facebook social"
                  title="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a 
                  href="https://www.instagram.com/tawsif_tibro?igsh=MTlsMGlpN3Z2ZmxyZQ%3D%3D&utm_source=qr" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/10 transition-all" 
                  aria-label="Instagram social"
                  title="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a 
                  href="https://wa.me/8801947653255" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/10 transition-all" 
                  aria-label="WhatsApp social"
                  title="WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
                <a 
                  href="mailto:Aryanrifat1@gmail.com" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/10 transition-all" 
                  aria-label="Email developer"
                  title="Email Arafatullah Rifat"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 max-w-[220px]">
              <ShieldCheck className="text-emerald-400" size={14} />
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">PCI-DSS SECURITY VERIFIED</span>
            </div>
          </div>

        </div>

        {/* Legal block */}
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-12 pt-8 text-[10px] text-gray-600 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span>© 2026 Dilocash Inc. All Rights Reserved.</span>
            <div className="flex gap-4 font-mono">
              <a href="#" className="hover:text-gray-400">PRIVACY CHARTER</a>
              <a href="#" className="hover:text-gray-400">TERMS OF AGREEMENT</a>
              <a href="#" className="hover:text-gray-400">LICENSES</a>
            </div>
          </div>
          <p className="leading-relaxed">
            *Dilocash is a financial technology platform, not an insured depository institution. Banking clearance services are provided by registered custodian partner banks who are members of FDIC. The Dilocash Titanium cards are issued pursuant to custom licenses issued by premier clearing associations.
          </p>
        </div>
      </footer>

      {/* Authentication Modal (Log In / Sign Up) */}
      <AnimatePresence>
        {authModal.isOpen && (
          <div id="auth-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseAuth}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-charcoal-light border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={handleCloseAuth}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal button"
                id="auth-modal-close-btn"
              >
                <X size={18} />
              </button>

              {!isAuthSuccess ? (
                <form onSubmit={handleAuthSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-gold tracking-widest block uppercase">
                      SECURED BANK PORTAL
                    </span>
                    <h4 className="text-white text-2xl font-extrabold">
                      {authModal.mode === 'login' ? 'Welcome Back' : 'Join Dilocash'}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      Enter credentials to initialize secure digital ledger controls.
                    </p>
                  </div>

                  {/* Mode Selector */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
                    <button
                      type="button"
                      onClick={() => setAuthModal({ ...authModal, mode: 'login' })}
                      className={`py-2 text-center rounded-lg text-xs font-semibold font-mono transition-all ${
                        authModal.mode === 'login' ? 'bg-gold text-black font-extrabold' : 'text-gray-400'
                      }`}
                    >
                      LOG IN
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthModal({ ...authModal, mode: 'signup' })}
                      className={`py-2 text-center rounded-lg text-xs font-semibold font-mono transition-all ${
                        authModal.mode === 'signup' ? 'bg-gold text-black font-extrabold' : 'text-gray-400'
                      }`}
                    >
                      SIGN UP
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="auth-email-input" className="text-xs text-gray-400 font-semibold font-mono uppercase">
                        Fintech Node Email
                      </label>
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="e.g. user@dilocash.net"
                        className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="auth-password-input" className="text-xs text-gray-400 font-semibold font-mono uppercase">
                        Auth Security Key
                      </label>
                      <input
                        id="auth-password-input"
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full py-4 rounded-xl text-black bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-gold/25 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAuthLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Verifying Node...
                      </>
                    ) : authModal.mode === 'login' ? (
                      'Log In Securely'
                    ) : (
                      'Deploy Account Shield'
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-6 text-center space-y-6">
                  <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold flex items-center justify-center text-gold mx-auto animate-bounce">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-white text-xl font-bold">Access Node Authorized</h5>
                    <p className="text-gray-500 text-xs font-mono max-w-xs mx-auto">
                      Credentials validated against ledger certificate blocks. Secure session is initialized for {authEmail}.
                    </p>
                  </div>
                  <button
                    onClick={handleCloseAuth}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold transition-colors"
                  >
                    Enter Sandbox Terminal
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Offline Diagnostic & Control Panel */}
      <OfflineIndicator />

    </div>
  );
}
