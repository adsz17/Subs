'use client';

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContactModal } from '@/components/ContactModal';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description?: string | null;
  category?: string;
}

function truncate(text: string, limit = 140) {
  if (!text) return '';
  if (text.length <= limit) return text;
  const sliced = text.slice(0, limit).trimEnd();
  return sliced.replace(/\s+\S*$/, '') + '…';
}

export function ServiceCard({ icon: Icon, title, description, category }: ServiceCardProps) {
  const summary = description ? truncate(description) : null;

  return (
    <Card className="group flex h-full flex-col border border-transparent transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          {category && <Badge className="bg-blue-100 text-blue-700">{category}</Badge>}
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-transform group-hover:scale-105 group-hover:shadow-lg">
            <Icon className="h-6 w-6 transition-transform group-hover:-rotate-6 group-hover:scale-110" aria-hidden />
          </span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {summary && <p className="text-sm text-zinc-600">{summary}</p>}
        <div className="mt-auto">
          <ContactModal />
        </div>
      </CardContent>
    </Card>
  );
}
