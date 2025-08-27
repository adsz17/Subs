import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  { quote: 'Excelente servicio y atención.', author: 'Ana' },
  { quote: 'Nuestra conversión aumentó al 200%.', author: 'Luis' },
  { quote: 'Implementación rápida y soporte increíble.', author: 'María' }
];

export function Testimonials() {
  return (
    <section className="container py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Testimonios</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map(t => (
          <Card key={t.author}>
            <CardContent className="p-6">
              <p className="mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm font-semibold">{t.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
