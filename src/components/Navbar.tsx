import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Service', href: '#service' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Pricing', href: '#pricing' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple scrollspy logic
      const sections = ['service', 'how-it-works', 'benefits', 'pricing'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
      setActiveSection(targetId);
    }
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-charcoal-deep/80 backdrop-blur-md border-b border-white/10 py-4'
          : 'bg-transparent border-b border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="group" id="logo-anchor">
          <Logo size={42} showText={true} />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                activeSection === link.href.substring(1)
                  ? 'text-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
              {activeSection === link.href.substring(1) && (
                <motion.span
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-5" id="navbar-cta-group">
          <button
            onClick={() => onOpenAuth('login')}
            className="text-gray-300 hover:text-white text-sm font-semibold transition-colors duration-200"
          >
            Log In
          </button>
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-5 py-2.5 rounded-xl border border-gold text-gold hover:bg-gold hover:text-black font-semibold text-sm transition-all duration-300 shadow-md shadow-gold/5 active:scale-95"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-charcoal-deep/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 flex flex-col gap-6 md:hidden z-50 shadow-2xl shadow-black"
            id="mobile-drawer"
          >
            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-lg font-semibold tracking-wide border-b border-white/5 pb-2 ${
                    activeSection === link.href.substring(1)
                      ? 'text-gold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-3.5 rounded-xl text-center font-bold text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth('signup');
                }}
                className="w-full py-3.5 rounded-xl text-center font-bold text-black bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gold/25"
              >
                Sign Up
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono mt-4">
              <ShieldCheck size={14} className="text-gold" />
              <span>SECURED BANK-GRADE INTEGRATION</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
