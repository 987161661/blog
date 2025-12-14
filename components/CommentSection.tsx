'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface Comment {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface Props {
  slug: string;
}

export default function CommentSection({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { isLoggedIn, user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Load comments on mount
  useEffect(() => {
    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel('comments_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `slug=eq.${slug}`,
        },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug]);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('slug', slug)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Use logged in user name or 'Guest'
    const userName = user?.name || 'Guest';

    const { error } = await supabase.from('comments').insert({
      slug,
      user_name: userName,
      content: newComment,
    });

    if (error) {
      alert('发表评论失败: ' + error.message);
    } else {
      setNewComment('');
      // Optimistic update handled by subscription, or we can fetch again
      // We rely on subscription for now
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        评论 ({comments.length})
      </h2>

      {/* Comment List */}
      <div className="space-y-6 mb-8">
        {loading ? (
           <p className="text-secondary">加载评论中...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-medium text-primary">
                  <User className="w-4 h-4" />
                  {comment.user_name}
                </div>
                <div className="text-xs text-secondary">{new Date(comment.created_at).toLocaleDateString()}</div>
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
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-bold shadow-sm"
            >
              提交评论
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="mb-4 text-secondary">请登录后发表评论</p>
            <div className="flex justify-center gap-4">
              <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-md hover:opacity-90 font-bold">
                登录
              </Link>
              <Link href="/register" className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-primary/5 font-bold">
                注册
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
