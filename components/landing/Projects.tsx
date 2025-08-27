import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const projects = [
  { title: 'Proyecto 1', image: 'https://placehold.co/600x400?text=Proyecto+1' },
  { title: 'Proyecto 2', image: 'https://placehold.co/600x400?text=Proyecto+2' },
  { title: 'Proyecto 3', image: 'https://placehold.co/600x400?text=Proyecto+3' }
];

export function Projects() {
  return (
    <section className="container py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Proyectos</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {projects.map(p => (
          <Card key={p.title} className="overflow-hidden">
            <Image src={p.image} alt={p.title} width={600} height={400} className="h-40 w-full object-cover" />
            <CardContent className="p-4">
              <p>{p.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
