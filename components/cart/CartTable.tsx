'use client';

import { useCartStore } from '@/lib/cart/store';

export function CartTable() {
  const { items, increment, decrement, removeItem } = useCartStore();

  if (items.length === 0) return null;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th className="py-2">Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b">
            <td className="py-2">{item.name}</td>
            <td>{item.price.toFixed(2)}</td>
            <td>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement(item.id)}
                  className="px-2 border rounded"
                >
                  -
                </button>
                {item.qty}
                <button
                  onClick={() => increment(item.id)}
                  className="px-2 border rounded"
                >
                  +
                </button>
              </div>
            </td>
            <td>{(item.price * item.qty).toFixed(2)}</td>
            <td>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

