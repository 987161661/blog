import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compareDesc, parseISO } from 'date-fns';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  content: string;
}

export function getAllPosts(): Post[] {
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

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    return compareDesc(parseISO(a.date), parseISO(b.date));
  });
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
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

export function getCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}
