import { prisma } from '@/lib/db';
import { formatMoney } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueChart } from './_components/RevenueChart';
import { PaymentStatus, WebhookStatus } from '@prisma/client';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BellRing,
  CreditCard,
  DollarSign,
  Layers,
  MousePointerClick,
  ShieldAlert,
  Tag,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const revalidate = 0;

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getMonthLabel(date: Date) {
  const label = date.toLocaleString('es-ES', { month: 'short' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default async function AdminDashboard() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    activeServices,
    priceStats,
    recentServices,
    leadsLast30Days,
    leadsPrev30Days,
    conversionsLast30Days,
    conversionsPrev30Days,
    revenueByCurrency,
    recentPayments,
    monthlyPayments,
    failedWebhooks,
    inactiveServicesWithoutPrices,
    servicesUpdatedLast30Days,
    newPricesLast30Days,
  ] = await Promise.all([
    prisma.service.count({ where: { isActive: true } }),
    prisma.price.aggregate({
      _avg: { amountCents: true },
      _count: { _all: true },
    }),
    prisma.service.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, name: true, updatedAt: true },
    }),
    prisma.contactMessage.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.contactMessage.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    }),
    prisma.payment.count({
      where: {
        status: PaymentStatus.SUCCESS,
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.payment.count({
      where: {
        status: PaymentStatus.SUCCESS,
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    }),
    prisma.payment.groupBy({
      by: ['currency'],
      where: { status: PaymentStatus.SUCCESS },
      _sum: { amountCents: true },
    }),
    prisma.payment.findMany({
      where: { status: PaymentStatus.SUCCESS },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        amountCents: true,
        currency: true,
        createdAt: true,
        order: { select: { email: true } },
      },
    }),
    prisma.payment.findMany({
      where: {
        status: PaymentStatus.SUCCESS,
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amountCents: true, currency: true, createdAt: true },
    }),
    prisma.webhookEvent.findMany({
      where: { status: WebhookStatus.ERROR },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        provider: true,
        eventId: true,
        createdAt: true,
        errorMessage: true,
      },
    }),
    prisma.service.findMany({
      where: { isActive: false, prices: { none: {} } },
      select: { id: true, name: true },
    }),
    prisma.service.count({
      where: {
        updatedAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.price.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  const primaryCurrency = revenueByCurrency[0]?.currency ?? 'USD';
  const revenueTotalDisplay = revenueByCurrency.length
    ? revenueByCurrency
        .map(({ currency, _sum }) => formatMoney(Math.round(_sum.amountCents ?? 0), currency))
        .join(' · ')
    : formatMoney(0, primaryCurrency);

  const avgPriceCents = Math.round(priceStats._avg.amountCents ?? 0);
  const averagePriceDisplay = priceStats._count._all
    ? formatMoney(avgPriceCents, primaryCurrency)
    : '-';

  const chartMonths = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: getMonthKey(date),
      label: getMonthLabel(date),
      date,
    };
  });

  const revenueByMonth: Record<string, number> = {};
  for (const month of chartMonths) {
    revenueByMonth[month.key] = 0;
  }
  for (const payment of monthlyPayments) {
    if (payment.currency !== primaryCurrency) continue;
    const key = getMonthKey(payment.createdAt);
    if (key in revenueByMonth) {
      revenueByMonth[key] += payment.amountCents / 100;
    }
  }

  const revenueChartData = chartMonths.map((month) => ({
    month: month.label,
    revenue: Number(revenueByMonth[month.key].toFixed(2)),
  }));

  const revenueCurrentMonth = revenueChartData.at(-1)?.revenue ?? 0;
  const revenuePreviousMonth = revenueChartData.at(-2)?.revenue ?? 0;

  const formatPercentDelta = (current: number, previous: number) => {
    if (previous === 0) {
      if (current === 0) return { label: 'Sin cambios', tone: 'neutral' as const };
      return { label: '+100%', tone: 'positive' as const };
    }
    const diff = current - previous;
    const percentage = (diff / previous) * 100;
    const formatted = `${diff >= 0 ? '+' : ''}${Math.abs(percentage) >= 100 ? percentage.toFixed(0) : percentage.toFixed(1)}%`;
    return { label: formatted, tone: diff >= 0 ? ('positive' as const) : ('negative' as const) };
  };

  const formatDifferenceDelta = (current: number, previous: number, suffix = '') => {
    const diff = current - previous;
    if (diff === 0) return { label: 'Sin cambios', tone: 'neutral' as const };
    const formatted = `${diff > 0 ? '+' : ''}${diff}${suffix}`;
    return { label: formatted, tone: diff > 0 ? ('positive' as const) : ('negative' as const) };
  };

  const revenueDelta = formatPercentDelta(revenueCurrentMonth, revenuePreviousMonth);
  const conversionsDelta = formatDifferenceDelta(conversionsLast30Days, conversionsPrev30Days, ' vs. mes prev.');
  const leadsDelta = formatDifferenceDelta(leadsLast30Days, leadsPrev30Days, ' vs. mes prev.');
  const servicesDelta = formatDifferenceDelta(servicesUpdatedLast30Days, 0, ' actualizados');
  const priceDelta = formatDifferenceDelta(newPricesLast30Days, 0, ' nuevos');

  const metrics: {
    label: string;
    value: string;
    icon: LucideIcon;
    delta: { label: string; tone: 'positive' | 'negative' | 'neutral' };
    helper: string;
  }[] = [
    {
      label: 'Ingresos del mes',
      value: formatMoney(Math.round(revenueCurrentMonth * 100), primaryCurrency),
      icon: DollarSign,
      delta: revenueDelta,
      helper: 'vs. mes anterior',
    },
    {
      label: 'Conversiones (30 días)',
      value: conversionsLast30Days.toString(),
      icon: MousePointerClick,
      delta: conversionsDelta,
      helper: 'Procesos completados',
    },
    {
      label: 'Leads captados (30 días)',
      value: leadsLast30Days.toString(),
      icon: Users,
      delta: leadsDelta,
      helper: 'Formularios recibidos',
    },
    {
      label: 'Servicios activos',
      value: activeServices.toString(),
      icon: Layers,
      delta: servicesDelta,
      helper: 'Actualizados en 30 días',
    },
    {
      label: 'Precios publicados',
      value: priceStats._count._all.toString(),
      icon: Tag,
      delta: priceDelta,
      helper: 'Entradas en catálogo',
    },
    {
      label: 'Ticket promedio',
      value: averagePriceDisplay,
      icon: CreditCard,
      delta: { label: 'Estable', tone: 'neutral' },
      helper: 'Promedio actualizado',
    },
  ];

  const activityItems = [...recentPayments.map((payment) => ({
    id: `payment-${payment.id}`,
    date: payment.createdAt,
    title: payment.order?.email ?? 'Cliente sin email',
    description: `Pago de ${formatMoney(payment.amountCents, payment.currency)}`,
    icon: CreditCard,
  })),
  ...recentServices.map((service) => ({
    id: `service-${service.id}`,
    date: service.updatedAt,
    title: service.name,
    description: 'Servicio actualizado',
    icon: Layers,
  }))].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getDeltaBadgeClass = (tone: 'positive' | 'negative' | 'neutral') =>
    cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
      {
        positive: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
        negative: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
        neutral: 'bg-slate-500/10 text-slate-500 dark:text-slate-300',
      }[tone],
    );

  const hasAlerts = failedWebhooks.length > 0 || inactiveServicesWithoutPrices.length > 0;

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-[0_30px_80px_-40px_rgba(30,64,175,0.45)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_40px_100px_-40px_rgba(30,64,175,0.55)] dark:border-slate-800/60 dark:bg-slate-950/60"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-200">
                  <Icon className="h-5 w-5" />
                </div>
                <span className={getDeltaBadgeClass(metric.delta.tone)}>
                  {metric.delta.tone === 'positive' ? <ArrowUpRight className="h-3 w-3" /> : metric.delta.tone === 'negative' ? <ArrowDownRight className="h-3 w-3" /> : null}
                  {metric.delta.label}
                </span>
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                {metric.helper}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-500 dark:text-slate-300">{metric.label}</h3>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{metric.value}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
          <CardHeader className="flex flex-col gap-2 border-b border-white/10 pb-6 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Ingresos por mes</CardTitle>
              <Badge className="bg-blue-600/90 text-white">{primaryCurrency}</Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Evolución de los ingresos en los últimos seis meses.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <RevenueChart data={revenueChartData} currency={primaryCurrency} />
            {revenueByCurrency.length > 1 && (
              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                Mostrando solamente transacciones en {primaryCurrency}. Existen otras monedas registradas.
              </p>
            )}
            <div className="mt-6 grid gap-3 rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-600 shadow-inner dark:border-slate-800/60 dark:bg-slate-950/60 dark:text-slate-200">
              <div className="flex items-center justify-between">
                <span>Total histórico</span>
                <strong>{revenueTotalDisplay}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>Variación mensual</span>
                <span className={getDeltaBadgeClass(revenueDelta.tone)}>{revenueDelta.label}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
          <CardHeader className="flex items-center justify-between border-b border-white/10 pb-6 dark:border-slate-800/60">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Alertas</CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">Estado de integraciones y catálogo.</p>
            </div>
            <BellRing className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm text-slate-600 dark:text-slate-200">
            {!hasAlerts && (
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
                <p className="font-semibold">Todo en orden</p>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-200/80">No se registran incidentes pendientes.</p>
              </div>
            )}
            {failedWebhooks.length > 0 && (
              <div className="rounded-2xl border border-rose-400/50 bg-rose-100/60 p-4 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldAlert className="h-4 w-4" /> Webhooks con errores
                  </div>
                  <Badge className="bg-rose-500 text-white">{failedWebhooks.length}</Badge>
                </div>
                <ul className="space-y-2 text-xs">
                  {failedWebhooks.map((webhook) => (
                    <li key={webhook.id} className="rounded-xl bg-white/70 p-3 text-rose-700 shadow-sm dark:bg-rose-500/20 dark:text-rose-100">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">{webhook.provider} · {webhook.eventId}</span>
                        <span className="text-[11px] uppercase tracking-wide text-rose-500/80 dark:text-rose-200/70">
                          {webhook.createdAt.toISOString().slice(0, 16).replace('T', ' ')}
                        </span>
                        {webhook.errorMessage && <span className="text-[11px] text-rose-600/80 dark:text-rose-100/70">{webhook.errorMessage}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {inactiveServicesWithoutPrices.length > 0 && (
              <div className="rounded-2xl border border-amber-400/50 bg-amber-100/70 p-4 text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4" /> Servicios inactivos sin precio
                  </div>
                  <Badge className="bg-amber-500 text-white">{inactiveServicesWithoutPrices.length}</Badge>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-xs">
                  {inactiveServicesWithoutPrices.map((service) => (
                    <li key={service.id}>{service.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
          <CardHeader className="flex items-center justify-between border-b border-white/10 pb-6 dark:border-slate-800/60">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Actividad reciente</CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pagos confirmados y servicios actualizados.</p>
            </div>
            <Badge className="bg-blue-500/90 text-white">{activityItems.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm text-slate-600 dark:text-slate-200">
            {activityItems.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Todavía no hay movimientos recientes.</p>}
            <ul className="space-y-3">
              {activityItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/60 p-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/60">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-200">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{item.title}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {item.date.toISOString().slice(0, 16).replace('T', ' ')}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
          <CardHeader className="flex items-center justify-between border-b border-white/10 pb-6 dark:border-slate-800/60">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Catálogo</CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">Últimos servicios editados y ticket promedio.</p>
            </div>
            <Badge className="bg-slate-500/80 text-white">{recentServices.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-slate-600 shadow-inner dark:border-slate-800/60 dark:bg-slate-950/60 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ticket promedio</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{averagePriceDisplay}</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-200">
              {recentServices.map((service) => (
                <li key={service.id} className="flex items-center justify-between rounded-xl border border-white/20 bg-white/60 px-4 py-2 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/60">
                  <span className="truncate font-medium">{service.name}</span>
                  <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {service.updatedAt.toISOString().slice(0, 10)}
                  </span>
                </li>
              ))}
              {recentServices.length === 0 && <li className="text-sm text-slate-500 dark:text-slate-400">Sin servicios editados recientemente.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
