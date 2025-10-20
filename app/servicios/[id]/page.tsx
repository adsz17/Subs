import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { ServiceContent, ServiceContentMedia, ServiceContentSection } from '@/types/service-content';
import { CURRENT_CONTENT_VERSION } from '@/types/service-content';

type RenderableContent = {
  structured: ServiceContent | null;
  legacyMarkdown: string | null;
};

function toPlainObject<T>(value: unknown): T | null {
  if (value == null) return null;
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch (error) {
    return null;
  }
}

function parseStructuredContent(raw: unknown): RenderableContent {
  if (!raw) {
    return { structured: null, legacyMarkdown: null };
  }

  let candidate: unknown = raw;
  if (typeof raw === 'string') {
    try {
      candidate = JSON.parse(raw);
    } catch (error) {
      return { structured: null, legacyMarkdown: raw };
    }
  } else {
    candidate = toPlainObject<unknown>(raw);
  }

  if (!candidate || typeof candidate !== 'object') {
    return { structured: null, legacyMarkdown: null };
  }

  const data = candidate as Record<string, unknown>;
  const sectionsInput = Array.isArray(data.sections) ? data.sections : [];

  const sections: ServiceContentSection[] = sectionsInput
    .map((section, sectionIndex) => {
      if (!section || typeof section !== 'object') return null;
      const layout = (section as Record<string, unknown>).layout;
      if (
        layout !== 'text' &&
        layout !== 'cards' &&
        layout !== 'accordion' &&
        layout !== 'markdown'
      ) {
        return null;
      }

      const resourcesRaw = (section as Record<string, unknown>).resources;
      const resources = Array.isArray(resourcesRaw)
        ? resourcesRaw
            .map((resource, resourceIndex) => {
              if (!resource || typeof resource !== 'object') return null;
              const record = resource as Record<string, unknown>;
              const label = typeof record.label === 'string' ? record.label : '';
              const url = typeof record.url === 'string' ? record.url : '';
              if (!label && !url) return null;
              return {
                id:
                  typeof record.id === 'string' && record.id
                    ? record.id
                    : `resource-${sectionIndex}-${resourceIndex}`,
                label,
                url,
              };
            })
            .filter((resource): resource is NonNullable<typeof resource> => Boolean(resource))
        : undefined;

      const itemsRaw = (section as Record<string, unknown>).items;
      const items = Array.isArray(itemsRaw)
        ? itemsRaw
            .map((item, itemIndex) => {
              if (!item || typeof item !== 'object') return null;
              const record = item as Record<string, unknown>;
              const title = typeof record.title === 'string' ? record.title : '';
              const body = typeof record.body === 'string' ? record.body : '';
              const mediaCandidate = record.media as Record<string, unknown> | undefined;
              let media: ServiceContentMedia | undefined;
              if (mediaCandidate && typeof mediaCandidate === 'object') {
                const url = typeof mediaCandidate.url === 'string' ? mediaCandidate.url : '';
                if (url) {
                  const type =
                    mediaCandidate.type === 'video'
                      ? 'video'
                      : mediaCandidate.type === 'embed'
                        ? 'embed'
                        : 'image';
                  media = {
                    type,
                    url,
                    caption:
                      typeof mediaCandidate.caption === 'string'
                        ? mediaCandidate.caption
                        : undefined,
                  };
                }
              }
              if (!title && !body && !media) return null;
              return {
                id:
                  typeof record.id === 'string' && record.id
                    ? record.id
                    : `item-${sectionIndex}-${itemIndex}`,
                title,
                body,
                media,
              };
            })
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        : undefined;

      const mediaRaw = (section as Record<string, unknown>).media as
        | Record<string, unknown>
        | undefined;
      let media: ServiceContentMedia | undefined;
      if (mediaRaw && typeof mediaRaw === 'object') {
        const url = typeof mediaRaw.url === 'string' ? mediaRaw.url : '';
        if (url) {
          const type =
            mediaRaw.type === 'video'
              ? 'video'
              : mediaRaw.type === 'embed'
                ? 'embed'
                : 'image';
          media = {
            type,
            url,
            caption: typeof mediaRaw.caption === 'string' ? mediaRaw.caption : undefined,
          };
        }
      }

      const body = typeof (section as Record<string, unknown>).body === 'string'
        ? (section as Record<string, unknown>).body
        : undefined;
      const title = typeof (section as Record<string, unknown>).title === 'string'
        ? (section as Record<string, unknown>).title
        : undefined;

      return {
        id:
          typeof (section as Record<string, unknown>).id === 'string' &&
          (section as Record<string, unknown>).id
            ? ((section as Record<string, unknown>).id as string)
            : `section-${sectionIndex}`,
        layout,
        title,
        body,
        media,
        items,
        resources,
      } satisfies ServiceContentSection;
    })
    .filter((section): section is ServiceContentSection => Boolean(section));

  const metadata =
    data.metadata && typeof data.metadata === 'object'
      ? (data.metadata as Record<string, unknown>)
      : undefined;

  const typedMetadata = metadata as ServiceContent['metadata'];
  const firstSection = sections[0];
  const metadataLegacy = Boolean(typedMetadata?.legacyMarkdown);
  const isSingleMarkdown =
    sections.length === 1 && firstSection && firstSection.layout === 'markdown';
  const legacyMarkdown =
    (metadataLegacy || isSingleMarkdown) && firstSection?.body ? firstSection.body : null;

  return {
    structured: {
      version: typeof data.version === 'number' ? data.version : CURRENT_CONTENT_VERSION,
      sections,
      metadata: typedMetadata,
    },
    legacyMarkdown,
  };
}

