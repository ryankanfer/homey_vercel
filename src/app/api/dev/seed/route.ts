import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST() {
  const userId = '00000000-0000-0000-0000-000000000000';
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .upsert([{ id: userId, email: 'dev@homey.app', full_name: 'HOMEY Dev' }], { onConflict: 'id' })
    .select();
  return NextResponse.json({ ok: !error, error, data });
}