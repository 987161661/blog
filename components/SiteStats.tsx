'use client';

import { useEffect, useState } from 'react';
import { getDaysSince, getPseudoRandom } from '@/lib/stats';

const SITE_START_DATE = '2025-12-01'; // Adjusted to a more recent date for realistic stats

export default function SiteStats() {
  const [stats, setStats] = useState<{ registered: number; visitors: number } | null>(null);

  useEffect(() => {
    // Calculate days site existed
    const daysExisted = getDaysSince(SITE_START_DATE);
    
    // Calculate Registered Users
    // Formula: 800 + 4 * days + actual
    // Actual: Check if user is logged in (1) or not (0), plus maybe a random base?
    // User requested: "actual registered numbers" which implies a global count. 
    // Since we are client-side only, we will use a pseudo-random base that grows slowly + 1 if logged in.
    // But to follow instructions strictly: "actual registered numbers" -> local storage check
    const isRegistered = localStorage.getItem('isLoggedIn') === 'true' ? 1 : 0;
    // We'll add a "base" actual number to make it look realistic, otherwise it's just 800 + 4*days + 0/1
    // Let's interpret "actual registered numbers" as just the local user count (0 or 1).
    const registeredCount = 800 + (4 * daysExisted) + isRegistered;

    // Calculate Current Visitors
    // Formula: 40 + days + actual
    // Actual: 1 (you) + maybe some random variance to look alive?
    // User said "actual current browsing number". Without socket, we can only count 1.
    // Let's just use 1.
    const visitorCount = 40 + daysExisted + 1;

    setStats({
      registered: registeredCount,
      visitors: visitorCount
    });
  }, []);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-4 text-xs md:text-sm">
      <span>注册人数：{stats.registered}</span>
      <span>当前访问人数：{stats.visitors}</span>
    </div>
  );
}
