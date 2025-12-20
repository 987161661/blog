'use client';

import { useEffect, useState } from 'react';
import { Eye, Clock, User } from 'lucide-react';
import { incrementRealViewCount, getRealViewCount, calculateEstimatedReadCount } from '@/lib/stats';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  slug: string;
  date: string;
  contentLength: number;
}

export default function PostStats({ slug, date, contentLength }: Props) {
  const { user } = useAuth();
  const [readCount, setReadCount] = useState<number>(0);
  const [realCount, setRealCount] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Calculate estimated reading time (assuming ~800 chars/min for fast reading/skimming as per user feedback)
  const readingTime = Math.max(1, Math.ceil(contentLength / 800));

  // 1. Increment and fetch real stats once on mount
  useEffect(() => {
    const initStats = async () => {
      // Increment first
      await incrementRealViewCount(slug);
      
      // Fetch latest real count
      const count = await getRealViewCount(slug);
      setRealCount(count);
      setMounted(true);
    };

    initStats();
  }, [slug]);

  // 2. Calculate display count based on Admin status
  useEffect(() => {
    const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const estimatedBase = calculateEstimatedReadCount(slug, date);

    if (isAdmin) {
      setReadCount(realCount);
    } else {
      setReadCount(estimatedBase + realCount);
    }
  }, [realCount, user, slug, date]);

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
      <div className="flex items-center gap-1" title={user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? "真实阅读量" : "热度指数"}>
        <Eye className="w-4 h-4" />
        <span>阅读人数：{readCount}</span>
      </div>
    </div>
  );
}
