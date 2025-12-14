'use client';

import { useEffect, useState } from 'react';
import { Eye, Clock, User } from 'lucide-react';
import { calculateReadCount, incrementReadCount } from '@/lib/stats';

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
    
    // Increment count on view
    incrementReadCount(slug);
    
    // Calculate total including the new increment
    const total = calculateReadCount(slug, date);
    setReadCount(total);
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
