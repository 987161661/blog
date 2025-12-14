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

export function calculateReadCount(slug: string, date: string): number {
  if (typeof window === 'undefined') return 0; // Server-side return 0

  const daysSinceCreation = getDaysSince(date);
  
  // Deterministic random base (1-20)
  const randomBase = getPseudoRandom(slug, 1, 20);

  // Real reads from localStorage
  const storageKey = `views_${slug}`;
  let realReads = 0;
  try {
    const stored = localStorage.getItem(storageKey);
    realReads = stored ? parseInt(stored, 10) : 0;
  } catch (e) {
    console.error('Local storage error', e);
  }

  return randomBase + (daysSinceCreation * 3) + realReads;
}

export function incrementReadCount(slug: string): void {
  if (typeof window === 'undefined') return;

  const storageKey = `views_${slug}`;
  try {
    const stored = localStorage.getItem(storageKey);
    let realReads = stored ? parseInt(stored, 10) : 0;
    realReads += 1;
    localStorage.setItem(storageKey, realReads.toString());
  } catch (e) {
    console.error('Local storage error', e);
  }
}
