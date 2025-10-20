'use client';

import { useMemo } from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';
import type {
  ServiceContent,
  ServiceContentItem,
  ServiceContentLayout,
  ServiceContentResource,
  ServiceContentSection,
} from '@/types/service-content';
import { CURRENT_CONTENT_VERSION } from '@/types/service-content';

type ContentBuilderProps = {
  name: string;
  defaultValue?: unknown;
};

type NormalizedContent = {
  content: ServiceContent;
  legacy: boolean;
};

const layoutOptions: { value: ServiceContentLayout; label: string }[] = [
  { value: 'text', label: 'Texto enriquecido' },
  { value: 'cards', label: 'Tarjetas' },
  { value: 'accordion', label: 'Acordeón' },
  { value: 'markdown', label: 'Markdown' },
];

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function ensureItem(item: Partial<ServiceContentItem> | undefined): ServiceContentItem {
  return {
    id: item?.id ?? createId(),
    title: item?.title ?? '',
    body: item?.body,
    media: item?.media?.url
      ? {
          type: item.media.type ?? 'image',
          url: item.media.url,
          caption: item.media.caption,
        }
      : undefined,
  };
}

function ensureResource(
  resource: Partial<ServiceContentResource> | undefined,
): ServiceContentResource {
  return {
    id: resource?.id ?? createId(),
    label: resource?.label ?? '',
    url: resource?.url ?? '',
  };
}

function ensureSection(
  section: Partial<ServiceContentSection> | undefined,
): ServiceContentSection {
  const layout = section?.layout ?? 'text';
  const base: ServiceContentSection = {
    id: section?.id ?? createId(),
    layout,
    title: section?.title ?? '',
    body: section?.body,
    media: section?.media?.url
      ? {
          type: section.media.type ?? 'image',
          url: section.media.url,
          caption: section.media.caption,
        }
      : undefined,
    resources: section?.resources?.map(ensureResource) ?? [],
    items: section?.items?.map(ensureItem) ?? (layout === 'cards' || layout === 'accordion' ? [] : undefined),
  };

  if ((layout === 'text' || layout === 'markdown') && base.body === undefined) {
    base.body = '';
  }

  return base;
}

function createSection(layout: ServiceContentLayout): ServiceContentSection {
  return ensureSection({
    layout,
    body: layout === 'text' || layout === 'markdown' ? '' : undefined,
    items: layout === 'cards' || layout === 'accordion' ? [] : undefined,
    resources: [],
  });
}

function isServiceContent(value: any): value is ServiceContent {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.version === 'number' &&
    Array.isArray(value.sections)
  );
}

function normalizeContent(defaultValue: unknown): NormalizedContent {
  if (!defaultValue) {
    return {
      content: { version: CURRENT_CONTENT_VERSION, sections: [], metadata: { legacyMarkdown: false } },
      legacy: false,
    };
  }

  if (typeof defaultValue === 'string') {
    try {
      const parsed = JSON.parse(defaultValue);
      if (isServiceContent(parsed)) {
        return {
          content: {
            version: parsed.version ?? CURRENT_CONTENT_VERSION,
            sections: parsed.sections.map(ensureSection),
            metadata: parsed.metadata,
          },
          legacy: Boolean(parsed.metadata?.legacyMarkdown),
        };
      }
    } catch (error) {
      // noop - treat as legacy markdown below
    }

    return {
      content: {
        version: CURRENT_CONTENT_VERSION,
        sections: [
          ensureSection({
            layout: 'markdown',
            title: 'Contenido migrado',
            body: defaultValue,
          }),
        ],
        metadata: { legacyMarkdown: true },
      },
      legacy: true,
    };
  }

  if (isServiceContent(defaultValue)) {
    return {
      content: {
        version: defaultValue.version ?? CURRENT_CONTENT_VERSION,
        sections: defaultValue.sections.map(ensureSection),
        metadata: defaultValue.metadata,
      },
      legacy: Boolean(defaultValue.metadata?.legacyMarkdown),
    };
  }

  if (typeof defaultValue === 'object') {
    try {
      const parsed = JSON.parse(JSON.stringify(defaultValue));
      if (isServiceContent(parsed)) {
        return {
          content: {
            version: parsed.version ?? CURRENT_CONTENT_VERSION,
            sections: parsed.sections.map(ensureSection),
            metadata: parsed.metadata,
          },
          legacy: Boolean(parsed.metadata?.legacyMarkdown),
        };
      }
    } catch (error) {
      // ignore
    }
  }

  return {
    content: {
      version: CURRENT_CONTENT_VERSION,
      sections: [
        ensureSection({
          layout: 'markdown',
          title: 'Contenido migrado',
          body: typeof defaultValue === 'string' ? defaultValue : '',
        }),
      ],
      metadata: { legacyMarkdown: true },
    },
    legacy: true,
  };
}

