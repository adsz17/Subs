import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import {
  ProjectForm,
  type ProjectFormState,
} from '@/components/admin/projects/ProjectForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function EditProyecto({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  const initialState: ProjectFormState = {
    errors: {},
    values: {
      title: project.title,
      imageUrl: project.imageUrl ?? '',
      imagePublicId: '',
    },
  };

  async function updateProject(_: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
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
      await prisma.project.update({
        where: { id: params.id },
        data: {
          title,
          imageUrl,
        },
      });
    } catch (error) {
      return {
        errors: { ...errors, general: 'No pudimos actualizar el proyecto. Intenta nuevamente.' },
        values,
      };
    }

    revalidatePath('/admin/proyectos');
    redirect('/admin/proyectos');
  }

  async function removeProject() {
    'use server';
    await prisma.project.delete({ where: { id: params.id } });
    revalidatePath('/admin/proyectos');
    redirect('/admin/proyectos');
  }

  return (
    <div className="space-y-8">
      <section className="glass-panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Proyectos', href: '/admin/proyectos' },
                { label: project.title },
              ]}
            />
            <h1 className="text-2xl font-semibold text-ink">Editar proyecto</h1>
            <p className="text-sm text-muted-ink">
              Actualiza la portada o renombra este caso de éxito para mantener tu portafolio al día.
            </p>
          </div>
          <Button asChild variant="ghost" className="self-start">
            <Link href="/admin/proyectos">Volver</Link>
          </Button>
        </div>
      </section>

      <ProjectForm
        action={updateProject}
        initialState={initialState}
        heading="Detalles del proyecto"
        description="Modifica la imagen o el título que se mostrará públicamente en el sitio."
        submitLabel="Guardar cambios"
        pendingLabel="Guardando..."
      />

      <Card className="border-red-300/40 bg-red-500/5 p-0 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
        <CardHeader className="space-y-2 border-b border-red-300/40 px-6 py-5 dark:border-red-500/30">
          <CardTitle className="text-lg">Zona de peligro</CardTitle>
          <p className="text-sm font-normal text-red-600/90 dark:text-red-200/80">
            Esta acción eliminará el proyecto de manera permanente del portafolio.
          </p>
        </CardHeader>
        <CardContent className="px-6 py-5">
          <form action={removeProject} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-600/90 dark:text-red-200/80">
              Eliminarás «{project.title}» y dejará de mostrarse en la web.
            </p>
            <Button
              type="submit"
              variant="outline"
              className="border-red-500/70 bg-transparent text-red-600 hover:border-red-500 hover:bg-red-500/10 hover:text-red-600 dark:border-red-400/60 dark:text-red-200 dark:hover:bg-red-500/20"
            >
              Eliminar proyecto
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
