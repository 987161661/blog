'use client';

import Link from 'next/link';
import { Post } from '@/lib/posts';
import { format, parseISO } from 'date-fns';
import { Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { calculateEstimatedReadCount, getRealViewCount, getRealCommentCount } from '@/lib/stats';
import { useAuth } from '@/contexts/AuthContext';

export default function PostCard({ post }: { post: Post }) {
  let date = parseISO(post.date);
  if (isNaN(date.getTime())) {
    date = new Date(); // Fallback to now if invalid
  }
  
  const [readCount, setReadCount] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCount = async () => {
      // 1. Get legacy base
      const base = calculateEstimatedReadCount(post.slug, post.date);
      // 2. Get real stats (PostCard only reads, does not increment)
      const real = await getRealViewCount(post.slug);

      const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
      if (isAdmin) {
        setReadCount(real);
      } else {
        setReadCount(base + real);
      }
      
      // 3. Get comment count
      const comments = await getRealCommentCount(post.slug);
      // console.log(`PostCard: ${post.slug} comments: ${comments}`);
      setCommentCount(comments);
    };
    fetchCount();
  }, [post.slug, post.date, user]);
  
  return (
    <article className="flex gap-6 py-8 border-b border-border last:border-0 group">
      {/* Date Badge (Left Side - kexue.fm style) */}
      <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-white/5 rounded-lg shrink-0 border border-border group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors">
        <span className="text-2xl font-bold text-foreground">{format(date, 'dd')}</span>
        <span className="text-xs text-secondary uppercase">{format(date, 'MMM')}</span>
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-2 text-xs text-secondary md:hidden">
          <time dateTime={post.date}>{format(date, 'yyyy-MM-dd')}</time>
          <span>•</span>
          <span>{post.category}</span>
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary group-hover:underline decoration-2 underline-offset-4 transition-colors leading-tight break-words">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-secondary leading-relaxed line-clamp-3 mb-4 text-sm md:text-base">
          {post.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-secondary">
             <span className="hidden md:flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <Tag className="h-3 w-3" />
                {post.category}
             </span>
             <span>阅读: {readCount !== null ? readCount : '...'}</span>
             <span>评论: {commentCount}</span>
          </div>
          <Link 
            href={`/posts/${post.slug}`}
            className="text-xs font-bold text-primary border border-primary/20 px-3 py-1 rounded hover:bg-primary hover:text-white transition-all"
          >
            阅读全文
          </Link>
        </div>
      </div>
    </article>
  );
}
