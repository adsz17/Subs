import { prisma } from '@/lib/db';
import { formatMoney } from '@/lib/format';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueChart } from './_components/RevenueChart';
import { PaymentStatus, WebhookStatus } from '@prisma/client';

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

  const [
    activeServices,
    priceStats,
    recentServices,
    leadsTotal,
    conversions30Days,
    revenueByCurrency,
    recentPayments,
    monthlyPayments,
    failedWebhooks,
    inactiveServicesWithoutPrices,
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
    prisma.contactMessage.count(),
    prisma.payment.count({
      where: {
        status: PaymentStatus.SUCCESS,
        createdAt: { gte: thirtyDaysAgo },
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

  const metrics = [
    { label: 'Ingresos totales', value: revenueTotalDisplay },
    { label: 'Leads captados', value: leadsTotal.toString() },
    { label: 'Conversiones (30 días)', value: conversions30Days.toString() },
    { label: 'Servicios activos', value: activeServices.toString() },
    { label: 'Precios publicados', value: priceStats._count._all.toString() },
    { label: 'Ticket promedio', value: averagePriceDisplay },
  ];

  const hasAlerts = failedWebhooks.length > 0 || inactiveServicesWithoutPrices.length > 0;

  return (
    <div className="space-y-8">
      {hasAlerts && (
        <div className="space-y-4">
          {failedWebhooks.length > 0 && (
            <Alert variant="destructive">
              <AlertTitle>Webhooks con errores</AlertTitle>
              <AlertDescription>
                Se detectaron {failedWebhooks.length} eventos recientes con fallas en el procesamiento.
                <ul className="mt-3 space-y-2 text-xs">
                  {failedWebhooks.map((webhook) => (
                    <li key={webhook.id} className="flex flex-col gap-1 rounded-md bg-red-50/70 p-3 text-red-900">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                          {webhook.provider} · {webhook.eventId}
                        </span>
                        <span className="text-[11px] uppercase tracking-wide text-red-900/80">
                          {webhook.createdAt.toISOString().slice(0, 16).replace('T', ' ')}
                        </span>
                      </div>
                      {webhook.errorMessage && (
                        <span className="text-xs text-red-700/90">{webhook.errorMessage}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          {inactiveServicesWithoutPrices.length > 0 && (
            <Alert className="border-yellow-400/70 bg-yellow-50 text-yellow-900">
              <AlertTitle>Servicios inactivos sin tarifas publicadas</AlertTitle>
              <AlertDescription>
                Revisa los siguientes servicios para definir un precio antes de reactivarlos:
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-yellow-800">
                  {inactiveServicesWithoutPrices.map((service) => (
                    <li key={service.id}>{service.name}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="rounded-2xl shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Ingresos por mes</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueChartData} currency={primaryCurrency} />
            {revenueByCurrency.length > 1 && (
              <p className="mt-4 text-xs text-gray-500">
                Mostrando solamente transacciones en {primaryCurrency}. Existen otras monedas registradas.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Conversiones recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {recentPayments.map((payment) => (
                <li key={payment.id} className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between text-slate-900">
                    <span>{payment.order?.email ?? 'Cliente sin email'}</span>
                    <span className="font-medium">
                      {formatMoney(payment.amountCents, payment.currency)}
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {payment.createdAt.toISOString().slice(0, 16).replace('T', ' ')}
                  </span>
                </li>
              ))}
              {recentPayments.length === 0 && (
                <li className="text-sm text-gray-500">Aún no hay conversiones registradas.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle>Últimos servicios editados</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {recentServices.map((service) => (
              <li key={service.id} className="flex justify-between">
                <span>{service.name}</span>
                <span className="text-gray-500">{service.updatedAt.toISOString().slice(0, 10)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
