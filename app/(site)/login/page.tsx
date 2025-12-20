'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email && password) {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Email not confirmed')) {
          setError('您的邮箱尚未验证，请检查收件箱（包括垃圾邮件）并点击验证链接。');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('邮箱或密码错误。');
        } else {
          setError('登录失败：' + error.message);
        }
      } else {
        router.push('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="w-full max-w-md card relative animate-in fade-in zoom-in duration-300 bg-background my-8">
        <Link href="/" className="absolute top-2 right-2 p-2 text-secondary hover:text-primary transition-colors z-10" aria-label="关闭">
          <X className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">会员登录</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <div>
            <label className="block text-sm font-medium mb-1">邮箱</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">密码</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="******"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90 transition-opacity font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          还没有账号？ <Link href="/register" className="text-primary hover:underline font-bold">立即注册</Link>
        </div>
        <Link href="/" className="block w-full text-center py-2 border border-border rounded-md text-secondary hover:text-primary hover:border-primary transition-colors mt-4">
          返回首页
        </Link>
      </div>
    </div>
  );
}
