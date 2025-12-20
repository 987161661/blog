'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import MDEditor, { commands } from '@uiw/react-md-editor';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.css';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { PenTool, Save, Hash, Type, Link as LinkIcon, Image as ImageIcon, Clock, FileText, LayoutList, Archive, Trash2, Edit2, X, Upload } from 'lucide-react';

// Customizing toolbar commands for Chinese tooltips is now handled inside the component


export default function AdminPage() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initial check
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkTheme();

    // Observe class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [showPostList, setShowPostList] = useState(false);
  const [postListFilter, setPostListFilter] = useState<'draft' | 'published'>('draft');
  const [postsList, setPostsList] = useState<any[]>([]);

  // Image Modal State
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageWidth, setImageWidth] = useState('100%');
  const [imageAlign, setImageAlign] = useState<'none' | 'left' | 'right' | 'center'>('none');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url');

  // Check screen size for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch categories (Updated to use API)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          setExistingCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Auto-generate title and slug for mobile notes
  useEffect(() => {
    if (isMobile && !title) {
      const now = new Date();
      setTitle(format(now, 'yyyy-MM-dd HH:mm 随笔'));
    }
  }, [isMobile]);

  // Auto-generate slug from title (Desktop only)
  useEffect(() => {
    if (!isMobile && title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    } else if (isMobile && !slug) {
       // Mobile slug strategy: timestamp
       setSlug(`note-${Date.now()}`);
    }
  }, [title, isMobile]);

  // Auth check
  useEffect(() => {
    const checkAuth = () => {
       if (!isLoggedIn) {
          router.push('/login');
       } else if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          alert('您没有权限访问此页面');
          router.push('/');
       }
       setAuthChecking(false);
    };
    
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [isLoggedIn, user, router]);

  // Fetch posts for list
  const fetchPosts = async (statusFilter: 'draft' | 'published') => {
      setLoading(true);
      try {
          let query = supabase
            .from('posts')
            .select('id, title, date, status, slug, category, description, content')
            .order('date', { ascending: false });
          
          if (statusFilter === 'draft') {
              query = query.eq('status', 'draft');
          } else {
              // published or scheduled
              query = query.in('status', ['published', 'scheduled']);
          }

          const { data, error } = await query;
          if (error) throw error;
          setPostsList(data || []);
      } catch (err: any) {
          console.error(err);
          alert('获取文章列表失败: ' + err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleOpenList = (filter: 'draft' | 'published') => {
      setPostListFilter(filter);
      setShowPostList(true);
      fetchPosts(filter);
  };

  const handleLoadPost = (post: any) => {
      setTitle(post.title);
      setSlug(post.slug);
      setCategory(post.category);
      setDescription(post.description || '');
      setContent(post.content || '');
      setStatus(post.status);
      setEditingPostId(post.id);
      
      // If scheduled, set time
      if (post.status === 'scheduled' && post.date) {
        setScheduledTime(format(new Date(post.date), "yyyy-MM-dd'T'HH:mm"));
      } else {
        setScheduledTime('');
      }

      setShowPostList(false);
  };

  const handleDeletePost = async (id: number) => {
      if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) return;
      
      try {
          const { error } = await supabase.from('posts').delete().eq('id', id);
          if (error) throw error;
          
          setPostsList(prev => prev.filter(p => p.id !== id));
          
          // If we deleted the current editing post, reset form
          if (editingPostId === id) {
              handleReset();
          }
      } catch (err: any) {
          console.error(err);
          alert('删除失败: ' + err.message);
      }
  };

  const handleReset = () => {
      setTitle('');
      setSlug('');
      setDescription('');
      setContent('');
      setScheduledTime('');
      setEditingPostId(null);
      setStatus('published');
      if (isMobile) {
         setTitle(format(new Date(), 'yyyy-MM-dd HH:mm 随笔'));
         setSlug(`note-${Date.now()}`);
      }
  };

  const handleImageUpload = async () => {
      if (!imageFile) {
          alert('请先选择图片');
          return;
      }
      setImageUploadLoading(true);
      try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          const { error: uploadError } = await supabase.storage
              .from('images') 
              .upload(filePath, imageFile);

          if (uploadError) {
              throw uploadError;
          }

          const { data } = supabase.storage.from('images').getPublicUrl(filePath);
          setImageUrlInput(data.publicUrl);
          setImageFile(null); 
          setActiveTab('url');
      } catch (error: any) {
          console.error('Upload error:', error);
          alert('上传失败: ' + error.message + '\n\n请在 Supabase 后台 SQL Editor 中运行项目根目录下的 "supabase_storage.sql" 脚本以修复此问题（创建 "images" 存储桶并配置权限）。');
      } finally {
          setImageUploadLoading(false);
      }
  };

  const handleInsertImage = () => {
      if (!imageUrlInput) return;

      let style = '';
      if (imageWidth && imageWidth !== '100%') style += `width: ${imageWidth}; `;
      
      let html = '';
      if (imageAlign === 'center') {
          html = `<div style="text-align: center;"><img src="${imageUrlInput}" style="${style}" /></div>`;
      } else if (imageAlign === 'left') {
          style += 'float: left; margin-right: 10px; margin-bottom: 10px;';
          html = `<img src="${imageUrlInput}" style="${style}" />`;
      } else if (imageAlign === 'right') {
          style += 'float: right; margin-left: 10px; margin-bottom: 10px;';
          html = `<img src="${imageUrlInput}" style="${style}" />`;
      } else {
          // Default: just image, maybe width restricted
           html = `<img src="${imageUrlInput}" style="${style}" />`;
      }

      setContent(prev => prev + '\n' + html + '\n');
      setShowImageModal(false);
      setImageUrlInput('');
      setImageFile(null);
      setImageWidth('100%');
      setImageAlign('none');
      setActiveTab('url');
  };

  const handleSubmit = async (e: React.FormEvent | null, targetStatus: 'published' | 'draft' | 'scheduled' = 'published') => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // Final category logic
      const finalCategory = newCategory || category || '未分类';
      // Final description logic (auto-generate if empty)
      const finalDescription = description || content.slice(0, 150).replace(/[#*`]/g, '') + '...';

      // Use 'any' to avoid strict type checking issues during build
      let finalPostStatus: any = targetStatus;
      let finalDate = new Date().toISOString();

      // Handle scheduled publish
      if (targetStatus === 'published' && scheduledTime) {
          const scheduled = new Date(scheduledTime);
          if (scheduled > new Date()) {
             finalPostStatus = 'scheduled';
             finalDate = scheduled.toISOString();
          }
      }

      // Construct post data
      // Note: We are assuming 'status' column exists. If not, this might throw an error or ignore the field depending on DB config.
      const postData: any = {
        title,
        slug: slug || `post-${Date.now()}`,
        category: finalCategory,
        description: finalDescription,
        content,
        date: finalDate,
        author_id: user?.id,
        status: finalPostStatus
      };

      let error;
      if (editingPostId) {
          // Update existing
          const { error: updateError } = await supabase
            .from('posts')
            .update(postData)
            .eq('id', editingPostId);
          error = updateError;
      } else {
          // Insert new
          const { error: insertError } = await supabase.from('posts').insert(postData);
          error = insertError;
      }

      if (error) throw error;
      
      const statusText = finalPostStatus === 'draft' ? '草稿保存成功' : (finalPostStatus === 'scheduled' ? '定时发布设置成功' : '发布成功');
      alert(statusText + '！');
      
      // Reset form if it was a new post or we want to clear after publish (optional, maybe keep it open?)
      // For now, let's clear it to start fresh, unless user wants to keep editing?
      // Usually after publish/save draft, we might want to continue editing. 
      // But previous behavior was reset. Let's keep reset for new posts, but maybe stay on page for edits?
      // Let's just reset for now as per previous logic, but maybe we should setEditingPostId to the new ID if we could get it?
      // Since we don't get ID back easily without select(), let's just reset.
      handleReset();
      
      // Refresh categories if new one added
      if (newCategory) {
        setExistingCategories(prev => [...prev, newCategory]);
        setNewCategory('');
        setCategory(newCategory);
      }
    } catch (err: any) {
      console.error(err);
      alert('操作失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const editorCommands = [
    { ...commands.bold, buttonProps: { ...commands.bold.buttonProps, title: '加粗' } },
    { ...commands.italic, buttonProps: { ...commands.italic.buttonProps, title: '斜体' } },
    { ...commands.strikethrough, buttonProps: { ...commands.strikethrough.buttonProps, title: '删除线' } },
    { ...commands.hr, buttonProps: { ...commands.hr.buttonProps, title: '水平分割线' } },
    { ...commands.title, buttonProps: { ...commands.title.buttonProps, title: '标题' } },
    commands.divider,
    { ...commands.link, buttonProps: { ...commands.link.buttonProps, title: '链接' } },
    { ...commands.quote, buttonProps: { ...commands.quote.buttonProps, title: '引用' } },
    { ...commands.code, buttonProps: { ...commands.code.buttonProps, title: '代码' } },
    { ...commands.codeBlock, buttonProps: { ...commands.codeBlock.buttonProps, title: '代码块' } },
    { 
        ...commands.image, 
        buttonProps: { ...commands.image.buttonProps, title: '插入图片 (支持调整大小/环绕)' },
        execute: () => setShowImageModal(true)
    },
    { ...commands.table, buttonProps: { ...commands.table.buttonProps, title: '表格' } },
    commands.divider,
    { ...commands.unorderedListCommand, buttonProps: { ...commands.unorderedListCommand.buttonProps, title: '无序列表' } },
    { ...commands.orderedListCommand, buttonProps: { ...commands.orderedListCommand.buttonProps, title: '有序列表' } },
    { ...commands.checkedListCommand, buttonProps: { ...commands.checkedListCommand.buttonProps, title: '任务列表' } },
    commands.divider,
    { ...commands.help, buttonProps: { ...commands.help.buttonProps, title: '帮助' } },
  ];

  if (authChecking) {
     return <div className="p-8 text-center">正在验证权限...</div>;
  }

  if (!isLoggedIn || user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) return null;

  // --- Mobile View (MIGI Style) ---
  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f9f9f9] dark:bg-[#1a1a1a]">
        <div className="p-4 flex items-center justify-between bg-white dark:bg-[#2a2a2a] border-b border-border shadow-sm">
          <span className="text-sm text-secondary font-mono">{format(new Date(), 'MMM dd, HH:mm')}</span>
          <div className="flex gap-2">
            <button 
                onClick={() => handleSubmit(null, 'draft')}
                disabled={loading}
                className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-transform"
            >
                存草稿
            </button>
            <button 
                onClick={() => handleSubmit(null, 'published')}
                disabled={loading}
                className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform flex items-center gap-1"
            >
                <Save className="w-4 h-4" /> 发布
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-transparent resize-none focus:outline-none text-lg leading-relaxed placeholder:text-gray-300 dark:placeholder:text-gray-600"
            placeholder="记录当下的想法..."
            autoFocus
          />
        </div>

        {/* Mobile Toolbar (Simplified) */}
        <div className="p-3 bg-white dark:bg-[#2a2a2a] border-t border-border flex gap-4 text-secondary overflow-x-auto">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent text-sm border-none focus:ring-0 outline-none max-w-[100px]"
          >
            <option value="">选择分类</option>
            {existingCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="h-4 w-px bg-border my-auto"></div>
          <button className="p-1 hover:text-primary"><ImageIcon className="w-5 h-5" /></button>
          <button className="p-1 hover:text-primary"><Hash className="w-5 h-5" /></button>
        </div>
      </div>
    );
  }

  // --- Desktop View (Full Power) ---
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl relative">
      {/* Post List Overlay/Modal */}
      {showPostList && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPostList(false)}>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {postListFilter === 'draft' ? <FileText className="text-gray-500" /> : <LayoutList className="text-primary" />}
                        {postListFilter === 'draft' ? '我的草稿箱' : '已发布内容管理'}
                    </h2>
                    <button onClick={() => setShowPostList(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">加载中...</div>
                    ) : postsList.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">暂无{postListFilter === 'draft' ? '草稿' : '内容'}</div>
                    ) : (
                        <div className="space-y-2">
                            {postsList.map(post => (
                                <div key={post.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#252525] rounded-xl transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                                post.status === 'published' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                                post.status === 'scheduled' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                                                'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                            }`}>
                                                {post.status === 'published' ? '已发布' : post.status === 'scheduled' ? '定时' : '草稿'}
                                            </span>
                                            <span className="text-xs text-gray-400">{format(new Date(post.date), 'yyyy-MM-dd HH:mm')}</span>
                                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">{post.category}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-200 truncate">{post.title || '(无标题)'}</h3>
                                        <p className="text-xs text-gray-400 truncate mt-1">{post.slug}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleLoadPost(post)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="编辑"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeletePost(post.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="删除"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <PenTool className="w-6 h-6 text-primary" />
          {editingPostId ? '编辑文章' : '创作中心'}
        </h1>
        
        {/* Top Actions: Drafts & Management */}
        <div className="flex items-center gap-2">
            <button 
                onClick={() => handleOpenList('draft')}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
                <Archive className="w-4 h-4" /> 草稿箱
            </button>
            <button 
                onClick={() => handleOpenList('published')}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
                <LayoutList className="w-4 h-4" /> 内容管理
            </button>
            {editingPostId && (
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                >
                    取消编辑
                </button>
            )}
        </div>

        <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-white dark:bg-[#1e1e1e] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <Clock className="w-4 h-4 text-gray-500" />
                <input 
                    type="datetime-local" 
                    className="bg-transparent text-sm outline-none text-gray-600 dark:text-gray-300 w-44"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    title="设置定时发布时间"
                />
             </div>
            <button
                onClick={() => handleSubmit(null, 'draft')}
                disabled={loading}
                className="bg-white hover:bg-gray-50 dark:bg-[#1e1e1e] dark:hover:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl transition-all font-bold shadow-sm active:scale-95 flex items-center gap-2 text-sm"
            >
                <FileText className="w-4 h-4" /> {editingPostId ? '保存草稿' : '存草稿'}
            </button>
            <button
                onClick={() => handleSubmit(null, 'published')}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl transition-all font-bold shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 text-sm"
            >
                {loading ? '处理中...' : (scheduledTime ? '定时发布' : (editingPostId ? '更新发布' : '发布文章'))} <Save className="w-4 h-4" />
            </button>
        </div>
      </div>
      
      {/* Metadata Card (Top) */}
      <div className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-5 mb-6 space-y-4">
        {/* Row 1: Title */}
        <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <Type className="w-4 h-4 text-primary" /> 标题
            </label>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-bold text-lg"
            placeholder="输入文章标题..."
            />
        </div>

        {/* Row 2: Slug & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary" /> 链接别名 (Slug)
                </label>
                <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all font-mono text-sm placeholder:text-gray-400"
                placeholder="自动生成链接别名..."
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" /> 分类
                </label>
                <div className="flex gap-2">
                    <select
                        value={category}
                        onChange={(e) => {
                        setCategory(e.target.value);
                        if (e.target.value) setNewCategory('');
                        }}
                        className="flex-1 p-2.5 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer text-sm"
                    >
                        <option value="">-- 选择分类 --</option>
                        {existingCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <input 
                        type="text"
                        value={newCategory}
                        onChange={(e) => {
                        setNewCategory(e.target.value);
                        setCategory('');
                        }}
                        placeholder="新分类..."
                        className="flex-1 p-2.5 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400"
                    />
                </div>
            </div>
        </div>

        {/* Row 3: Description */}
        <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-600 dark:text-gray-300">简述</label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all h-20 text-sm resize-none placeholder:text-gray-400"
            placeholder="文章摘要（留空则自动截取正文）..."
            />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex flex-col gap-2">
        <div data-color-mode={isDarkMode ? 'dark' : 'light'} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-[#1e1e1e]">
        <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            height={700}
            preview="live"
            commands={editorCommands}
            previewOptions={{
            rehypePlugins: [rehypeKatex, rehypeRaw],
            remarkPlugins: [remarkMath, remarkGfm],
            className: 'prose prose-slate dark:prose-invert max-w-none p-6'
            }}
            className="dark:bg-[#1e1e1e]"
        />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 text-right px-2">
        所见即所得：编辑器预览效果与博客前台一致（支持 Markdown, LaTeX, 代码高亮）
        </p>
      </div>

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-200 dark:border-gray-800" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">插入图片</h3>
                    <button onClick={() => setShowImageModal(false)}><X className="w-5 h-5" /></button>
                </div>
                
                <div className="space-y-4">
                    {/* Tabs or Toggle */}
                    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button 
                            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'url' ? 'bg-white dark:bg-[#2a2a2a] shadow-sm text-primary' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('url')}
                        >
                            网络图片
                        </button>
                        <button 
                            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'file' ? 'bg-white dark:bg-[#2a2a2a] shadow-sm text-primary' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('file')}
                        >
                            本地上传
                        </button>
                    </div>

                    {activeTab === 'file' ? (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                             onClick={() => document.getElementById('image-upload-input')?.click()}
                        >
                            <input 
                                id="image-upload-input" 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onClick={(e) => e.stopPropagation()} 
                                onChange={(e) => {
                                    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                                }}
                            />
                            {imageFile ? (
                               <div className="space-y-4">
                                   <div className="space-y-2">
                                       <p className="text-sm font-medium text-primary truncate max-w-xs mx-auto">{imageFile.name}</p>
                                       <p className="text-xs text-gray-400">点击更换图片</p>
                                   </div>
                                   <button 
                                       onClick={(e) => {
                                           e.stopPropagation();
                                           handleImageUpload();
                                       }}
                                       disabled={imageUploadLoading}
                                       className="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 mx-auto hover:bg-primary/90 transition-colors"
                                   >
                                       {imageUploadLoading ? '上传中...' : <><Upload className="w-4 h-4" /> 确认上传</>}
                                   </button>
                               </div>
                            ) : (
                               <div className="space-y-2">
                                   <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                       <Upload className="w-5 h-5 text-gray-500" />
                                   </div>
                                   <p className="text-sm text-gray-500">点击选择或拖拽上传图片</p>
                               </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-500">图片地址 URL</label>
                            <input 
                                type="text" 
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 text-sm outline-none focus:ring-2 ring-primary/50 transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-500">宽度 (如 100%, 300px)</label>
                            <input 
                                type="text" 
                                value={imageWidth}
                                onChange={(e) => setImageWidth(e.target.value)}
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 text-sm outline-none focus:ring-2 ring-primary/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-500">对齐/环绕</label>
                            <select 
                                value={imageAlign}
                                onChange={(e) => setImageAlign(e.target.value as any)}
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 text-sm outline-none focus:ring-2 ring-primary/50 transition-all cursor-pointer"
                            >
                                <option value="none">默认 (无)</option>
                                <option value="center">居中</option>
                                <option value="left">左浮动 (文字环绕)</option>
                                <option value="right">右浮动 (文字环绕)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button 
                            onClick={handleInsertImage}
                            disabled={!imageUrlInput}
                            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            插入图片
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
