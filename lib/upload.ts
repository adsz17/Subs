import { cloudinary } from './cloudinary';

export async function saveImage(file: File, folder: string, id?: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const publicId = `${folder}/${id || Date.now().toString()}`;

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
