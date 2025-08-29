import { Card, CardContent } from '@/components/ui/card';

interface ProjectCardProps {
  title: string;
  image: string;
  tags?: string[];
}

export function ProjectCard({ title, image, tags = [] }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden shadow-soft transition-transform hover:-translate-y-1">
      <img
        src={image}
        alt={title}
        className="h-40 w-full object-cover"
      />
      <CardContent className="p-4 space-y-2">
        <p className="font-medium">{title}</p>
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-xs text-zinc-500">
            {tags.map(tag => (
              <li key={tag} className="rounded-full bg-zinc-100 px-2 py-0.5">{tag}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
