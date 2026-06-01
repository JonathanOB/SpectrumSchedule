// app/api/debug/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Test 1: Can we reach Supabase at all?
    const { data, error } = await supabase
      .from('routine_templates')
      .select('count')
      .limit(1);

    return NextResponse.json({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      hasSecretKey: !!process.env.SUPABASE_SECRET_KEY,
      data,
      error,
    });
  } catch (e) {
    return NextResponse.json({ caught: String(e) }, { status: 500 });
  }
}