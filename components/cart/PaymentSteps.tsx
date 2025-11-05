'use client';

import { CheckCircle2, CreditCard, ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  step: number;
}

const steps = [
  {
    title: 'Resumen',
    description: 'Revisa los servicios incluidos y ajusta cantidades antes de generar la orden.',
    icon: ShoppingCart,
  },
  {
    title: 'Pago',
    description: 'Selecciona la red, copia la wallet y carga el hash de tu transacción.',
    icon: CreditCard,
  },
  {
    title: 'Confirmación',
    description: 'Validamos el pago y activamos tus accesos de onboarding.',
    icon: Sparkles,
  },
];

export function PaymentSteps({ step }: Props) {
  return (
    <ol className="relative mb-8 flex flex-col gap-4 border-l border-blue-100 pl-6 text-sm text-slate-600 md:flex-row md:border-l-0 md:border-t md:pl-0">
      {steps.map((item, index) => {
        const Icon = item.icon;
        const isCompleted = index < step;
        const isActive = index === step;

        return (
          <li key={item.title} className="relative flex flex-1 flex-col gap-2 md:border-l md:border-blue-100 md:pl-6 md:first:border-l-0 md:first:pl-0">
            <span
              className={cn(
                'absolute -left-[1.4rem] flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold md:-top-6 md:left-0 md:border-2',
                isCompleted ? 'border-green-400 bg-green-50 text-green-600' : isActive ? 'border-blue-500 bg-white text-blue-600' : 'border-slate-200 bg-white text-slate-400'
              )}
              aria-hidden
            >
              {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </span>
            <div className={cn('mt-6 space-y-1 md:mt-8', isActive && 'text-blue-700')}>
              <p className="text-base font-semibold text-slate-900">
                Paso {index + 1}: {item.title}
              </p>
              <p>{item.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden h-full w-px bg-gradient-to-b from-blue-100 to-transparent md:absolute md:left-4 md:top-10 md:block" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

