'use client';

import { useEffect, useState } from 'react';
import { getDaysSince } from '@/lib/stats';
import { getRealUserCount } from '@/lib/stats';
import { useAuth } from '@/contexts/AuthContext';

const SITE_START_DATE = '2025-12-01'; // Adjusted to a more recent date for realistic stats

export default function SiteStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ registered: number; visitors: number } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      // Calculate days site existed
      const daysExisted = getDaysSince(SITE_START_DATE);
      
      // 1. Registered Users: Hybrid Approach
      // Base (Legacy) + Real (Supabase)
      const baseRegistered = 800 + (4 * daysExisted);
      const realRegistered = await getRealUserCount();
      // If admin, show ONLY real data. If public, show inflated data.
      const totalRegistered = isAdmin ? realRegistered : (baseRegistered + realRegistered);

      // 2. Visitors: Simulated for now
      // If admin, show 1 (real). If public, show simulated.
      const visitorCount = isAdmin ? 1 : (40 + daysExisted + 1);

      setStats({
        registered: totalRegistered,
        visitors: visitorCount
      });
    };

    fetchStats();
  }, [isAdmin]); // Re-run when admin status changes

  if (!stats) return null;

  return (
    <div className="flex items-center gap-4 text-xs md:text-sm">
      <span>{isAdmin ? '真实注册' : '注册人数'}：{stats.registered}</span>
      <span>{isAdmin ? '真实在线' : '当前访问人数'}：{stats.visitors}</span>
    </div>
  );
}
