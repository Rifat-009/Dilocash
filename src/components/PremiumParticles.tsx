import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardTheme } from '../types';

interface PremiumParticlesProps {
  isHovered: boolean;
  isFlipped: boolean;
  theme: CardTheme;
}

interface Particle {
  id: number;
  x: number; // base x percentage
  y: number; // base y percentage
  size: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
}

export default function PremiumParticles({ isHovered, isFlipped, theme }: PremiumParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Regenerate/initialize particles
  useEffect(() => {
    const count = 28;
    const items: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: 30 + Math.random() * 40, // center-concentrated
      y: 35 + Math.random() * 30,
      size: 1.5 + Math.random() * 4,
      delay: Math.random() * -10, // pre-warm animations
      duration: 5 + Math.random() * 8,
      driftX: (Math.random() - 0.5) * 120,
      driftY: (Math.random() - 0.5) * 120,
    }));
    setParticles(items);
  }, []);

  // Determine color palette based on current theme
  const getParticleColor = (id: number) => {
    if (theme === 'gold') {
      const colors = ['rgba(212, 175, 55, 0.45)', 'rgba(243, 229, 171, 0.5)', 'rgba(255, 223, 0, 0.4)', 'rgba(255, 255, 255, 0.3)'];
      return colors[id % colors.length];
    } else if (theme === 'burner') {
      const colors = ['rgba(239, 68, 68, 0.45)', 'rgba(249, 115, 22, 0.4)', 'rgba(236, 72, 153, 0.4)', 'rgba(255, 255, 255, 0.35)'];
      return colors[id % colors.length];
    } else {
      const colors = ['rgba(226, 232, 240, 0.35)', 'rgba(6, 182, 212, 0.4)', 'rgba(255, 255, 255, 0.45)', 'rgba(59, 130, 246, 0.3)'];
      return colors[id % colors.length];
    }
  };

  // Determine shadow glow
  const getGlowStyle = () => {
    if (theme === 'gold') return '0 0 8px rgba(212, 175, 55, 0.6)';
    if (theme === 'burner') return '0 0 8px rgba(239, 68, 68, 0.6)';
    return '0 0 8px rgba(6, 182, 212, 0.5)';
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-0 select-none">
      <AnimatePresence>
        {particles.map((p) => {
          // Adjust drift and expansion based on state
          const speedMultiplier = isHovered ? 1.8 : 1.0;
          const expansion = isHovered ? 2.2 : 1.2;
          const rotationAngle = isFlipped ? 180 : 0;

          // Trigonometric offset to simulate rotation-induced scattering
          const rad = (rotationAngle * Math.PI) / 180;
          const rotatedDriftX = (p.driftX * Math.cos(rad) - p.driftY * Math.sin(rad)) * expansion;
          const rotatedDriftY = (p.driftX * Math.sin(rad) + p.driftY * Math.cos(rad)) * expansion;

          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: getParticleColor(p.id),
                boxShadow: getGlowStyle(),
              }}
              animate={{
                x: [0, rotatedDriftX, 0],
                y: [0, rotatedDriftY, 0],
                scale: isHovered ? [1, 1.8, 1] : [1, 1.3, 1],
                opacity: isHovered ? [0.2, 0.9, 0.2] : [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: p.duration / speedMultiplier,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
