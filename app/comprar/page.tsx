/* eslint-disable @next/next/no-img-element */
import { ArrowRight, CalendarRange, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const revalidate = 0;

interface Props {
  searchParams: { plan?: string };
}

const TIMELINE = [
  {
    title: 'Diagnóstico express',
    description: 'Confirmamos alcance y accesos necesarios en una llamada de 30 minutos.',
    icon: CalendarRange,
  },
  {
    title: 'Pago y confirmación',
    description: 'Recibe la wallet corporativa, realiza la transferencia y comparte el hash de la operación.',
    icon: ShieldCheck,
  },
  {
    title: 'Onboarding y activación',
    description: 'En 48 horas se habilitan credenciales y roadmap de implementación.',
    icon: Sparkles,
  },
];

export default async function ComprarPage({ searchParams }: Props) {
  const payments = await prisma.paymentsConfig.findMany();
  const plan = searchParams.plan;

  return (
    <div className="space-y-12 bg-slate-50 pb-16">
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white">
        <div className="container grid gap-8 py-16 lg:grid-cols-[2fr,1fr] lg:items-center">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white">Checkout asistido</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">Prepara tu compra corporativa</h1>
            <p className="text-lg text-blue-100">
              Finaliza tu selección y agenda el pago manual con nuestro equipo. Te acompañamos en cada paso para asegurar una
              activación sin fricciones.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-blue-100/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <ShieldCheck className="h-4 w-4" aria-hidden /> Custodia verificada
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <Sparkles className="h-4 w-4" aria-hidden /> Onboarding premium
              </span>
            </div>
          </div>
          <Card className="border-white/30 bg-white/10 text-left text-sm text-blue-50 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Resumen de tu selección</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-100/80">Plan elegido</span>
                <span className="font-semibold text-white">{plan ? plan : 'Sin plan asignado'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100/80">Modalidad de pago</span>
                <span className="font-semibold text-white">Transferencia cripto</span>
              </div>
              <Button asChild className="w-full bg-white text-blue-700 hover:bg-blue-100">
                <Link href="/servicios" className="inline-flex items-center justify-center gap-2">
                  Ajustar mi selección
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="container grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card className="border border-blue-100">
            <CardHeader className="space-y-3">
              <Badge className="bg-blue-50 text-blue-700">Ruta de activación</Badge>
              <CardTitle className="text-2xl text-slate-900">¿Cómo avanzamos?</CardTitle>
              <p className="text-sm text-slate-600">
                Sigue los pasos a continuación para completar tu compra y habilitar el equipo de implementación dedicado.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ol className="space-y-5">
                {TIMELINE.map(step => (
                  <li key={step.title} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="mt-1 rounded-full bg-blue-50 p-2 text-blue-600">
                      <step.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border border-blue-100">
            <CardHeader className="space-y-2">
              <Badge className="bg-blue-50 text-blue-700">Recuerda</Badge>
              <CardTitle className="text-xl text-slate-900">Fees y comprobantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>• Fee operativo del 1.5% con mínimo de USD 5 por consolidación de fondos y conciliación manual.</p>
              <p>• Conserva capturas de la transferencia y el hash para acelerar la confirmación.</p>
              <p>• Los accesos se liberan cuando se valida 1 confirmación en la red seleccionada.</p>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          {payments.length === 0 ? (
            <Card className="border-dashed border-slate-200 bg-white">
              <CardContent className="py-10 text-center text-sm text-slate-500">
                Aún no configuraste wallets de cobro. Crea una desde el panel administrativo.
              </CardContent>
            </Card>
          ) : (
            payments.map(payment => (
              <Card key={payment.id} className="border border-blue-100">
                <CardHeader className="space-y-2">
                  <Badge className="bg-blue-50 text-blue-700">{payment.network}</Badge>
                  <CardTitle className="text-lg text-slate-900">Wallet de cobro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-md border border-dashed border-blue-200 bg-blue-50/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-blue-500">Dirección</p>
                    <p className="break-all font-mono text-slate-900">{payment.wallet}</p>
                  </div>
                  {payment.qrUrl && (
                    <img src={payment.qrUrl} alt={`QR ${payment.network}`} className="h-40 w-40 rounded-md border object-cover" />
                  )}
                  <p className="text-xs text-slate-500">
                    Envía únicamente tokens compatibles con la red {payment.network}. Una vez transferido, dirígete a checkout
                    para registrar el hash.
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </aside>
      </div>
    </div>
  );
}
