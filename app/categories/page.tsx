import { getCategories, getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Categories() {
  const categories = getCategories();
  const posts = getAllPosts();

  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-8">文章分类</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(category => {
          const count = posts.filter(p => p.category === category).length;
          return (
            <Link 
              key={category} 
              href={`/categories/${category}`}
              className="p-4 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all flex justify-between items-center group"
            >
              <span className="font-medium group-hover:text-primary transition-colors">{category}</span>
              <span className="bg-accent px-2 py-1 rounded text-xs text-secondary">{count} 篇</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
