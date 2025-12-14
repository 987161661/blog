import { supabase } from './supabaseClient';

export function getDaysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Simple deterministic hash for pseudo-random numbers based on string
export function getPseudoRandom(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const range = max - min + 1;
  return Math.abs(hash % range) + min;
}

// ---------------------------------------------------------
// Real Stats via Supabase
// ---------------------------------------------------------

// Get real view count (fallback to 0 if table doesn't exist yet)
export async function getRealViewCount(slug: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('post_views')
      .select('view_count')
      .eq('slug', slug)
      .single();

    if (error) return 0;
    return data?.view_count || 0;
  } catch (e) {
    return 0;
  }
}

// Increment view count via RPC (Safe & Atomic)
export async function incrementRealViewCount(slug: string): Promise<void> {
  try {
    await supabase.rpc('increment_view_count', { page_slug: slug });
  } catch (e) {
    console.error('Failed to increment view count:', e);
  }
}

// Get total registered users via RPC
export async function getRealUserCount(): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_user_count');
    if (error) return 0;
    return data as number;
  } catch (e) {
    return 0;
  }
}

// Legacy function (kept for reference or hybrid use)
export function calculateEstimatedReadCount(slug: string, date: string): number {
  const daysSinceCreation = getDaysSince(date);
  const randomBase = getPseudoRandom(slug, 1, 20);
  return randomBase + (daysSinceCreation * 3);
}
