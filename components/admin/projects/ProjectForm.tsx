'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export interface ProjectFormValues {
  title: string;
  imageUrl: string;
  imagePublicId: string;
}

export interface ProjectFormState {
  errors: Partial<Record<'title' | 'imageUrl' | 'general', string>>;
  values: ProjectFormValues;
}

export const initialProjectFormState: ProjectFormState = {
  errors: {},
  values: { title: '', imageUrl: '', imagePublicId: '' },
};

interface ProjectFormProps {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  initialState: ProjectFormState;
  heading?: string;
  description?: string;
  submitLabel?: string;
  pendingLabel?: string;
}

function SubmitButton({ children, pendingLabel }: { children: React.ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingLabel ?? 'Guardando...'}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

export function ProjectForm({
  action,
  initialState,
  heading = 'Nuevo proyecto',
  description = 'Completa los detalles para mostrar este proyecto en tu portafolio.',
  submitLabel = 'Guardar proyecto',
  pendingLabel,
}: ProjectFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card className="shadow-soft">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold text-ink">{heading}</CardTitle>
        <p className="text-sm text-muted-ink">{description}</p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state.errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{state.errors.general}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-muted-ink">
              Título
            </label>
            <Input
              id="title"
              name="title"
              key={`project-title-${state.values.title}`}
              defaultValue={state.values.title}
              placeholder="Ej. Campaña integral para Subs Agency"
              aria-invalid={Boolean(state.errors.title)}
              aria-describedby={state.errors.title ? 'project-title-error' : undefined}
            />
            {state.errors.title && (
              <p id="project-title-error" className="text-xs text-red-500">
                {state.errors.title}
              </p>
            )}
          </div>
          <div className="space-y-3">
            <span className="text-sm font-medium text-muted-ink">Imagen destacada</span>
            <ImageUploadField
              key={`project-image-${state.values.imageUrl}`}
              folder="projects"
              initialUrl={state.values.imageUrl || null}
              initialPublicId={state.values.imagePublicId || null}
            />
            {state.errors.imageUrl && (
              <p className="text-xs text-red-500" id="project-image-error">
                {state.errors.imageUrl}
              </p>
            )}
          </div>
          <SubmitButton pendingLabel={pendingLabel}>{submitLabel}</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
