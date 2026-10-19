"use client";
import * as React from "react";
import Link from "next/link";
import { BookOpenCheck, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";

const NAV = [
  { href: "/", label: "الرئيسية" }, { href: "/shop", label: "المكتبة" }, { href: "/custom-request", label: "بحث مخصص" },
  { href: "/about", label: "من نحن" }, { href: "/contact", label: "تواصل معنا" }, { href: "/admin", label: "الإدارة" },
];
export default function Header() {
  const { items } = useCart();
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b shadow-sm">
      <div className="bg-navy-900 text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-between gap-3">
          <p className="truncate">📍 {SITE.location} • بحوث موثقة PDF / Word من جامعات ليبية</p>
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <a className="hover:text-gold-400" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a className="hover:text-green-300 font-bold" dir="ltr" href={SITE.whatsappUrl} target="_blank" rel="noreferrer">{SITE.whatsappDisplay}</a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-[72px] gap-3">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="h-11 w-11 rounded-2xl bg-navy-800 text-gold-400 flex items-center justify-center shadow-soft"><BookOpenCheck className="h-6 w-6" /></span>
            <span className="leading-tight">
              <span className="block text-xl font-black text-navy-900">Journalist</span>
              <span className="block text-[11px] font-bold text-slate-500">منصة البحوث العلمية • ليبيا</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => <Link key={n.href} href={n.href} className="px-3.5 py-2 rounded-lg text-sm font-bold text-navy-800 hover:bg-navy-50">{n.label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/shop" aria-label="بحث" className="h-10 w-10 hidden sm:flex items-center justify-center rounded-xl hover:bg-slate-100 text-navy-800"><Search className="h-5 w-5" /></Link>
            <Link href="/cart" aria-label="السلة" className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-navy-50 text-navy-800">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && <span className="absolute -top-1 -left-1 h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center">{items.length}</span>}
            </Link>
            <Button asChild variant="whatsapp" size="sm" className="hidden md:inline-flex h-10 px-4">
              <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer"><WhatsAppIcon /> واتساب</a>
            </Button>
            <button onClick={() => setOpen(!open)} aria-label="القائمة" className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100">{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && (
          <nav className="lg:hidden pb-4 grid grid-cols-2 gap-2">
            {NAV.map((n) => <Link key={n.href} onClick={() => setOpen(false)} href={n.href} className="px-4 py-3 rounded-xl bg-slate-50 text-sm font-bold text-navy-800">{n.label}</Link>)}
            <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="col-span-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-black text-center">تواصل واتساب {SITE.whatsappDisplay}</a>
          </nav>
        )}
      </div>
    </header>
  );
}
