import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <h1 className="text-2xl font-bold">最新文章</h1>
      </div>
      
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))
      ) : (
        <p className="text-secondary text-center py-10">暂无文章</p>
      )}
    </div>
  );
}
