'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface Props {
  category: string;
  children: React.ReactNode;
}

export default function CategoryGuard({ category, children }: Props) {
  const { isLoggedIn } = useAuth();
  
  // Check if category is protected
  const isProtected = category === 'Life' || category === '生活/情感' || category === '生活' || category === '情感';

  if (isProtected && !isLoggedIn) {
    return (
      <div className="card py-16 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-secondary/10 p-6 rounded-full">
          <Lock className="w-12 h-12 text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">该栏目已上锁</h2>
          <p className="text-secondary max-w-md mx-auto">
            "{category}" 栏目包含个人生活与情感内容，仅对会员开放。请登录后查看。
          </p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity font-bold shadow-sm"
          >
            立即登录
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition-colors font-bold"
          >
            注册会员
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
