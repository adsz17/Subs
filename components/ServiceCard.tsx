'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContactModal } from '@/components/ContactModal';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description?: string | null;
  category?: string;
  href?: string;
}

function truncate(text: string, limit = 160) {
  if (!text) return '';
  if (text.length <= limit) return text;
  const sliced = text.slice(0, limit).trimEnd();
  return sliced.replace(/\s+\S*$/, '') + '…';
}

export function ServiceCard({ icon: Icon, title, description, category, href }: ServiceCardProps) {
  const summary = description ? truncate(description) : null;
  const highlights = description
    ? description
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .slice(0, 2)
    : [];

  return (
    <Card className="group flex h-full flex-col border border-blue-100 bg-white/70 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          {category ? (
            <Badge className="bg-blue-100 text-blue-700">{category}</Badge>
          ) : (
            <Badge className="bg-slate-100 text-slate-700">Destacado</Badge>
          )}
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-600 transition-transform group-hover:scale-105 group-hover:shadow-lg">
            <Icon className="h-6 w-6 transition-transform group-hover:-rotate-6 group-hover:scale-110" aria-hidden />
          </span>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl tracking-tight">{title}</CardTitle>
          {summary && <p className="text-sm text-slate-600">{summary}</p>}
        </div>
        {highlights.length > 0 && (
          <ul className="space-y-1 text-sm text-slate-700">
            {highlights.map(highlight => (
              <li key={highlight} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-500" aria-hidden />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </CardHeader>
      <CardContent className="mt-auto space-y-4">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <ArrowRight className="h-4 w-4" aria-hidden />
          <span>Agenda una llamada y recibe una propuesta personalizada.</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {href && (
            <Button asChild className="w-full">
              <Link href={href} className="inline-flex items-center justify-center gap-2">
                Ver detalles
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          )}
          <ContactModal triggerText={href ? 'Hablar con un asesor' : 'Solicitar información'} />
        </div>
      </CardContent>
    </Card>
  );
}
