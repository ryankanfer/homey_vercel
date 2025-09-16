import { getFromR2 } from '@/lib/r2';

export async function GET(_req: Request, { params }: { params: { key: string[] } }) {
  const key = decodeURIComponent(params.key.join('/'));
  const { body, contentType, contentLength, lastModified } =
    await getFromR2(process.env.R2_BUCKET_NAME!, key);

  return new Response(body as any, {
    headers: {
      'Content-Type': contentType,
      ...(contentLength ? { 'Content-Length': String(contentLength) } : {}),
      ...(lastModified ? { 'Last-Modified': lastModified } : {}),
      'Cache-Control': 'private, max-age=0',
      'Content-Disposition': `inline; filename="${key.split('/').pop()}"`,
    },
  });
}
