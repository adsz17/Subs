import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactModal } from '@/components/ContactModal';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description?: string | null;
}

export function ServiceCard({ icon: Icon, title, description }: ServiceCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex items-center gap-2">
        <Icon className="h-6 w-6 text-zinc-600" aria-hidden />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {description && <p className="text-sm text-zinc-600">{description}</p>}
        <ContactModal />
      </CardContent>
    </Card>
  );
}
