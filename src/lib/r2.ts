import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function putToR2(Bucket: string, Key: string, Body: Buffer | string, ContentType?: string) {
  await r2.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));
  return `r2://${Bucket}/${Key}`;
}