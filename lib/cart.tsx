"use client";
import * as React from "react";
import type { Research } from "@/lib/data";

interface CartCtx { items: Research[]; add: (r: Research) => void; remove: (id: string) => void; clear: () => void; has: (id: string) => boolean; total: number }
const Ctx = React.createContext<CartCtx>({ items: [], add: () => {}, remove: () => {}, clear: () => {}, has: () => false, total: 0 });
export const useCart = () => React.useContext(Ctx);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Research[]>([]);
  React.useEffect(() => { try { const raw = localStorage.getItem("journalist-cart"); if (raw) setItems(JSON.parse(raw)); } catch {} }, []);
  React.useEffect(() => { try { localStorage.setItem("journalist-cart", JSON.stringify(items)); } catch {} }, [items]);
  const value = React.useMemo<CartCtx>(() => ({
    items,
    add: (r) => setItems((p) => (p.some((x) => x.id === r.id) ? p : [...p, r])),
    remove: (id) => setItems((p) => p.filter((x) => x.id !== id)),
    clear: () => setItems([]),
    has: (id) => items.some((x) => x.id === id),
    total: items.reduce((s, x) => s + x.priceLYD, 0),
  }), [items]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
