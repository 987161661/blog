import CommentSection from '@/components/CommentSection';
import { MessageCircle, BookOpen } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="card text-center py-10">
        <h1 className="text-3xl font-bold mb-4">同好交流</h1>
        <p className="text-secondary max-w-2xl mx-auto">
          这里是思想碰撞的广场。欢迎各位同好在此交流心得、分享资源、探讨技术与生活。
          请文明发言，共同维护良好的社区氛围。
        </p>
      </div>

      {/* Discussion Area */}
      <div className="card">
        <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">交流广场</h2>
        </div>
        <p className="text-sm text-secondary mb-6">
          无论是技术难题、科幻构想，还是生活感悟，都可以在此畅所欲言。
        </p>
        <CommentSection slug="community-exchange" />
      </div>

      {/* Guestbook Area */}
      <div id="guestbook" className="card">
        <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">留言板</h2>
        </div>
        <p className="text-sm text-secondary mb-6">
          有什么想对博主说的悄悄话，或者对网站的建议，欢迎在此留言。
        </p>
        <CommentSection slug="community-guestbook" />
      </div>
    </div>
  );
}
