'use client';

import { useEffect, useState } from 'react';
import { Eye, Clock, User } from 'lucide-react';

interface Props {
  slug: string;
  date: string;
  contentLength: number;
}

export default function PostStats({ slug, date, contentLength }: Props) {
  const [readCount, setReadCount] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Calculate estimated reading time (assuming ~800 chars/min for fast reading/skimming as per user feedback)
  const readingTime = Math.max(1, Math.ceil(contentLength / 800));

  useEffect(() => {
    setMounted(true);
    
    // Calculate Days Since Creation
    const postDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const daysSinceCreation = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Generate deterministic "random" base number (1-20) based on slug to avoid hydration mismatch if possible,
    // but user asked for random. To keep it consistent per session, we can just use Math.random() once on mount.
    // User formula: random(1, 20) + days*3 + real_reads
    const randomBase = Math.floor(Math.random() * 20) + 1;

    // Get "Real Read Count" from localStorage (simulate real reads)
    const storageKey = `views_${slug}`;
    let realReads = 0;
    try {
      const stored = localStorage.getItem(storageKey);
      realReads = stored ? parseInt(stored, 10) : 0;
      
      // Increment view count for this session/user
      // To avoid infinite increment on strict mode re-renders, we could check a session flag, 
      // but for simplicity let's just increment.
      realReads += 1;
      localStorage.setItem(storageKey, realReads.toString());
    } catch (e) {
      console.error('Local storage error', e);
    }

    const totalReads = randomBase + (daysSinceCreation * 3) + realReads;
    setReadCount(totalReads);

  }, [slug, date]);

  if (!mounted) {
    return (
      <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-6 animate-pulse">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>预计阅读时间：{readingTime} 分钟</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>作者：簪君</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>阅读人数：...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-6 border-b border-border/50 pb-4">
      <div className="flex items-center gap-1" title="基于字数估算">
        <Clock className="w-4 h-4" />
        <span>预计阅读时间：{readingTime} 分钟</span>
      </div>
      <div className="flex items-center gap-1">
        <User className="w-4 h-4" />
        <span>作者：簪君</span>
      </div>
      <div className="flex items-center gap-1" title="热度指数">
        <Eye className="w-4 h-4" />
        <span>阅读人数：{readCount}</span>
      </div>
    </div>
  );
}
