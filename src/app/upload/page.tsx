'use client';
import { useState } from 'react';

type ApiDoc = {
  id: string;
  title: string;
  key: string; // cleaned key (e.g., "test.txt")
};

type ApiOut = { ok: boolean; data?: ApiDoc[]; [k: string]: unknown } | null;

export default function UploadPage() {
  const [key, setKey] = useState('test.txt');
  const [content, setContent] = useState('hello world');
  const [out, setOut] = useState<ApiOut>(null);

  async function send() {
    const r = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key, content }),
    });
    setOut((await r.json()) as ApiOut);
  }

  async function list() {
    const r = await fetch('/api/documents');
    setOut((await r.json()) as ApiOut);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Upload demo</h1>
      <input
        value={key}
        onChange={e => setKey(e.target.value)}
        placeholder="key"
        style={{ display: 'block', margin: '8px 0', width: 360 }}
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={6}
        style={{ display: 'block', width: 360 }}
      />
      <button onClick={send}>Upload</button>
      <button onClick={list} style={{ marginLeft: 8 }}>List documents</button>

      <div style={{ marginTop: 24 }}>
        {out?.data && Array.isArray(out.data) ? (
          <ul>
            {out.data.map(doc => (
              <li key={doc.id}>
                {doc.title}{' '}
                <a
                  href={`/api/files/${encodeURIComponent(doc.key)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <pre style={{ marginTop: 16 }}>{out ? JSON.stringify(out, null, 2) : null}</pre>
        )}
      </div>
    </main>
  );
}