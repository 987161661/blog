import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compareDesc, parseISO } from 'date-fns';
import { getPostsFromDB, getPostBySlugFromDB } from './db_posts';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  content: string;
}

function getLocalPosts(): Post[] {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Validate data
    const title = matterResult.data.title || 'Untitled';
    const date = matterResult.data.date || new Date().toISOString();
    const category = matterResult.data.category || 'Uncategorized';
    const description = matterResult.data.description || '';

    return {
      slug,
      title,
      date,
      category,
      description,
      content: matterResult.content,
    };
  });

  return allPostsData;
}

export async function getAllPosts(): Promise<Post[]> {
  const localPosts = getLocalPosts();
  let dbPosts: Post[] = [];
  
  try {
    dbPosts = await getPostsFromDB();
  } catch (e) {
    console.error('Failed to fetch DB posts:', e);
  }

  // Deduplicate: DB posts override local posts with same slug
  const postMap = new Map<string, Post>();
  
  // Add local posts first
  localPosts.forEach(post => postMap.set(post.slug, post));
  
  // Add/Overwrite with DB posts
  dbPosts.forEach(post => postMap.set(post.slug, post));

  // Convert to array and sort
  return Array.from(postMap.values()).sort((a, b) => {
    return compareDesc(parseISO(a.date), parseISO(b.date));
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Try DB first
  try {
    const dbPost = await getPostBySlugFromDB(slug);
    if (dbPost) return dbPost;
  } catch (e) {
    console.error('Failed to fetch DB post:', e);
  }

  // Fallback to local
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      title: matterResult.data.title,
      date: matterResult.data.date,
      category: matterResult.data.category,
      description: matterResult.data.description,
      content: matterResult.content,
    };
  } catch (err) {
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}
