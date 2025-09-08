"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useToast } from './Toast';
import { useFormContext } from 'react-hook-form';

interface Props {
  folder: string;
  initialUrl?: string | null;
  initialPublicId?: string | null;
}

export function ImageUploadField({ folder, initialUrl, initialPublicId }: Props) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const imagePublicIdRef = useRef<HTMLInputElement>(null);
  const { add } = useToast();
  let form: ReturnType<typeof useFormContext> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    form = useFormContext();
  } catch {
    form = null;
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      add('Formato inválido');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      add('Imagen demasiado grande');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      if (imageUrlRef.current) imageUrlRef.current.value = data.secure_url;
      if (imagePublicIdRef.current) imagePublicIdRef.current.value = data.public_id;
      if (form) {
        form.setValue('imageUrl', data.secure_url, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        form.setValue('imagePublicId', data.public_id, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
      setPreview(data.secure_url);
      add('Imagen subida');
    } catch (err) {
      add('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input ref={imageUrlRef} type="hidden" name="imageUrl" defaultValue={initialUrl ?? ''} />
      <input
        ref={imagePublicIdRef}
        type="hidden"
        name="imagePublicId"
        defaultValue={initialPublicId ?? ''}
      />
      {preview && (
        <Image src={preview} alt="" width={128} height={128} className="mb-2 h-32 w-auto object-contain" />
      )}
      <input type="file" accept="image/*" onChange={handleChange} />
      {uploading && <p>Subiendo...</p>}
    </div>
  );
}
