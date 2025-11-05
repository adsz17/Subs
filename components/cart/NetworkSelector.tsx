'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NETWORKS = ['TRON-TRC20', 'ETH-ERC20', 'BSC-BEP20', 'Polygon-ERC20'];

interface Config {
  network: string;
  wallet: string;
  qrUrl?: string | null;
  provider: string;
}

interface NetworkSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function NetworkSelector({ value, onChange }: NetworkSelectorProps) {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch('/api/admin/payments-config');
        if (!r.ok) {
          const message = await r.text();
          console.error('Failed to fetch payments config', message);
          setError('No pudimos obtener la configuración de pagos. Intenta nuevamente.');
          return;
        }
        const data: Config = await r.json();
        setConfig(data);
      } catch (err) {
        console.error('Failed to fetch payments config', err);
        setError('Ocurrió un error inesperado al consultar la configuración de pagos.');
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const options = useMemo(() => {
    if (!config) return NETWORKS;
    if (config.provider === 'manual') return NETWORKS;
    return config.network ? [config.network] : NETWORKS;
  }, [config]);

  const isManual = config?.provider === 'manual';

  return (
    <Card className="border border-blue-100 bg-white">
      <CardHeader className="space-y-3">
        <Badge className="bg-blue-50 text-blue-700">Paso 2</Badge>
        <CardTitle className="text-xl text-slate-900">Selecciona la red de pago</CardTitle>
        <p className="text-sm text-slate-600">
          Define la red blockchain para transferir los fondos. Recomendamos TRON por sus bajas comisiones y confirmaciones
          rápidas.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error al cargar la configuración</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map(option => {
            const isActive = option === value;
            return (
              <Button
                key={option}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                className="h-auto justify-start gap-3 whitespace-normal py-3 text-left"
                onClick={() => onChange(option)}
                disabled={loading || (!isManual && option !== options[0])}
                aria-pressed={isActive}
              >
                <span className="font-medium text-slate-900">{option}</span>
                <span className="text-xs text-slate-500">
                  {option.startsWith('TRON') ? 'Ideal para montos altos con comisiones muy bajas.' : 'Compatible con wallets de las principales cadenas.'}
                </span>
              </Button>
            );
          })}
        </div>
        {loading && (
          <p className="text-sm text-slate-500">Cargando configuración de redes…</p>
        )}
        {!loading && !error && !isManual && (
          <Alert className="border-blue-100 bg-blue-50 text-blue-800">
            <AlertDescription>
              Esta orden está configurada para operar en la red {options[0]}. Contacta a soporte si necesitas habilitar otra red.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

