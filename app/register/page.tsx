'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock register logic
    if (name && email && password) {
      login(name, email);
      router.push('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md card relative animate-in fade-in zoom-in duration-300">
        <Link href="/" className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors">
          <X className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">会员注册</h1>
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
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90 transition-opacity font-bold shadow-md">
            注册
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          已有账号？ <Link href="/login" className="text-primary hover:underline font-bold">立即登录</Link>
        </div>
      </div>
    </div>
  );
}
