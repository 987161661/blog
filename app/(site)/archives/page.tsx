import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { format, parseISO } from 'date-fns';

export default async function Archives() {
  const posts = await getAllPosts();
  
  // Sort posts by date descending
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-8 border-b border-border pb-4">全站归档</h1>
      
      <div className="space-y-8">
        {sortedPosts.map((post) => (
          <article key={post.slug} className="flex items-baseline border-b border-border/50 pb-2">
            <time className="text-secondary w-32 shrink-0 font-mono text-sm">
              {format(parseISO(post.date), 'yyyy-MM-dd')}
            </time>
            <Link 
              href={`/posts/${post.slug}`}
              className="text-lg hover:text-primary hover:underline transition-colors"
            >
              {post.title}
            </Link>
          </article>
        ))}
        
        {sortedPosts.length === 0 && (
          <p className="text-center text-secondary py-10">暂无文章</p>
        )}
      </div>
    </div>
  );
}
