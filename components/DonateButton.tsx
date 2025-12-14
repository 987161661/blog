'use client';

import { useState } from 'react';

export default function DonateButton() {
  const [hovered, setHovered] = useState(false);
  const text = "打赏支持";
  
  return (
    <div className="relative z-[10000] inline-block">
      <a 
        href="/donate" 
        className="no-underline group"
        onClick={(e) => {
          // Allow default navigation, but log it
          console.log('Donate button clicked');
        }}
      >
        <div 
          className="flex items-center justify-center gap-2 cursor-pointer select-none bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-primary/20 hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          title="点击打赏支持"
        >
          <div className="flex">
            {text.split('').map((char, index) => (
          <span
            key={index}
            className={`
              inline-block text-3xl md:text-5xl font-black text-[#ff4d4f]
              transition-all duration-300 ease-out transform
              ${hovered ? '-translate-y-3 scale-110' : ''}
            `}
            style={{
              transitionDelay: `${index * 50}ms`,
              textShadow: '3px 3px 0px #b92b2d, 5px 5px 10px rgba(0,0,0,0.2)',
              fontFamily: '"Comic Sans MS", "YouYuan", "Chalkboard SE", sans-serif',
              WebkitTextStroke: '2px white',
              paintOrder: 'stroke fill'
            }}
          >
            {char}
          </span>
        ))}
          </div>
            <span 
              className={`
                inline-block text-3xl md:text-5xl ml-2 filter drop-shadow-md
                transition-all duration-300 ease-out transform
                ${hovered ? '-translate-y-3 scale-110 rotate-12' : ''}
              `}
              style={{ transitionDelay: '200ms' }}
          >
            🎈
          </span>
        </div>
      </a>
    </div>
  );
}
