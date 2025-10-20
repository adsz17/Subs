'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
  currency: string;
}

const axisTickFormatter = (value: number, formatter: Intl.NumberFormat) =>
  formatter.format(value);

export function RevenueChart({ data, currency }: RevenueChartProps) {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }),
    [currency]
  );

  const tooltipFormatter = useMemo(
    () =>
      ((value: ValueType) => {
        if (typeof value !== 'number') return value;
        return formatter.format(value);
      }) as TooltipProps<ValueType, NameType>['formatter'],
    [formatter]
  );

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" className="stroke-slate-200" />
        <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
        <YAxis
          stroke="#64748b"
          tickLine={false}
          axisLine={false}
          width={90}
          tickFormatter={(value) => axisTickFormatter(value, formatter)}
        />
        <Tooltip
          formatter={tooltipFormatter}
          contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)' }}
          labelStyle={{ fontWeight: 600, color: '#0f172a' }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="rgba(37, 99, 235, 0.2)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
