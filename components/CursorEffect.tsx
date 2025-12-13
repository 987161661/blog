'use client';

import { useEffect, useRef } from 'react';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    // Random angle
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.5 + 0.2; // Gentle speed
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    this.life = 1.0; // Alpha value
    
    // Check context (Header is roughly top 180px)
    const isContentArea = y > 180;
    
    if (isContentArea) {
       this.size = Math.random() * 3 + 2; // Larger in content area
       const hue = (Date.now() / 5) % 360; // Faster color cycle
       this.color = `hsl(${hue}, 100%, 75%)`; // Brighter
    } else {
       this.size = Math.random() * 2 + 1; // Standard size
       const hue = (Date.now() / 10) % 360;
       this.color = `hsl(${hue}, 100%, 70%)`;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.02; // Fade out speed
    this.size *= 0.95; // Shrink speed
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export default function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const cursor = useRef({ x: 0, y: 0 });
  const lastCursor = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      cursor.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Interpolate between last position and current position to fill gaps
      const dx = cursor.current.x - lastCursor.current.x;
      const dy = cursor.current.y - lastCursor.current.y;
      const dist = Math.hypot(dx, dy);
      
      // Spawn particles along the path if moving fast
      const steps = Math.min(10, Math.floor(dist / 2)); // Limit steps
      
      if (dist > 0.1) {
         for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = lastCursor.current.x + dx * t;
            const y = lastCursor.current.y + dy * t;
            
            // Spawn probability
            if (Math.random() < 0.5) {
                particles.current.push(new Particle(x, y));
            }
         }
      }

      lastCursor.current = { ...cursor.current };

      // Update and draw
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0 || p.size < 0.1) {
          particles.current.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }} // Make colors pop on dark backgrounds
    />
  );
}
