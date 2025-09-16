import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('id,title,r2_key,mime_type,size_bytes,status,created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  // Strip the "r2://bucket-name/" prefix
  const clean = data?.map(d => ({
    ...d,
    key: d.r2_key.replace(/^r2:\/\/[^/]+\//, ''),
  })) ?? [];

  return NextResponse.json({ ok: !error, data: clean, error: error?.message ?? null });
}