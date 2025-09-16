import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2'; // you already export this client

export async function getFromR2(bucket: string, key: string) {
  const out = await r2.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return {
    body: out.Body as ReadableStream,
    contentType: out.ContentType ?? 'application/octet-stream',
    contentLength: out.ContentLength ?? undefined,
    lastModified: out.LastModified?.toUTCString(),
  };
}