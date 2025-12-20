'use client';

import dynamic from 'next/dynamic';

const TagCloud = dynamic(() => import('./TagCloud'), { ssr: false });

export default function TagCloudWrapper() {
  return <TagCloud />;
}
