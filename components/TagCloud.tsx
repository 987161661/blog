'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// 3D Point class
class Point {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// Tag class
class Tag {
  point: Point;
  text: string;

  constructor(text: string, x: number, y: number, z: number) {
    this.text = text;
    this.point = new Point(x, y, z);
  }
}

export default function TagCloud() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Duplicated list for "Electron Cloud" density
  const baseCategories = [
    '奇思妙想', '科幻解构', '小说创作', '技术分享', 
    '创意项目', '生活/情感', '好文精赏', '好物推荐',
    'Next.js', 'React', 'Tailwind', 'Design', 'Life',
    'Coding', 'Reading', 'AI', 'Algorithm', 'Physics',
    'Math', 'Cosmos', 'Space', 'Time', 'Future'
  ];
  // Triple the density
  const categoryNames = [...baseCategories, ...baseCategories, ...baseCategories];

  const [tags, setTags] = useState<Tag[]>([]);
  
  // Configuration
  const radius = 90; // Reduced radius for "electron cloud" look
  const d = 300; 
  const [isHovering, setIsHovering] = useState(false);

  // Initialize tags
  useEffect(() => {
    const newTags: Tag[] = [];
    const length = categoryNames.length;
    
    for (let i = 0; i < length; i++) {
      const phi = Math.acos(-1 + (2 * i + 1) / length);
      const theta = Math.sqrt(length * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      newTags.push(new Tag(categoryNames[i], x, y, z));
    }
    setTags(newTags);
  }, []);

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    let angleX = 0; 
    let angleY = 0;
    
    // Target speeds (smooth transition)
    let targetAngleX = 0.002; // Default very slow drift
    let targetAngleY = 0.002;

    const animate = () => {
      // Smoothly interpolate current speed towards target speed
      angleX += (targetAngleX - angleX) * 0.1;
      angleY += (targetAngleY - angleY) * 0.1;

      if (Math.abs(angleX) > 0.0001 || Math.abs(angleY) > 0.0001) {
        setTags(prevTags => {
          return prevTags.map(tag => {
            // Rotate X
            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);
            const y1 = tag.point.y * cosX - tag.point.z * sinX;
            const z1 = tag.point.y * sinX + tag.point.z * cosX;

            // Rotate Y
            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);
            const x2 = tag.point.x * cosY - z1 * sinY;
            const z2 = tag.point.x * sinY + z1 * cosY;

            tag.point.x = x2;
            tag.point.y = y1;
            tag.point.z = z2;

            return tag;
          });
        });
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // If mouse is inside, control rotation
      const dx = (e.clientX - centerX) / (rect.width / 2); 
      const dy = (e.clientY - centerY) / (rect.height / 2); 

      // Speed up when hovering
      targetAngleY = dx * 0.05; 
      targetAngleX = -dy * 0.05;
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      // Slow down to idle drift when leaving
      targetAngleX = 0.002;
      targetAngleY = 0.002;
      setIsHovering(false);
    };

    const container = containerRef.current;
    if (container) {
       container.addEventListener('mousemove', handleMouseMove);
       container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
         container.removeEventListener('mousemove', handleMouseMove);
         container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="card">
      <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">标签云</h3>
      <div 
        ref={containerRef} 
        className="relative h-[240px] w-full flex items-center justify-center overflow-hidden cursor-crosshair select-none bg-white/5 rounded-lg"
        style={{ perspective: '800px' }}
      >
        {tags.map((tag, index) => {
          const scale = d / (d - tag.point.z);
          const alpha = (tag.point.z + radius) / (2 * radius); 
          
          // Varying font sizes for "cloud" effect
          const fontSize = Math.max(10, 12 * scale); 

          return (
            <Link
              key={index}
              href={`/categories/${tag.text}`}
              className="absolute font-medium transition-colors hover:text-primary hover:z-50"
              style={{
                transform: `translate3d(${tag.point.x}px, ${tag.point.y}px, 0) scale(${scale})`,
                opacity: Math.max(0.1, alpha), // Lower minimum opacity for depth
                zIndex: Math.floor(scale * 100),
                color: isHovering ? `hsl(${(index * 137.5) % 360}, 60%, 50%)` : '#aaa', // Light gray when idle, Color when hover
                fontSize: `${fontSize}px`,
                willChange: 'transform, opacity',
                pointerEvents: alpha < 0.5 ? 'none' : 'auto' // Only clickable if in front
              }}
            >
              {tag.text}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
