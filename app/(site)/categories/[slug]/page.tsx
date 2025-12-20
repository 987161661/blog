import { getAllPosts, getCategories } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import CategoryGuard from "@/components/CategoryGuard";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  // Handle alias for "Life" to avoid URL encoding issues with "/"
  const categoryName = decodedSlug === 'Life' ? '生活/情感' : decodedSlug;
  
  const allPosts = await getAllPosts();
  const posts = allPosts.filter(post => post.category.trim() === categoryName.trim());

  return (
    <CategoryGuard category={categoryName}>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <h1 className="text-2xl font-bold">分类: {categoryName}</h1>
        </div>
        
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <p className="text-secondary text-center py-10">该分类下暂无文章</p>
        )}
      </div>
    </CategoryGuard>
  );
}
