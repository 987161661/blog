'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (name && email && password) {
      const { data, error } = await signUp(email, password, name);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        if (data?.session) {
           setAutoLogin(true);
           setTimeout(() => {
             router.push('/');
           }, 2000);
        }
      }
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
        <div className="w-full max-w-md card relative animate-in fade-in zoom-in duration-300 text-center py-10 bg-background">
           <h2 className="text-2xl font-bold mb-4 text-primary">注册成功！</h2>
           {autoLogin ? (
             <p className="mb-6">正在为您自动登录，请稍候...</p>
           ) : (
             <>
               <p className="mb-6">请检查您的邮箱完成验证，然后登录。</p>
               <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-md hover:opacity-90 font-bold inline-block">
                 前往登录
               </Link>
             </>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="w-full max-w-md card relative animate-in fade-in zoom-in duration-300 bg-background my-8">
        <Link href="/" className="absolute top-2 right-2 p-2 text-secondary hover:text-primary transition-colors z-10" aria-label="关闭">
          <X className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold mb-6 text-center text-primary mt-2">会员注册</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium mb-1">用户名</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="梓安"
              required
            />
          </div>
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
            {loading ? '注册中...' : '注册'}
          </button>
          
          {/* Explicit Close Button for Mobile */}
          <Link href="/" className="block w-full text-center py-2 border border-border rounded-md text-secondary hover:text-primary hover:border-primary transition-colors mt-4">
            返回首页
          </Link>
        </form>
        <div className="mt-4 text-center text-sm">
          已有账号？ <Link href="/login" className="text-primary hover:underline font-bold">立即登录</Link>
        </div>
      </div>
    </div>
  );
}
