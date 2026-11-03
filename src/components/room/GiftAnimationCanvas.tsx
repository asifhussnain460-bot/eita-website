import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const GiftAnimationCanvas: React.FC = () => {
  const { activeGiftAnimation } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!activeGiftAnimation) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId: number;
    const startTime = performance.now();
    const duration = 4000; // 4 seconds

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#ffffff'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
      });
    }

    const render = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw custom animation depending on gift type
      const type = activeGiftAnimation.gift.animationType;

      if (type === 'flying_car') {
        // Sports Car zooms horizontally across screen from left to right
        const carX = -200 + progress * (canvas.width + 400);
        const carY = canvas.height * 0.5;

        // Speed lines
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(carX - 150, carY);
        ctx.lineTo(carX - 20, carY);
        ctx.stroke();

        // Car emoji / sprite
        ctx.font = '80px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏎️', carX, carY);

        // Exhaust sparks
        if (Math.random() > 0.3) {
          particles.push({
            x: carX - 60,
            y: carY + 10,
            vx: -3 - Math.random() * 4,
            vy: (Math.random() - 0.5) * 3,
            size: Math.random() * 4 + 2,
            color: '#f97316',
            alpha: 0.9,
            decay: 0.03,
          });
        }
      } else if (type === 'golden_dragon') {
        // Dragon swooping in S-curve
        const dragX = canvas.width / 2 + Math.sin(progress * Math.PI * 3) * 120;
        const dragY = canvas.height * 0.7 - progress * (canvas.height * 0.5);

        ctx.font = '96px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐉', dragX, dragY);

        // Golden fiery breath aura
        const gradient = ctx.createRadialGradient(dragX, dragY, 10, dragX, dragY, 140);
        gradient.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dragX, dragY, 140, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === 'rocket') {
        // Rocket launching upwards
        const rX = canvas.width / 2;
        const rY = canvas.height * 0.85 - Math.pow(progress, 1.5) * (canvas.height * 0.9);

        ctx.font = '90px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚀', rX, rY);

        // Flame trail
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: rX + (Math.random() - 0.5) * 20,
            y: rY + 50,
            vx: (Math.random() - 0.5) * 2,
            vy: 4 + Math.random() * 3,
            size: Math.random() * 6 + 3,
            color: '#ef4444',
            alpha: 0.9,
            decay: 0.04,
          });
        }
      } else {
        // Crown, Castle, Rose burst in center with radial halo
        const cx = canvas.width / 2;
        const cy = canvas.height * 0.42;

        // Floating pulsating scale
        const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.15;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.font = '96px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activeGiftAnimation.gift.icon, 0, 0);
        ctx.restore();

        // Shimmering halo
        const haloGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 180);
        haloGrad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
        haloGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.2)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (progress < 1) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeGiftAnimation]);

  if (!activeGiftAnimation) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-between py-12 px-4 overflow-hidden">
      {/* Top Banner Announcement */}
      <div className="relative mt-8 max-w-md w-full bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-purple-900/90 border-y-2 border-amber-400 py-3 px-6 rounded-3xl shadow-2xl backdrop-blur-md text-center animate-in fade-in slide-in-from-top-6 duration-300">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl animate-bounce">{activeGiftAnimation.gift.icon}</span>
          <div className="text-sm font-black text-white">
            <span className="text-amber-300 font-extrabold">{activeGiftAnimation.senderName}</span>
            <span className="text-slate-200"> sent </span>
            <span className="text-pink-300 font-extrabold">{activeGiftAnimation.gift.name}</span>
            <span className="text-slate-200"> to </span>
            <span className="text-cyan-300 font-extrabold">{activeGiftAnimation.recipientName}</span>
          </div>
        </div>
        {activeGiftAnimation.combo > 1 && (
          <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs tracking-wider shadow-md animate-pulse">
            COMBO x{activeGiftAnimation.combo} 🔥
          </div>
        )}
      </div>

      {/* HTML5 Canvas Particle & Movement Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
