import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const { data, error, count } = await supabaseAdmin
    .from('profiles')
    .select('id', { count: 'exact' }); // no head:true so we see data too

  return NextResponse.json({
    ok: !error,
    rows: count ?? (data?.length ?? 0),
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,7) ?? null,
    error: error?.message ?? null,
  });
}