function cleanContent(content: ServiceContent): ServiceContent {
  const sections = content.sections
    .map((section) => {
      const cleanedResources = (section.resources ?? [])
        .map((resource) => ({
          ...resource,
          label: resource.label?.trim() ?? '',
          url: resource.url?.trim() ?? '',
        }))
        .filter((resource) => resource.label || resource.url);

      const cleanedItems = (section.items ?? [])
        .map((item) => ({
          ...item,
          title: item.title?.trim() ?? '',
          body: item.body?.trim() ?? '',
          media:
            item.media && item.media.url?.trim()
              ? {
                  type: item.media.type,
                  url: item.media.url.trim(),
                  caption: item.media.caption?.trim() || undefined,
                }
              : undefined,
        }))
        .filter((item) => item.title || item.body || item.media);

      const media = section.media && section.media.url?.trim()
        ? {
            type: section.media.type,
            url: section.media.url.trim(),
            caption: section.media.caption?.trim() || undefined,
          }
        : undefined;

      const title = section.title?.trim();
      const body = section.body?.trim();

      const hasContent =
        (body && body.length > 0) ||
        cleanedItems.length > 0 ||
        cleanedResources.length > 0 ||
        media ||
        (title && title.length > 0);

      return {
        ...section,
        title: title || undefined,
        body: body || (section.layout === 'markdown' ? section.body : undefined),
        resources: cleanedResources.length > 0 ? cleanedResources : undefined,
        items: cleanedItems.length > 0 ? cleanedItems : undefined,
        media,
      } as ServiceContentSection;
    })
    .filter((section) => {
      if (section.layout === 'markdown') {
        return Boolean(section.body);
      }
      return (
        Boolean(section.title) ||
        Boolean(section.body) ||
        (section.items && section.items.length > 0) ||
        (section.resources && section.resources.length > 0) ||
        Boolean(section.media)
      );
    });

  return {
    version: content.version || CURRENT_CONTENT_VERSION,
    sections,
    metadata: content.metadata,
  };
}

