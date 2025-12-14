import Link from 'next/link';
import { getAllPosts, getCategories } from '@/lib/posts';
import { Search, Github, Mail, Rss, Phone, MessageCircle, MessageSquare, Gitlab } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const TagCloud = dynamic(() => import('./TagCloud'), { ssr: false });

export default function Sidebar() {
  const recentPosts = getAllPosts().slice(0, 5);
  const posts = getAllPosts();
  const categories = getCategories();
  
  // Calculate stats
  const postCount = posts.length;
  const categoryCount = categories.length;
  // Unique tags calculation (mock for now or implement if needed, using category count as placeholder or mock)
  const tagCount = 29; // Mock as per image reference for now or calculate

  return (
    <aside className="space-y-8">
      {/* Search Widget */}
      <div className="card">
         <div className="relative">
            <input 
              type="text" 
              placeholder="搜索..." 
              className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-secondary" />
         </div>
      </div>

      {/* Introduction Card */}
      <div className="card flex flex-col items-center text-center">
         <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-border shadow-md">
             <Image src="/avatar.jpg" alt="梓安" fill className="object-cover" />
          </div>
         
         <h2 className="text-xl font-bold mb-2">梓安</h2>
         <p className="text-sm text-secondary mb-6">Python、物理、自媒体、科幻</p>
         
         {/* Stats */}
         <div className="flex justify-around w-full mb-6 text-sm">
            <div className="flex flex-col items-center">
               <span className="font-bold text-lg">{postCount}</span>
               <span className="text-secondary text-xs">日志</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="font-bold text-lg">{categoryCount}</span>
               <span className="text-secondary text-xs">分类</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="font-bold text-lg">{tagCount}</span>
               <span className="text-secondary text-xs">标签</span>
            </div>
         </div>
         
         {/* Social Icons */}
         <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-secondary mb-6">
            <button type="button" className="flex items-center gap-2 hover:text-primary transition-colors text-left">
               <Github className="h-4 w-4" /> GitHub
            </button>
            <button type="button" className="flex items-center gap-2 hover:text-primary transition-colors text-left">
               <Mail className="h-4 w-4" /> E-Mail
            </button>
            <button type="button" className="flex items-center gap-2 hover:text-primary transition-colors text-left">
               <Gitlab className="h-4 w-4" /> GitLab
            </button>
            <button type="button" className="flex items-center gap-2 hover:text-primary transition-colors text-left">
               <Rss className="h-4 w-4" /> RSS
            </button>
         </div>
         
         {/* Contact Info */}
         <div className="w-full pt-4 border-t border-border text-left text-xs text-secondary space-y-2">
            <div className="flex items-center gap-2">
               <Phone className="h-3 w-3" />
               <span>商务合作：13435692471</span>
            </div>
            <div className="flex items-center gap-2">
               <MessageCircle className="h-3 w-3" />
               <span>微信号：zza-1-5-1-10</span>
            </div>
            <div className="flex items-center gap-2">
               <MessageSquare className="h-3 w-3" />
               <span>qq号：987161661</span>
            </div>
         </div>
      </div>

      {/* Tag Cloud - Hidden on mobile */}
      <div className="hidden md:block">
        <TagCloud />
      </div>

      {/* Recent Posts */}
      <div className="card">
        <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">最新文章</h3>
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link 
                href={`/posts/${post.slug}`} 
                className="block text-sm text-secondary hover:text-primary hover:underline transition-colors line-clamp-2"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Links */}
      <div className="card">
        <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">友情链接</h3>
        <ul className="space-y-2 text-sm text-secondary">
          <li>
             <a href="https://kexue.fm/" target="_blank" className="hover:text-primary transition-colors">科学空间</a>
          </li>
          <li>
             <a href="https://blog.liukuan.cc/" target="_blank" className="hover:text-primary transition-colors">子幽博客</a>
          </li>
        </ul>
      </div>

      {/* Quote */}
      <div className="card bg-primary/5 border-primary/20">
        <p className="italic text-sm text-secondary">
          "Stay hungry, stay foolish."
        </p>
      </div>
    </aside>
  );
}
