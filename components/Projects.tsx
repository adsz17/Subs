import { ProjectCard } from '@/components/ProjectCard';
import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

export async function Projects() {
  noStore();
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <section id="proyectos" className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <h2 className="mb-12 text-center text-3xl font-serif">Proyectos</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {projects.map(p => (
          <ProjectCard key={p.id} title={p.title} image={p.imageUrl} />
        ))}
        {projects.length === 0 && <p>No hay proyectos disponibles.</p>}
      </div>
    </section>
  );
}