function SectionEditor({
  index,
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const { control, register, watch, setValue } = useFormContext<ServiceContent>();
  const layout: ServiceContentLayout = watch(`sections.${index}.layout`);

  const resources = useFieldArray({
    control,
    name: `sections.${index}.resources` as const,
  });

  const items = useFieldArray({
    control,
    name: `sections.${index}.items` as const,
  });

  return (
    <div className="rounded-md border border-dashed p-4 space-y-4 bg-white/60 dark:bg-gray-900/40">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sección #{index + 1}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded border border-red-500 px-2 py-1 text-sm text-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="block text-sm font-medium">Título</span>
          <input
            {...register(`sections.${index}.title` as const)}
            className="w-full rounded border px-3 py-2"
            placeholder="Título de la sección"
          />
        </label>
        <label className="space-y-1">
          <span className="block text-sm font-medium">Formato</span>
          <select
            {...register(`sections.${index}.layout` as const)}
            className="w-full rounded border px-3 py-2"
          >
            {layoutOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {(layout === 'text' || layout === 'markdown') && (
        <label className="space-y-1 block">
          <span className="block text-sm font-medium">
            {layout === 'markdown' ? 'Contenido (Markdown)' : 'Contenido'}
          </span>
          <textarea
            {...register(`sections.${index}.body` as const)}
            rows={5}
            className="w-full rounded border px-3 py-2"
            placeholder="Describe esta sección"
          />
          {layout === 'markdown' && (
            <span className="block text-xs text-amber-600">
              Este bloque proviene de contenido antiguo en Markdown. Puedes editarlo o cambiarlo a otro formato.
            </span>
          )}
        </label>
      )}

      {(layout === 'cards' || layout === 'accordion') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {layout === 'cards' ? 'Tarjetas' : 'Entradas del acordeón'}
            </span>
            <button
              type="button"
              className="rounded border px-2 py-1 text-sm"
              onClick={() =>
                items.append({
                  id: createId(),
                  title: '',
                  body: '',
                })
              }
            >
              Añadir
            </button>
          </div>
          <div className="space-y-3">
            {items.fields.map((field, itemIndex) => (
              <div key={field.id} className="rounded border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {layout === 'cards' ? 'Tarjeta' : 'Elemento'} #{itemIndex + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => items.move(itemIndex, Math.max(0, itemIndex - 1))}
                      disabled={itemIndex === 0}
                      className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        items.move(
                          itemIndex,
                          Math.min(items.fields.length - 1, itemIndex + 1),
                        )
                      }
                      disabled={itemIndex === items.fields.length - 1}
                      className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => items.remove(itemIndex)}
                      className="rounded border border-red-500 px-2 py-1 text-xs text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <label className="space-y-1 block">
                  <span className="block text-xs font-medium">Título</span>
                  <input
                    {...register(`sections.${index}.items.${itemIndex}.title` as const)}
                    className="w-full rounded border px-2 py-1"
                    placeholder="Título"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="block text-xs font-medium">Descripción</span>
                  <textarea
                    {...register(`sections.${index}.items.${itemIndex}.body` as const)}
                    rows={3}
                    className="w-full rounded border px-2 py-1"
                    placeholder="Detalle del elemento"
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="space-y-1 block">
                    <span className="block text-xs font-medium">Tipo de media</span>
                    <select
                      {...register(`sections.${index}.items.${itemIndex}.media.type` as const)}
                      className="w-full rounded border px-2 py-1"
                      defaultValue={
                        watch(`sections.${index}.items.${itemIndex}.media.type` as const) ?? 'image'
                      }
                    >
                      <option value="image">Imagen</option>
                      <option value="video">Video</option>
                      <option value="embed">Embed</option>
                    </select>
                  </label>
                  <label className="space-y-1 block">
                    <span className="block text-xs font-medium">URL media</span>
                    <input
                      {...register(`sections.${index}.items.${itemIndex}.media.url` as const)}
                      className="w-full rounded border px-2 py-1"
                      placeholder="https://..."
                    />
                  </label>
                </div>
                <label className="space-y-1 block">
                  <span className="block text-xs font-medium">Leyenda</span>
                  <input
                    {...register(`sections.${index}.items.${itemIndex}.media.caption` as const)}
                    className="w-full rounded border px-2 py-1"
                    placeholder="Texto opcional"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 block">
          <span className="block text-sm font-medium">Tipo de media</span>
          <select
            {...register(`sections.${index}.media.type` as const)}
            className="w-full rounded border px-3 py-2"
            defaultValue={watch(`sections.${index}.media.type` as const) ?? 'image'}
          >
            <option value="image">Imagen</option>
            <option value="video">Video</option>
            <option value="embed">Embed</option>
          </select>
        </label>
        <label className="space-y-1 block">
          <span className="block text-sm font-medium">URL media</span>
          <input
            {...register(`sections.${index}.media.url` as const)}
            className="w-full rounded border px-3 py-2"
            placeholder="https://..."
          />
        </label>
      </div>
      <label className="space-y-1 block">
        <span className="block text-sm font-medium">Leyenda</span>
        <input
          {...register(`sections.${index}.media.caption` as const)}
          className="w-full rounded border px-3 py-2"
          placeholder="Texto opcional"
        />
      </label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Recursos relacionados</span>
          <button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={() =>
              resources.append({
                id: createId(),
                label: '',
                url: '',
              })
            }
          >
            Añadir recurso
          </button>
        </div>
        {resources.fields.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Añade enlaces o materiales de apoyo para esta sección.
          </p>
        )}
        <div className="space-y-2">
          {resources.fields.map((field, resourceIndex) => (
            <div key={field.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                {...register(`sections.${index}.resources.${resourceIndex}.label` as const)}
                className="rounded border px-2 py-1"
                placeholder="Nombre del recurso"
              />
              <input
                {...register(`sections.${index}.resources.${resourceIndex}.url` as const)}
                className="rounded border px-2 py-1"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => resources.remove(resourceIndex)}
                className="rounded border border-red-500 px-2 py-1 text-sm text-red-600"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContentBuilder({ name, defaultValue }: ContentBuilderProps) {
  const normalized = useMemo(() => normalizeContent(defaultValue), [defaultValue]);
  const formMethods = useForm<ServiceContent>({
    defaultValues: normalized.content,
    mode: 'onChange',
  });

  const { control, watch } = formMethods;
  const sections = useFieldArray({ control, name: 'sections' });

  const watchedContent = watch();
  const serialized = useMemo(
    () => JSON.stringify(cleanContent(watchedContent)),
    [watchedContent],
  );

  const hasLegacyMarkdown =
    normalized.legacy || normalized.content.sections.some((section) => section.layout === 'markdown');

  return (
    <FormProvider {...formMethods}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Bloques disponibles:</span>
          <button
            type="button"
            className="rounded border px-3 py-1 text-sm"
            onClick={() => sections.append(createSection('text'))}
          >
            Añadir texto
          </button>
          <button
            type="button"
            className="rounded border px-3 py-1 text-sm"
            onClick={() => sections.append(createSection('cards'))}
          >
            Añadir tarjetas
          </button>
          <button
            type="button"
            className="rounded border px-3 py-1 text-sm"
            onClick={() => sections.append(createSection('accordion'))}
          >
            Añadir acordeón
          </button>
        </div>
        {hasLegacyMarkdown && (
          <div className="rounded border border-amber-400 bg-amber-50 p-3 text-amber-900 text-sm">
            Detectamos contenido previo en Markdown. Puedes migrarlo editando el bloque generado o reemplazándolo por secciones nuevas.
          </div>
        )}
        {sections.fields.length === 0 && (
          <p className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground">
            Aún no hay secciones. Añade un bloque para comenzar a construir el contenido del servicio.
          </p>
        )}
        <div className="space-y-4">
          {sections.fields.map((field, index) => (
            <SectionEditor
              key={field.id}
              index={index}
              total={sections.fields.length}
              onRemove={() => sections.remove(index)}
              onMoveUp={() => sections.move(index, Math.max(0, index - 1))}
              onMoveDown={() => sections.move(index, Math.min(sections.fields.length - 1, index + 1))}
            />
          ))}
        </div>
        <input type="hidden" name={name} value={serialized} readOnly />
      </div>
    </FormProvider>
  );
}
