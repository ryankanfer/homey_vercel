import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,        // https://<accountid>.r2.cloudflarestorage.com
  forcePathStyle: true,                      // required for R2
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function putToR2(
  Bucket: string,
  Key: string,
  Body: Buffer | string,
  ContentType?: string
) {
  await r2.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));
  return `r2://${Bucket}/${Key}`;
}

export async function getFromR2(Bucket: string, Key: string) {
  const out = await r2.send(new GetObjectCommand({ Bucket, Key }));
  return {
    body: out.Body as ReadableStream,
    contentType: out.ContentType ?? 'application/octet-stream',
    contentLength: out.ContentLength ?? undefined,
    lastModified: out.LastModified?.toUTCString(),
  };
}