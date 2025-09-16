import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const missing = (k: string) => !process.env[k] || process.env[k] === '';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,                           // ← required for Cloudflare R2
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,   // ← make sure name matches Vercel
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  // quick bucket probe to prove creds/endpoint work
  try {
    const r = await s3.send(new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      MaxKeys: 5,
    }));
    return NextResponse.json({ ok: true, probe: (r.Contents ?? []).map(o => o.Key) });
  } catch (e: any) {
    return NextResponse.json({ ok: false, stage: 'probe', error: e?.message ?? String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (missing('R2_ENDPOINT') || missing('R2_ACCESS_KEY_ID') || missing('R2_SECRET_ACCESS_KEY') || missing('R2_BUCKET_NAME')) {
    return NextResponse.json(
      { ok: false, error: 'Missing R2 env vars', present: {
        R2_ENDPOINT: !missing('R2_ENDPOINT'),
        R2_ACCESS_KEY_ID: !missing('R2_ACCESS_KEY_ID'),
        R2_SECRET_ACCESS_KEY: !missing('R2_SECRET_ACCESS_KEY'),
        R2_BUCKET_NAME: !missing('R2_BUCKET_NAME'),
      }},
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { key, content } = body;
  if (!key || typeof content !== 'string') {
    return NextResponse.json({ ok: false, error: 'key and content (string) required' }, { status: 400 });
  }

  try {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: content,
      ContentType: 'text/plain',
    }));
    return NextResponse.json({ ok: true, key });
  } catch (e: any) {
    return NextResponse.json({ ok: false, stage: 'put', error: e?.message ?? String(e) }, { status: 500 });
  }
}