import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check Env Vars
    const envStatus = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    };

    // 2. Check DB Connection directly
    const { count, error: dbError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    // 3. Fetch Posts via Logic
    const allPosts = await getAllPosts();
    const targetPost = allPosts.find(p => p.title.includes('跨越语言'));
    const targetPostSlug = targetPost ? targetPost.slug : null;

    return NextResponse.json({
      environment: envStatus,
      databaseConnection: {
        status: dbError ? 'Error' : 'OK',
        postCount: count,
        error: dbError
      },
      appLogic: {
        totalPostsFound: allPosts.length,
        targetPostFound: !!targetPost,
        targetPostCategory: targetPost?.category,
        targetPostSlug
      }
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
