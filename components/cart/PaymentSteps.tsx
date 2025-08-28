'use client';

interface Props {
  step: number;
}

const steps = ['Resumen', 'Pago', 'Confirmación'];

export function PaymentSteps({ step }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      {steps.map((s, idx) => (
        <div
          key={s}
          className={`px-3 py-1 rounded-full text-sm ${
            idx === step ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {idx + 1}. {s}
        </div>
      ))}
    </div>
  );
}

