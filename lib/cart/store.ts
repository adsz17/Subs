import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
            )
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      increment: (id) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, qty: Math.min(i.qty + 1, 99) } : i
          )
        }),
      decrement: (id) =>
        set({
          items: get().items
            .map((i) =>
              i.id === id ? { ...i, qty: Math.max(i.qty - 1, 1) } : i
            )
            .filter((i) => i.qty > 0)
        }),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

