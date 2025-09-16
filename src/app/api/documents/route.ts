import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('id,title,r2_key,mime_type,size_bytes,status,created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json({ ok: !error, data, error: error?.message ?? null });
}