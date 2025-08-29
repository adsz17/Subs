import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { env } from '@/env.mjs';
import { v2 as cloudinary } from 'cloudinary';

export async function saveLogo(file: File, id: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || '.png';
  const filename = `${id}${ext}`;

  if (
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: `logos/${id}` },
        (error, res) => {
          if (error || !res) return reject(error);
          resolve(res);
        }
      );
      stream.end(buffer);
    });

    return result.secure_url as string;
  }

  const uploadDir = path.join(process.cwd(), 'public', 'logos');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/logos/${filename}`;
}

