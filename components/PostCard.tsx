import Link from 'next/link';
import { Post } from '@/lib/posts';
import { format, parseISO } from 'date-fns';
import { Tag } from 'lucide-react';

export default function PostCard({ post }: { post: Post }) {
  const date = parseISO(post.date);
  
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
          <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary group-hover:underline decoration-2 underline-offset-4 transition-colors leading-tight">
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
             <span>阅读: 1,234</span>
             <span>评论: 0</span>
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
