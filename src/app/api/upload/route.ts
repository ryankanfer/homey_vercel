import { NextResponse } from 'next/server';
import { putToR2 } from '@/lib/r2';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { key, content, mime = 'text/plain' } = await req.json();
  if (!key || typeof content !== 'string') {
    return NextResponse.json({ ok:false, error:'key+content required' }, { status:400 });
  }

  const r2Key = await putToR2(process.env.R2_BUCKET_NAME!, key, content, mime);

  const userId = '00000000-0000-0000-0000-000000000000'; // dev user
  const { data, error } = await supabaseAdmin
    .from('documents')
    .insert([{ user_id: userId, title: key, r2_key: r2Key, mime_type: mime, size_bytes: content.length, status: 'uploaded' }])
    .select()
    .single();

  if (error) return NextResponse.json({ ok:false, stage:'db', error: error.message }, { status:500 });
  return NextResponse.json({ ok:true, doc: data });
}