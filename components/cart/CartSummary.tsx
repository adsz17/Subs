'use client';

import { useCartStore } from '@/lib/cart/store';
import { useRouter } from 'next/navigation';

export function CartSummary() {
  const { items, total } = useCartStore();
  const router = useRouter();

  const subtotal = total();
  const isEmpty = items.length === 0;

  return (
    <div className="mt-6 p-4 border rounded w-full max-w-sm">
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Fee</span>
        <span>$0.00</span>
      </div>
      <div className="flex justify-between font-bold mb-4">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <button
        disabled={isEmpty}
        onClick={() => router.push('/checkout')}
        className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Ir a Checkout
      </button>
    </div>
  );
}

