"use client";
import { CartTable } from '@/components/cart/CartTable';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyState } from '@/components/cart/EmptyState';
import { useCartStore } from '@/lib/cart/store';

export default function CartPage() {
  const { items } = useCartStore();

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="container mx-auto p-4">
      <CartTable />
      <div className="flex justify-end">
        <CartSummary />
      </div>
    </div>
  );
}

