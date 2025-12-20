'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Rss, Mail, LayoutGrid, Sigma, User, Search, Globe, Box, Archive, LogOut, PenTool } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SiteStats from './SiteStats';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin (simple email check for UI)
    if (user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Update: Mobile Layout & Stats Verification
  return (
    <div className="w-full font-sans">
      {/* 1. Top Bar (Top-most strip) */}
      <div className="bg-[#e8e4d9] dark:bg-[#505050] text-[#7d7065] dark:text-[#ccc] text-xs py-1 transition-colors duration-300">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-1 md:gap-0">
          <div className="flex items-center justify-between w-full md:w-auto gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="hidden md:inline">唯有思考方能启迪智慧</span>
            </div>
            
            {/* Mobile Auth & Donate Buttons (Moved here for better layout) */}
            <div className="flex md:hidden items-center space-x-2">
              {isLoggedIn ? (
                <>
                  <span className="text-[#d4a017] dark:text-[#f0c20c] px-1 truncate max-w-[80px]">{user?.name}</span>
                  {isAdmin && (
                    <Link href="/admin" className="hover:text-[#d4a017] dark:hover:text-white px-1">
                      <PenTool className="h-3 w-3" />
                    </Link>
                  )}
                  <button onClick={() => logout()} className="hover:text-[#d4a017] dark:hover:text-white px-1">
                    <LogOut className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register" className="hover:text-[#d4a017] dark:hover:text-white px-1">注册</Link>
                  <Link href="/login" className="hover:text-[#d4a017] dark:hover:text-white px-1">登录</Link>
                </>
              )}
              <Link href="/donate" className="hover:text-[#d4a017] dark:hover:text-white px-1">打赏</Link>
            </div>

            <div className="hidden md:block pl-4 border-l border-[#b3a99f] dark:border-[#666]">
              <SiteStats />
            </div>
          </div>
          
          {/* Mobile Stats (Visible only on mobile, new line) */}
          <div className="md:hidden w-full flex justify-center border-t border-[#b3a99f]/30 dark:border-[#666]/30 pt-1 mt-1">
            <SiteStats />
          </div>

          <div className="hidden md:flex space-x-2 divide-x divide-[#b3a99f] dark:divide-[#666]">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2 px-2">
                 <span className="text-[#d4a017] dark:text-[#f0c20c]">欢迎, {user?.name}</span>
                 {isAdmin && (
                   <Link href="/admin" className="hover:text-[#d4a017] dark:hover:text-white flex items-center gap-1">
                     <PenTool className="h-3 w-3" />创作
                   </Link>
                 )}
                 <button onClick={() => logout()} className="hover:text-[#d4a017] dark:hover:text-white cursor-pointer flex items-center gap-1">
                   <LogOut className="h-3 w-3" />退出
                 </button>
              </div>
            ) : (
              <Link href="/login" className="hover:text-[#d4a017] dark:hover:text-white px-2">登录/注册</Link>
            )}
            <Link href="/donate" className="hover:text-[#d4a017] dark:hover:text-white px-2">打赏</Link>
            <Link href="/latex" className="hover:text-[#d4a017] dark:hover:text-white px-2">公式</Link>
            <button className="hover:text-[#d4a017] dark:hover:text-white px-2 cursor-pointer">天象</button>
            <button className="hover:text-[#d4a017] dark:hover:text-white px-2 cursor-pointer">链接</button>
            <button className="hover:text-[#d4a017] dark:hover:text-white px-2 cursor-pointer">时光</button>
            <button className="hover:text-[#d4a017] dark:hover:text-white px-2 cursor-pointer">博览</button>
            <Link href="/archives" className="hover:text-[#d4a017] dark:hover:text-white px-2">归档</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Area (Black Section) */}
      <div className="bg-[#f7f5e8] dark:bg-[#2a2a2a] text-[#4a3e35] dark:text-white py-2 md:py-6 transition-colors duration-300">
        <div className="container-custom flex flex-row items-center justify-between gap-1 md:gap-4">
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-2 md:gap-4 hover:opacity-90 transition-opacity shrink-0">
            <div className="relative w-8 h-8 md:w-16 md:h-16 shrink-0">
                       <Image 
                         src="/logo.svg" 
                         alt="Logo" 
                         fill
                         className="object-contain"
                       />
                    </div>
            <div className="flex flex-col items-start">
              <h1 className="text-lg md:text-4xl text-[#d4a017] dark:text-[#f0c20c] font-bold tracking-wider whitespace-nowrap" style={{ fontFamily: 'var(--font-ma-shan-zheng), serif' }}>梓安的思维空间</h1>
              <span className="text-[10px] md:text-xs text-[#00bfff] tracking-[0.2em] mt-1 hidden md:block">ZiAn's Space</span>
            </div>
          </Link>

          {/* Icons Area - Blue Box: Smaller on mobile, unobtrusive */}
          <div className="flex flex-row items-center justify-end gap-2 md:gap-6 text-[#7d7065] dark:text-[#ccc] w-auto mt-0 opacity-100">
            <button className="flex flex-col items-center group cursor-pointer">
              <Rss className="h-4 w-4 md:h-8 md:w-8 mb-0 md:mb-1 group-hover:text-orange-500 transition-colors" />
              <span className="text-[10px] md:text-xs hidden md:block">欢迎订阅</span>
            </button>
            <button className="flex flex-col items-center group cursor-pointer">
              <Mail className="h-4 w-4 md:h-8 md:w-8 mb-0 md:mb-1 group-hover:text-blue-400 transition-colors" />
              <span className="text-[10px] md:text-xs hidden md:block">个性邮箱</span>
            </button>
            <button className="flex flex-col items-center group cursor-pointer">
              <LayoutGrid className="h-4 w-4 md:h-8 md:w-8 mb-0 md:mb-1 group-hover:text-green-400 transition-colors" />
              <span className="text-[10px] md:text-xs hidden md:block">频道汇总</span>
            </button>
            <Link href="/latex" className="flex flex-col items-center group">
              <Sigma className="h-4 w-4 md:h-8 md:w-8 mb-0 md:mb-1 group-hover:text-yellow-400 transition-colors" />
              <span className="text-[10px] md:text-xs hidden md:block">LaTex</span>
            </Link>
            <Link href="/about" className="flex flex-col items-center group">
              <User className="h-4 w-4 md:h-8 md:w-8 mb-0 md:mb-1 group-hover:text-red-400 transition-colors" />
              <span className="text-[10px] md:text-xs hidden md:block">关于博主</span>
            </Link>
          </div>

          {/* Search/Welcome Box (Right-most) */}
          <div className="bg-[#fdfbf5] dark:bg-[#333] border border-[#e6dfc8] dark:border-[#444] p-3 rounded w-full md:w-64 text-xs text-[#7d7065] dark:text-[#999] relative hidden lg:block transition-colors duration-300">
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-r-[10px] border-t-[#d4a017] dark:border-t-white border-r-transparent transform rotate-90"></div>
            <h3 className="text-[#4a3e35] dark:text-white font-bold mb-1">欢迎你提交内容</h3>
            <p className="leading-tight">
              欢迎访问“梓安的思维空间”，这里将与您共同探讨技术，回味人生百态；也期待大家的分享~
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar (Dark Strip) - Green Box: 2 rows on mobile */}
      <nav className="bg-[#e0dcd1] dark:bg-[#1a1a1a] border-t border-[#d4a017] dark:border-[#333] border-b border-[#c8c0b0] dark:border-black transition-colors duration-300">
        <div className="container-custom">
          <ul className="grid grid-cols-5 md:flex md:flex-wrap text-[#5c5248] dark:text-[#ccc]">
            {[
              { name: '奇思妙想', en: 'Ideas' },
              { name: '科幻解构', en: 'Sci-Fi' },
              { name: '小说创作', en: 'Novel' },
              { name: '奇妙物理', en: 'Physics' },
              { name: '技术分享', en: 'Tech' },
              { name: '创意项目', en: 'Projects' },
              { name: '生活/情感', en: 'Life', href: '/categories/Life' },
              { name: '好文精赏', en: 'Reading' },
              { name: '好物推荐', en: 'Goods' },
              { name: '同好交流', en: 'Community', href: '/community' },
            ].map((item, index) => (
              <li key={item.name} className="text-center group border-r border-b md:border-b-0 border-[#333] md:last:border-r-0 md:flex-1">
                <Link href={item.href || `/categories/${item.name}`} className="block py-1 md:py-3 hover:bg-[#f0c20c] hover:text-black transition-all duration-300 h-full flex flex-col justify-center">
                  <div className="font-bold text-xs md:text-base">{item.name}</div>
                  <div className="text-[8px] md:text-[10px] text-[#666] uppercase group-hover:text-black/70 hidden md:block">{item.en}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 4. Info Area (Dark Area below Nav) - Red Box: Hidden on mobile */}
      <div className="hidden md:block bg-[#e8e4d9] dark:bg-[#222] border-b border-border shadow-sm mb-6 transition-colors duration-300">
        <div className="container-custom py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-secondary">
          {/* Left Block */}
          <div className="flex items-start space-x-3 border-r border-border pr-4">
            <Globe className="h-10 w-10 text-blue-500 shrink-0" />
            <div>
              <p className="font-bold text-foreground">感谢 Vercel 提供网络空间</p>
              <p className="text-xs mt-1">感谢开源社区提供的各种优秀工具库！</p>
            </div>
          </div>

          {/* Middle Block */}
          <div className="flex items-start space-x-3 border-r border-border pr-4">
             <Box className="h-10 w-10 text-orange-500 shrink-0" />
             <div>
               <p className="font-bold text-foreground">知识共享署名-非商业性使用</p>
               <p className="text-xs mt-1">转载本站内容必须遵循 署名-非商业用途-保持一致 的创作共用协议。</p>
             </div>
          </div>

          {/* Right Block */}
          <div className="flex flex-col space-y-2 pl-2">
            <p className="font-bold text-foreground text-xs">参与梓安的思维空间</p>
            <div className="flex space-x-2">
               <Link href="/register" className="bg-[#6dbf46] hover:bg-[#5da53b] text-white px-3 py-1 rounded text-xs transition-colors">
                 会员注册
               </Link>
               <Link href="/login" className="bg-[#6dbf46] hover:bg-[#5da53b] text-white px-3 py-1 rounded text-xs transition-colors">
                 会员登录
               </Link>
               <Link href="/archives" className="bg-[#3b8cff] hover:bg-[#2a75e0] text-white px-3 py-1 rounded text-xs flex items-center transition-colors">
                 <Archive className="h-3 w-3 mr-1" /> 全站归档
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
