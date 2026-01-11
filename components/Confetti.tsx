import React, { useEffect, useRef, useCallback } from 'react';
import { NEON_COLORS } from '../constants';
import { Particle } from '../types';

interface ConfettiProps {
  trigger: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  // Fix: Initialize useRef with null to satisfy TypeScript requirements
  const animationFrameRef = useRef<number | null>(null);

  const createParticle = (x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      size: Math.random() * 6 + 2,
      life: 1.0,
      decay: Math.random() * 0.01 + 0.005,
    };
  };

  const spawnConfetti = useCallback(() => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current;
    
    // Spawn from center
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(createParticle(width / 2, height / 2));
    }
    // Spawn from random positions
    for (let i = 0; i < 50; i++) {
       particlesRef.current.push(createParticle(Math.random() * width, Math.random() * height));
    }
  }, []);

  const update = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // Gravity
      p.vx *= 0.99; // Air resistance
      p.life -= p.decay;

      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Reset alpha
      ctx.globalAlpha = 1.0;
    });

    // Remove dead particles
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    if (particlesRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(update);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (trigger) {
      spawnConfetti();
      if (particlesRef.current.length > 0 && !animationFrameRef.current) {
        // Restart loop if stopped
         update();
      } else {
        // If loop running, just add particles
      }
    }
  }, [trigger, spawnConfetti, update]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default Confetti;