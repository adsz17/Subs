'use client';

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  title: string;
  image: string;
  summary?: string | null;
  tags?: string[];
  category?: string;
  icon?: LucideIcon;
}

function truncate(text: string, limit = 150) {
  if (!text) return '';
  if (text.length <= limit) return text;
  const sliced = text.slice(0, limit).trimEnd();
  return sliced.replace(/\s+\S*$/, '') + '…';
}

export function ProjectCard({ title, image, summary, tags = [], category, icon: Icon }: ProjectCardProps) {
  const description = summary ? truncate(summary) : null;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-transparent transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <Badge className="absolute left-4 top-4 bg-white/90 text-blue-700 shadow">
            {category}
          </Badge>
        )}
        {Icon && (
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform group-hover:rotate-6 group-hover:scale-110">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-lg font-semibold text-zinc-900">{title}</p>
        {description && <p className="text-sm text-zinc-600">{description}</p>}
        {tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 text-xs text-zinc-500">
            {tags.map(tag => (
              <li key={tag} className="rounded-full bg-zinc-100 px-2 py-0.5">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
