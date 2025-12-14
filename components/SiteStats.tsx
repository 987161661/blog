'use client';

import { useEffect, useState } from 'react';
import { getDaysSince } from '@/lib/stats';
import { getRealUserCount } from '@/lib/stats';

const SITE_START_DATE = '2025-12-01'; // Adjusted to a more recent date for realistic stats

export default function SiteStats() {
  const [stats, setStats] = useState<{ registered: number; visitors: number } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      // Calculate days site existed
      const daysExisted = getDaysSince(SITE_START_DATE);
      
      // 1. Registered Users: Hybrid Approach
      // Base (Legacy) + Real (Supabase)
      const baseRegistered = 800 + (4 * daysExisted);
      const realRegistered = await getRealUserCount();
      const totalRegistered = baseRegistered + realRegistered;

      // 2. Visitors: Simulated for now (Requires Realtime Presence to be fully real)
      // We will keep this simulated until we add Realtime Presence
      const visitorCount = 40 + daysExisted + 1;

      setStats({
        registered: totalRegistered,
        visitors: visitorCount
      });
    };

    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-4 text-xs md:text-sm">
      <span>注册人数：{stats.registered}</span>
      <span>当前访问人数：{stats.visitors}</span>
    </div>
  );
}
