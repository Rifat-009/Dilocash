import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function Logo({ size = 40, className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="dilocash-brand-logo-container">
      {/* Dynamic Advanced Vector Logo Emblem */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
        whileHover="hover"
        initial="rest"
      >
        {/* Subtle backing golden aura/glow */}
        <div className="absolute inset-0 bg-gold/15 rounded-full blur-md opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity duration-300" />

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(234,179,8,0.2)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Highly reflective premium gold gradient */}
            <linearGradient id="premium-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>

            {/* Deep platinum/carbon helper gradient for architectural depth */}
            <linearGradient id="platinum-depth-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Glowing path filter */}
            <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background rotating compass/ring (Architectural, representing global clearance & digital network) */}
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            stroke="url(#premium-gold-grad)"
            strokeWidth="1.5"
            strokeDasharray="6 12 18 12"
            opacity="0.3"
            variants={{
              rest: { rotate: 0 },
              hover: { rotate: 180, transition: { duration: 8, ease: "linear", repeat: Infinity } }
            }}
            style={{ transformOrigin: '50px 50px' }}
          />

          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="url(#platinum-depth-grad)"
            strokeWidth="1"
            strokeDasharray="40 10"
            opacity="0.5"
            variants={{
              rest: { rotate: 0 },
              hover: { rotate: -120, transition: { duration: 6, ease: "linear", repeat: Infinity } }
            }}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Outer intersecting orbital sweep (representing secure flow of transactions) */}
          <motion.path
            d="M 50 12 A 38 38 0 0 1 88 50 A 38 38 0 0 1 50 88"
            stroke="url(#premium-gold-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            variants={{
              rest: { strokeDashoffset: 0 },
              hover: { 
                strokeDasharray: ["60 120", "120 60", "60 120"],
                transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
            }}
          />

          {/* Intersecting companion sweep */}
          <motion.path
            d="M 50 88 A 38 38 0 0 1 12 50 A 38 38 0 0 1 50 12"
            stroke="url(#premium-gold-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Inner stylized premium monogram 'D' (Bold fintech shield structure) */}
          <g transform="translate(5, 5) scale(0.9)">
            {/* The Backplate of the letter D */}
            <path
              d="M 36 28 C 36 25 38 23 41 23 L 52 23 C 65 23 75 33 75 46 C 75 59 65 69 52 69 L 41 69 C 38 69 36 67 36 64 Z"
              fill="url(#platinum-depth-grad)"
              opacity="0.9"
            />
            {/* Inner dynamic cut making the Letter D */}
            <path
              d="M 47 34 L 52 34 C 59 34 64 39 64 46 C 64 53 59 58 52 58 L 47 58 Z"
              fill="#070708"
            />
            {/* Golden Ribbon face highlight on 'D' */}
            <path
              d="M 41 23 L 53 23 C 66 23 76 33 76 46 C 76 59 66 69 53 69 L 41 69 C 38 69 36 67 36 64 L 36 60 C 36 58 38 56 40 56 L 52 56 C 58 56 63 51 63 46 C 63 41 58 36 52 36 L 40 36 C 38 36 36 34 36 32 L 36 28 C 36 25 38 23 41 23 Z"
              fill="url(#premium-gold-grad)"
            />
          </g>

          {/* High-end focal point - Center Diamond sparkle (represents wealth, security, and prestige) */}
          <motion.path
            d="M 50 38 L 52.5 46 L 61 46.5 L 53.5 50.5 L 56 59 L 50 53.5 L 44 59 L 46.5 50.5 L 39 46.5 L 47.5 46 Z"
            fill="url(#premium-gold-grad)"
            variants={{
              rest: { scale: 1, opacity: 0.8 },
              hover: { 
                scale: [1, 1.25, 1],
                opacity: [0.8, 1, 0.8],
                rotate: 360,
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }
            }}
            style={{ transformOrigin: '50px 46.5px' }}
          />
        </svg>
      </motion.div>

      {/* Brand Name Typography */}
      {showText && (
        <span className="text-white font-black text-2xl tracking-tight group-hover:text-gold transition-colors duration-300 font-sans flex items-center">
          Dilocash
          <motion.span 
            className="text-gold"
            variants={{
              rest: { y: 0 },
              hover: { y: -2, transition: { repeat: Infinity, duration: 0.6, yoyo: true } }
            }}
          >
            .
          </motion.span>
        </span>
      )}
    </div>
  );
}
