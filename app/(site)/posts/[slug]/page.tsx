import { getAllPosts, getPostBySlug } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Calendar, Tag } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.css';
import CommentSection from '@/components/CommentSection';
import PostStats from '@/components/PostStats';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="card">
      <header className="mb-8 border-b border-border pb-8">
        <div className="flex items-center space-x-4 text-sm text-secondary mb-4">
          <span className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{format(parseISO(post.date), 'yyyy-MM-dd')}</time>
          </span>
          <span className="flex items-center space-x-1 text-primary">
            <Tag className="h-4 w-4" />
            <span>{post.category}</span>
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <PostStats 
          slug={post.slug} 
          date={post.date} 
          contentLength={post.content.length} 
        />
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeRaw]}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <CommentSection slug={post.slug} />
    </article>
  );
}
