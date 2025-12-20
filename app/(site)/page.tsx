import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const allPosts = await getAllPosts();
  
  // Limit to latest 15 posts to improve mobile performance
  const posts = allPosts.slice(0, 15);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <h1 className="text-2xl font-bold">最新文章</h1>
      </div>
      
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
          {allPosts.length > 15 && (
            <div className="flex justify-center pt-4">
              <a href="/archives" className="px-6 py-2 border border-border rounded hover:bg-accent transition-colors text-sm">
                查看更多文章...
              </a>
            </div>
          )}
        </>
      ) : (
        <p className="text-secondary text-center py-10">暂无文章</p>
      )}
    </div>
  );
}
