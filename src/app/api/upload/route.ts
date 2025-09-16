import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const { key, content } = await req.json(); // demo: small text payloads
  if (!key || typeof content !== 'string') {
    return NextResponse.json({ ok: false, error: 'key and content required' }, { status: 400 });
  }

  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: content,
    ContentType: 'text/plain',
  }));

  return NextResponse.json({ ok: true, key });
}