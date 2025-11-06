"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { add } = useToast();
  const router = useRouter();
  let form: ReturnType<typeof useFormContext> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    form = useFormContext();
  } catch {
    form = null;
  }

  useEffect(() => {
    setPreview(initialUrl ?? null);
    if (imageUrlRef.current) {
      imageUrlRef.current.value = initialUrl ?? '';
    }
    if (imagePublicIdRef.current) {
      imagePublicIdRef.current.value = initialPublicId ?? '';
    }
  }, [initialUrl, initialPublicId]);

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
      if (res.status === 403) {
        add('Debes iniciar sesión o tener permisos para subir imágenes');
        router.push('/login');
        return;
      }
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (imageUrlRef.current) imageUrlRef.current.value = '';
    if (imagePublicIdRef.current) imagePublicIdRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (form) {
      form.setValue('imageUrl', '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      form.setValue('imagePublicId', '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    }
  };

  return (
    <div className="space-y-3">
      <input ref={imageUrlRef} type="hidden" name="imageUrl" defaultValue={initialUrl ?? ''} />
      <input
        ref={imagePublicIdRef}
        type="hidden"
        name="imagePublicId"
        defaultValue={initialPublicId ?? ''}
      />
      <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleChange} />
      {preview ? (
        <div className="overflow-hidden rounded-xl border border-white/20 bg-surface/70 shadow-inner transition dark:border-white/10">
          <Image src={preview} alt="" width={512} height={320} className="h-48 w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-white/30 bg-surface/50 text-sm text-muted-ink/70 transition dark:border-white/15">
          Aún no has seleccionado una imagen.
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'Subiendo...' : preview ? 'Cambiar imagen' : 'Subir imagen'}
        </Button>
        {preview && (
          <Button type="button" variant="ghost" className="text-muted-ink hover:text-ink" onClick={handleClear}>
            Quitar
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-ink/80">PNG, JPG o WebP. Tamaño máximo de 5MB.</p>
    </div>
  );
}