function MediaRenderer({ media }: { media: ServiceContentMedia }) {
  if (media.type === 'image') {
    return (
      <figure className="space-y-2">
        <img src={media.url} alt={media.caption || ''} className="w-full rounded-md" />
        {media.caption && <figcaption className="text-sm text-muted-foreground">{media.caption}</figcaption>}
      </figure>
    );
  }
  if (media.type === 'video') {
    return (
      <figure className="space-y-2">
        <video controls className="w-full rounded-md">
          <source src={media.url} />
          Tu navegador no soporta la reproducción de video.
        </video>
        {media.caption && <figcaption className="text-sm text-muted-foreground">{media.caption}</figcaption>}
      </figure>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-md" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={media.url}
        title={media.caption || 'Contenido embebido'}
        className="absolute inset-0 h-full w-full"
        allowFullScreen
      />
    </div>
  );
}

function SectionRenderer({ section }: { section: ServiceContentSection }) {
  const { layout } = section;
  const title = section.title ? (
    <h2 className="text-2xl font-semibold">{section.title}</h2>
  ) : null;

  const resources = section.resources && section.resources.length > 0 && (
    <div>
      <h3 className="text-lg font-semibold">Recursos</h3>
      <ul className="list-disc space-y-1 pl-6 text-sm">
        {section.resources.map((resource) => (
          <li key={resource.id}>
            <a href={resource.url} className="text-primary underline" target="_blank" rel="noreferrer">
              {resource.label || resource.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  const media = section.media ? <MediaRenderer media={section.media} /> : null;

  if (layout === 'text' || layout === 'markdown') {
    return (
      <section className="space-y-4">
        {title}
        {section.body && (
          <article className="prose max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {section.body}
            </ReactMarkdown>
          </article>
        )}
        {media}
        {resources}
      </section>
    );
  }

  if (layout === 'cards') {
    return (
      <section className="space-y-4">
        {title}
        {section.body && <p className="text-muted-foreground">{section.body}</p>}
        {media}
        {section.items && section.items.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {section.items.map((item) => (
              <div key={item.id} className="space-y-3 rounded-lg border p-4 shadow-sm">
                {item.title && <h3 className="text-lg font-semibold">{item.title}</h3>}
                {item.body && <p className="text-sm text-muted-foreground">{item.body}</p>}
                {item.media && <MediaRenderer media={item.media} />}
              </div>
            ))}
          </div>
        )}
        {resources}
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {title}
      {section.body && <p className="text-muted-foreground">{section.body}</p>}
      {media}
      {section.items && section.items.length > 0 && (
        <div className="space-y-2">
          {section.items.map((item) => (
            <details key={item.id} className="rounded border p-3">
              <summary className="cursor-pointer font-medium">{item.title || 'Detalle'}</summary>
              {item.body && <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>}
              {item.media && <div className="mt-2"><MediaRenderer media={item.media} /></div>}
            </details>
          ))}
        </div>
      )}
      {resources}
    </section>
  );
}

interface Props {
  params: { id: string };
}

export const revalidate = 0;

export default async function ServiceDetailPage({ params }: Props) {
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) {
    notFound();
  }
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/login?next=/servicios/${params.id}`);
  }
  const approvedPurchase = await prisma.purchaseItem.findFirst({
    where: {
      serviceId: service.id,
      purchase: {
        userId: session.user.id,
        status: PurchaseStatus.APPROVED
      }
    }
  });
  if (!approvedPurchase) {
    const pendingPurchase = await prisma.purchaseItem.findFirst({
      where: {
        serviceId: service.id,
        purchase: {
          userId: session.user.id,
          status: PurchaseStatus.PENDING
        }
      }
    });
    return (
      <div className="container py-8">
        <h1 className="mb-4 text-3xl font-bold">{service.name}</h1>
        <p>
          {pendingPurchase
            ? 'Tu compra está en revisión. Te avisaremos cuando sea aprobada.'
            : 'No has comprado este servicio todavía.'}
        </p>
      </div>
    );
  }
  const { structured, legacyMarkdown } = parseStructuredContent(service.content);
  const fallbackMarkdown =
    legacyMarkdown || (typeof service.content === 'string' ? service.content : null);
  const hasStructured = structured && structured.sections.length > 0 && !legacyMarkdown;

  return (
    <div className="container py-8">
      <h1 className="mb-4 text-3xl font-bold">{service.name}</h1>
      {hasStructured ? (
        <div className="space-y-8">
          {structured?.sections?.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      ) : fallbackMarkdown ? (
        <article className="prose max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {fallbackMarkdown}
          </ReactMarkdown>
        </article>
      ) : service.description ? (
        <p>{service.description}</p>
      ) : (
        <p>Contenido desbloqueado.</p>
      )}
    </div>
  );
}
