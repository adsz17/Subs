import { NextResponse } from 'next/server';
import { env } from '@/env.mjs';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = formData.get('folder') as string | undefined;

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    let result: any;
    if (env.CLOUDINARY_UPLOAD_PRESET) {
      const data = new FormData();
      data.append('file', `data:${file.type};base64,${buffer.toString('base64')}`);
      data.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET);
      if (folder) data.append('folder', folder);
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: data,
      });
      result = await cloudRes.json();
      if (cloudRes.status >= 400) {
        throw new Error(result.error?.message || 'Upload failed');
      }
    } else {
      result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, {
        folder,
      });
    }
    return NextResponse.json({ secure_url: result.secure_url, public_id: result.public_id });
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
