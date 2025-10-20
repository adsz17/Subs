import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import { ProjectGrid, type ProjectGridItem } from '@/components/ProjectGrid';

interface ProjectsProps {
  searchQuery?: string;
  category?: string;
}

const PROJECT_ICONS: ProjectGridItem['icon'][] = ['palette', 'rocket', 'sparkles', 'camera', 'command'];

function normalizeCategory(value: unknown, fallback: string) {
  if (!value || typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed
    .toLowerCase()
    .split(' ')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0);
}

export async function Projects(props: ProjectsProps = {}) {
  noStore();
  const { searchQuery = '', category = 'all' } = props;
  let projects: Array<{ id: string; title: string; imageUrl: string } & Record<string, unknown>> = [];

  try {
    projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  } catch {
    projects = [];
  }

  const formatted: ProjectGridItem[] = projects.map((project, index) => {
    const categoryValue = normalizeCategory(project.category, 'General');
    const summaryValue = typeof project.summary === 'string' ? project.summary : typeof project.description === 'string' ? project.description : null;
    const tags = normalizeTags(project.tags);

    return {
      id: project.id,
      title: project.title,
      image: project.imageUrl,
      summary: summaryValue,
      category: categoryValue,
      tags,
      icon: PROJECT_ICONS[index % PROJECT_ICONS.length],
    };
  });

  return (
    <section id="proyectos" className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <h2 className="mb-12 text-center text-3xl font-serif">Proyectos</h2>
      <ProjectGrid projects={formatted} defaultSearch={searchQuery} defaultCategory={category} />
    </section>
  );
}
