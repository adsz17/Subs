import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { PurchaseStatus } from '@prisma/client';

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
  return (
    <div className="container py-8">
      <h1 className="mb-4 text-3xl font-bold">{service.name}</h1>
      {service.content ? (
        <article className="prose max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {service.content}
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
