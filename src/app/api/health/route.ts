import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
export async function GET() {
  const { data, error } = await supabase.from('profiles').select('id').limit(1);
  return NextResponse.json({ ok: !error, rows: data?.length ?? 0 });
}