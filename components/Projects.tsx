import { ProjectCard } from '@/components/ProjectCard';

const projects = [
  { title: 'Proyecto 1', image: 'https://placehold.co/600x400?text=Proyecto+1' },
  { title: 'Proyecto 2', image: 'https://placehold.co/600x400?text=Proyecto+2' },
  { title: 'Proyecto 3', image: 'https://placehold.co/600x400?text=Proyecto+3' }
];

export function Projects() {
  return (
    <section id="proyectos" className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]">
      <h2 className="mb-12 text-center text-3xl font-serif">Proyectos</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {projects.map(p => (
          <ProjectCard key={p.title} title={p.title} image={p.image} />
        ))}
      </div>
    </section>
  );
}
