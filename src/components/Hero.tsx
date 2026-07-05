import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Download, Users, CheckCircle, ArrowUpRight, Zap, Play, Sparkles, Cpu } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeUsersCount, setActiveUsersCount] = useState(1243912);

  // Parallax mouse-tracking rotation for the card stack
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to avoid jittery card movement
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse coordinates to degrees of rotation (subtle max 15 degrees tilt)
  const rotateX = useTransform(springY, [-200, 200], [12, -12]);
  const rotateY = useTransform(springX, [-200, 200], [-12, 12]);

  // Simulate slowly growing active user count to make page feel live
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsersCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Calculate relative offset from center
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    // Return cards gracefully to center
    x.set(0);
    y.set(0);
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex flex-col justify-center py-12 md:py-20 overflow-hidden"
    >
      {/* Premium ambient glowing backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-premium/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse-glow" />
      
      {/* 4-point glowing star particles floating around */}
      <div className="absolute top-[15%] left-[8%] opacity-35 animate-pulse-glow text-gold">✦</div>
      <div className="absolute top-[45%] left-[45%] opacity-20 animate-pulse-glow text-gold text-lg">✦</div>
      <div className="absolute top-[35%] right-[10%] opacity-40 animate-pulse-glow text-gold">✦</div>
      <div className="absolute bottom-[20%] left-[25%] opacity-25 animate-pulse-glow text-gold text-sm">✦</div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Copy & Core CTAs */}
        <div className="lg:col-span-7 flex flex-col space-y-8" id="hero-left-column">
          {/* Tag badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/15 text-xs text-gold font-mono uppercase tracking-wider">
              <Zap size={12} className="fill-gold animate-pulse" />
              Next-Gen Financial Architecture
            </span>
          </div>

          {/* Main H1 Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Fast And Simple <br />
            <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Digital Payment
            </span> <br />
            Solution
          </h1>

          {/* Detailed description */}
          <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Manage your assets securely with Dilocash. Issue instant matte titanium physical cards,
            deploy zero-delay virtual accounts, and create single-use burner credit cards that auto-delete after authorization.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-xl font-extrabold text-black bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 shadow-lg shadow-gold/25 flex items-center gap-2 group transition-all duration-300 active:scale-[0.98]"
            >
              Get It Now
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#service"
              className="px-6 py-4 rounded-xl font-bold text-gray-300 border border-white/10 bg-white/[0.02] hover:bg-white/5 hover:text-white flex items-center gap-2 group transition-all duration-300"
            >
              Explore Services
              <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Small note */}
          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-gold" /> No Annual Fees
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-gold" /> Setup in 2 Minutes
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Card Stack with Parallax effect */}
        <div className="lg:col-span-5 flex items-center justify-center relative min-h-[380px]" id="hero-right-column">
          
          {/* Subtle gold halo behind the card */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-gold/10 blur-[80px] -z-10 animate-pulse-glow" />

          {/* Rotating Circular badge container */}
          <div className="absolute -top-12 -left-8 md:-left-12 z-20 hidden sm:block">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Spinning circular text */}
              <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                <path id="circlePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                <text fill="#E5C158" fontSize="6" fontWeight="bold" letterSpacing="1.2">
                  <textPath href="#circlePath" startOffset="0%">
                    your one stop banking solution • dilocash bank •
                  </textPath>
                </text>
              </svg>
              {/* Center icon */}
              <div className="absolute w-12 h-12 rounded-full bg-charcoal-light border border-gold/20 flex items-center justify-center shadow-lg">
                <Sparkles size={16} className="text-gold animate-pulse" />
              </div>
            </div>
          </div>

          {/* 3D Parallax Stack */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="w-full max-w-[340px] h-[210px] relative cursor-pointer"
          >
            {/* Matte Black Card (Slightly front, overlaps) */}
            <div
              className="absolute inset-0 rounded-2xl p-6 card-metallic-black text-white flex flex-col justify-between transition-transform duration-300 select-none z-10"
              style={{
                transform: 'translateZ(30px) translateY(0px) rotate(-6deg)',
              }}
            >
              <div className="card-sheen" />
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-mono tracking-widest text-gold opacity-85">FOUNDERS TITANIUM</span>
                <span className="text-base font-extrabold tracking-tight">Dilocash</span>
              </div>
              <div>
                <Cpu size={24} className="text-zinc-400 opacity-60 mb-1" />
                <span className="text-[10px] font-mono text-zinc-500">SECURE SHELL SYSTEM</span>
              </div>
              <div className="flex flex-col gap-1 mt-auto">
                <span className="font-mono text-sm tracking-[0.15em]">4532  8824  9912  4012</span>
                <div className="flex justify-between text-[10px] font-mono mt-1">
                  <span className="text-zinc-400">ARAFATULLAH RIFAT</span>
                  <span className="text-zinc-500">12/30</span>
                </div>
              </div>
            </div>

            {/* Gold Luxury Card (Slightly behind, offset) */}
            <div
              className="absolute inset-0 rounded-2xl p-6 card-metallic-gold text-amber-950 flex flex-col justify-between transition-transform duration-300 select-none"
              style={{
                transform: 'translateZ(-15px) translateX(25px) translateY(20px) rotate(8deg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div className="card-sheen" />
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-mono tracking-widest text-amber-900 font-bold">SOLID PLATINUM GOLD</span>
                <span className="text-base font-black tracking-tight">Dilocash</span>
              </div>
              <div>
                <Cpu size={24} className="text-amber-950/40 mb-1" />
              </div>
              <div className="flex flex-col gap-1 mt-auto">
                <span className="font-mono text-sm tracking-[0.15em] font-bold">4815  1623  4299  8888</span>
                <div className="flex justify-between text-[10px] font-mono font-medium mt-1">
                  <span className="text-amber-950/60">ARAFATULLAH RIFAT</span>
                  <span className="text-amber-950/60">09/31</span>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>

      {/* Social Proof & Features Grid (Bottom Hero) */}
      <div className="max-w-7xl mx-auto px-6 mt-20 md:mt-28 w-full border-t border-white/5 pt-12 relative z-10" id="social-proof-grid">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Metric 01: Financial Transaction */}
          <div className="flex flex-col space-y-2 p-5 rounded-2xl bg-white/[0.01] border border-white/5">
            <span className="text-xs font-semibold text-gold font-mono tracking-wider">METRIC 01 // RELIABILITY</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white tracking-tight">99.99%</span>
              <span className="text-xs text-emerald-400 font-mono font-bold">▲ MAX</span>
            </div>
            <span className="text-sm font-bold text-gray-300">Financial Transactions</span>
            <p className="text-xs text-gray-500">Seamless real-time execution with bank-grade redundancy protocols.</p>
          </div>

          {/* Metric 02: Easy To Use System */}
          <div className="flex flex-col space-y-2 p-5 rounded-2xl bg-white/[0.01] border border-white/5">
            <span className="text-xs font-semibold text-gold font-mono tracking-wider">METRIC 02 // LATENCY</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white tracking-tight">2.4s</span>
              <span className="text-xs text-gold font-mono font-bold">SEC AVG</span>
            </div>
            <span className="text-sm font-bold text-gray-300">Easy To Use System</span>
            <p className="text-xs text-gray-500">Simple UX built for high-throughput digital banking on the fly.</p>
          </div>

          {/* Metric 03: Live active users counters & profiles */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl bg-gradient-to-r from-gold/5 via-white/[0.01] to-white/[0.01] border border-gold/10 gap-6">
            <div className="space-y-2">
              <div className="bg-gold/10 text-gold text-[10px] font-mono px-2 py-0.5 rounded-full inline-block font-bold">
                GLOBAL LIQUIDITY
              </div>
              <h5 className="text-white text-xl font-black font-mono tracking-tight">
                {activeUsersCount.toLocaleString()}
              </h5>
              <span className="text-sm font-semibold text-gray-300 block">World Active Users</span>
              <p className="text-xs text-gray-500 max-w-xs">Connecting digital nomads, creators, and modern founders globally.</p>
            </div>

            {/* Overlapping Avatar Stack of high resolution professionals */}
            <div className="flex items-center">
              <div className="flex -space-x-3.5 overflow-hidden">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
                ].map((avatar, i) => (
                  <img
                    key={i}
                    className="inline-block h-11 w-11 rounded-full ring-2 ring-charcoal-deep object-cover hover:scale-110 transition-transform duration-200"
                    src={avatar}
                    alt="Active user face stack"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div className="ml-4 flex flex-col">
                <span className="text-xs font-mono font-bold text-gold">● LIVE</span>
                <span className="text-[10px] text-gray-500">verified accounts</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
