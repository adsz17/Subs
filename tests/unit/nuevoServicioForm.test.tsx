import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

vi.hoisted(() => {
  process.env.NODE_ENV = 'development';
  return {};
});

const { useFormStateMock } = vi.hoisted(() => ({
  useFormStateMock: vi.fn(),
}));

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof import('react-dom')>('react-dom');

  return {
    ...actual,
    useFormState: useFormStateMock,
  };
});

vi.mock('@/components/admin/ContentBuilder', () => ({
  __esModule: true,
  ContentBuilder: () => <div data-testid="content-builder" />,
}));

vi.mock('@/components/admin/ImageUploadField', () => ({
  __esModule: true,
  ImageUploadField: () => <div data-testid="image-upload-field" />,
}));

import { NuevoServicioForm } from '@/app/admin/servicios/nuevo/NuevoServicioForm';
import { initialFormState, type FormState } from '@/app/admin/servicios/nuevo/formState';

describe('NuevoServicioForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preserves previous values and renders validation errors once', () => {
    const mockAction = vi.fn();
    const mockFormAction = vi.fn();
    const formState: FormState = {
      errors: {
        name: 'El nombre es obligatorio.',
        slug: 'El slug es obligatorio.',
        general: 'Ocurrió un error.',
      },
      values: {
        name: 'Servicio de prueba',
        slug: 'servicio-de-prueba',
        description: 'Descripción previa',
        currency: 'USD',
        amount: '10',
      },
    };

    useFormStateMock.mockReturnValue([formState, mockFormAction]);

    render(<NuevoServicioForm action={mockAction} initialState={initialFormState} />);

    expect(useFormStateMock).toHaveBeenCalledWith(mockAction, initialFormState);

    const nameInputs = screen.getAllByLabelText('Nombre');
    expect(nameInputs).toHaveLength(1);
    expect(nameInputs[0]).toHaveValue(formState.values.name);
    expect(screen.getAllByText(formState.errors.name!)).toHaveLength(1);

    const slugInputs = screen.getAllByLabelText('Slug');
    expect(slugInputs).toHaveLength(1);
    expect(slugInputs[0]).toHaveValue(formState.values.slug);
    expect(screen.getAllByText(formState.errors.slug!)).toHaveLength(1);

    const descriptionField = screen.getByLabelText('Descripción');
    expect(descriptionField).toHaveValue(formState.values.description);

    const namedFields = document.querySelectorAll('input[name="name"], input[name="slug"], textarea[name="description"]');
    expect(namedFields).toHaveLength(3);
  });
});
