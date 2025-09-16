import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const { count, error } = await supabaseAdmin
    .from('profiles')
    .select('id', { count: 'exact', head: true });
  return NextResponse.json({ ok: !error, rows: count ?? 0 });
}