'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Comment {
  id: string;
  user: string;
  content: string;
  date: string;
}

interface Props {
  slug: string;
}

export default function CommentSection({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { isLoggedIn, user } = useAuth();

  // Load comments on mount
  useEffect(() => {
    // Load comments for this post
    const storedComments = localStorage.getItem(`comments_${slug}`);
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments));
      } catch (e) {
        console.error('Failed to parse comments', e);
      }
    } else {
      // Mock some initial comments if empty (optional, for demo)
      if (slug === 'project-plan') {
         setComments([
           { id: '1', user: 'Visitor', content: '期待你的2026年计划！', date: '2025-12-14' }
         ]);
      }
    }
  }, [slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: user?.name || 'User',
      content: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setNewComment('');
    
    // Save to localStorage
    localStorage.setItem(`comments_${slug}`, JSON.stringify(updatedComments));
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        评论 ({comments.length})
      </h2>

      {/* Comment List */}
      <div className="space-y-6 mb-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-medium text-primary">
                  <User className="w-4 h-4" />
                  {comment.user}
                </div>
                <div className="text-xs text-secondary">{comment.date}</div>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-secondary italic">暂无评论，来抢沙发吧~</p>
        )}
      </div>

      {/* Comment Form */}
      <div className="bg-accent/10 p-6 rounded-lg border border-border">
        {isLoggedIn ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">发表评论</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[100px]"
                placeholder="分享你的想法..."
                required
              />
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-primary text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-bold shadow-sm"
              >
                提交评论
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="mb-4 text-lg">登录后参与讨论</p>
            <div className="flex justify-center gap-4">
              <Link href="/login" className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity font-bold">
                登录
              </Link>
              <Link href="/register" className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors font-bold">
                注册
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
