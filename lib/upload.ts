import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { env } from '@/env.mjs';
import { v2 as cloudinary } from 'cloudinary';

export async function saveImage(
  file: File,
  folder: string,
  id?: string
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || '.png';
  const uniqueId = id || Date.now().toString();
  const filename = `${uniqueId}${ext}`;

  if (
    env.CLOUDINARY_URL ||
    (env.CLOUDINARY_CLOUD_NAME &&
      env.CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET)
  ) {
    cloudinary.config(
      env.CLOUDINARY_URL
        ? { secure: true }
        : {
            cloud_name: env.CLOUDINARY_CLOUD_NAME,
            api_key: env.CLOUDINARY_API_KEY,
            api_secret: env.CLOUDINARY_API_SECRET,
          }
    );

    const publicId = `${folder}/${uniqueId}`;

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: publicId },
        (error, res) => {
          if (error || !res) return reject(error);
          resolve(res);
        }
      );
      stream.end(buffer);
    });

    return result.secure_url as string;
  }

  const uploadDir = path.join(process.cwd(), 'public', folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/${folder}/${filename}`;
}

