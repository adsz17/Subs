'use client';

import { useMemo, useState } from 'react';
import { Camera, Command, Palette, Rocket, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { EmptyPlaceholder } from '@/components/EmptyPlaceholder';

const ICON_MAP = {
  palette: Palette,
  rocket: Rocket,
  sparkles: Sparkles,
  camera: Camera,
  command: Command,
} satisfies Record<string, LucideIcon>;

type IconKey = keyof typeof ICON_MAP;

export interface ProjectGridItem {
  id: string;
  title: string;
  image: string;
  summary: string | null;
  category: string;
  tags: string[];
  icon: IconKey;
}

interface ProjectGridProps {
  projects: ProjectGridItem[];
  defaultSearch?: string;
  defaultCategory?: string;
}

export function ProjectGrid({ projects, defaultSearch = '', defaultCategory = 'all' }: ProjectGridProps) {
  const categories = useMemo(() => {
    const unique = new Set<string>();
    projects.forEach(project => {
      if (project.category) {
        unique.add(project.category);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const normalizedDefault = categories.includes(defaultCategory) ? defaultCategory : 'all';
  const [search, setSearch] = useState(defaultSearch);
  const [category, setCategory] = useState(normalizedDefault);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter(project => {
      const matchesCategory = category === 'all' || project.category === category;
      const matchesSearch =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        (project.summary ?? '').toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [projects, search, category]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Buscar proyectos..."
          className="md:max-w-sm"
        />
        <Select value={category} onChange={event => setCategory(event.target.value)} className="md:w-52">
          <option value="all">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map(project => {
          const Icon = ICON_MAP[project.icon] ?? ICON_MAP.palette;
          return (
            <ProjectCard
              key={project.id}
              title={project.title}
              image={project.image}
              summary={project.summary}
              category={project.category}
              tags={project.tags}
              icon={Icon}
            />
          );
        })}
        {filtered.length === 0 && (
          <EmptyPlaceholder
            title="Aún no hay proyectos publicados"
            description="Comparte tus casos de éxito desde el panel para mostrarlos a tus clientes."
            href="/admin/proyectos/nuevo"
            actionLabel="Crear proyecto"
          />
        )}
      </div>
    </div>
  );
}
