import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import {
  ProjectForm,
  initialProjectFormState,
  type ProjectFormState,
} from '@/components/admin/projects/ProjectForm';

async function createProject(_: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  'use server';
  const title = String(formData.get('title') ?? '').trim();
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();
  const imagePublicId = String(formData.get('imagePublicId') ?? '').trim();

  const values: ProjectFormState['values'] = {
    title,
    imageUrl,
    imagePublicId,
  };

  const errors: ProjectFormState['errors'] = {};

  if (!title) {
    errors.title = 'El título es obligatorio.';
  }

  if (!imageUrl) {
    errors.imageUrl = 'Sube una imagen para destacar el proyecto.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  try {
    await prisma.project.create({
      data: {
        title,
        imageUrl,
      },
    });
  } catch (error) {
    return {
      errors: { ...errors, general: 'No pudimos crear el proyecto. Intenta nuevamente.' },
      values,
    };
  }

  revalidatePath('/admin/proyectos');
  redirect('/admin/proyectos');
}

export default function NuevoProyecto() {
  return (
    <div className="space-y-8">
      <section className="glass-panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Proyectos', href: '/admin/proyectos' },
                { label: 'Nuevo proyecto' },
              ]}
            />
            <h1 className="text-2xl font-semibold text-ink">Nuevo proyecto</h1>
            <p className="text-sm text-muted-ink">
              Comparte los casos de éxito de tu agencia con una imagen llamativa y un título memorable.
            </p>
          </div>
          <Button asChild variant="ghost" className="self-start">
            <Link href="/admin/proyectos">Volver</Link>
          </Button>
        </div>
      </section>

      <ProjectForm
        action={createProject}
        initialState={initialProjectFormState}
        heading="Detalles del proyecto"
        description="Sube una portada en alta calidad e indica el nombre con el que se mostrará en tu sitio."
        submitLabel="Crear proyecto"
        pendingLabel="Creando..."
      />
    </div>
  );
}
