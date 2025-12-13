import { getAllPosts, getCategories } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    slug: category,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const posts = getAllPosts().filter(post => post.category === decodedSlug);

  if (posts.length === 0) {
    // Ideally check if category exists, but empty list is also fine or 404
    // If generatedStaticParams covers it, then dynamic ones might fall here.
    // Let's return 404 if no posts found for this category (implies invalid category if we assume strict)
    // or just show empty list.
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <h1 className="text-2xl font-bold">分类: {decodedSlug}</h1>
      </div>
      
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))
      ) : (
        <p className="text-secondary text-center py-10">该分类下暂无文章</p>
      )}
    </div>
  );
}
