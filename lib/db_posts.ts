import { supabase } from '@/lib/supabaseClient';
import { Post } from '@/lib/posts';

export async function getPostsFromDB(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published') // Only fetch published posts
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return (data || []).map((post: any) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    category: post.category,
    description: post.description,
    content: post.content
  }));
}

export async function getPostBySlugFromDB(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published') // Only fetch published posts
    .single();

  if (error || !data) {
    return null;
  }

  return {
    slug: data.slug,
    title: data.title,
    date: data.date,
    category: data.category,
    description: data.description,
    content: data.content
  };
}

export async function getCategoriesFromDB(): Promise<string[]> {
    const posts = await getPostsFromDB();
    const categories = new Set(posts.map((post) => post.category));
    return Array.from(categories);
}