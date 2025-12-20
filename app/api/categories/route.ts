import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/posts'; 

export async function GET() {
  try {
    // 1. Get categories from local markdown files AND Supabase (now merged in lib/posts)
    const existingCategories = await getCategories();

    // 2. Default preset categories (User requested)
    const presetCategories = [
      '奇思妙想',
      '科幻解构',
      '小说创作',
      '技术笔记',
      '生活随笔',
      '阅读感悟'
    ];

    // 3. Merge and deduplicate
    const allCategories = Array.from(new Set([
      ...presetCategories,
      ...existingCategories,
    ])).filter(Boolean);

    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
