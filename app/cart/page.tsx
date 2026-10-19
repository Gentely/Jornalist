"use client";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import BankAccountDialog from "@/components/BankAccountDialog";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { formatLYD, whatsappLink } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export default function CartPage() {
  const { items, remove, total, clear } = useCart();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-navy-900 flex items-center gap-3"><ShoppingCart className="text-gold-500" /> سلة الشراء</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white border p-14 text-center"><ShoppingCart className="h-14 w-14 mx-auto text-slate-300 mb-3" /><h2 className="font-black text-xl text-navy-900">سلتك فارغة</h2><p className="text-sm text-slate-500 mt-2 mb-5">أضف بحوثاً من المكتبة ثم عد إلى هنا.</p><Button asChild><Link href="/shop">تصفح المكتبة</Link></Button></div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {items.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white border shadow-card p-4 flex items-center gap-4">
                <span className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-xs bg-gradient-to-br ${r.gradient}`}>{r.fileType === "PDF" ? "PDF" : "DOC"}</span>
                <div className="min-w-0 flex-1"><Link href={`/product/${r.id}`} className="font-black text-navy-900 text-sm leading-6 line-clamp-2 hover:underline"><span dir="auto">{r.title}</span></Link><p className="text-xs text-slate-500 mt-0.5">{r.summary ? <span className="line-clamp-2">{r.summary}</span> : `${r.university} • ${r.fileType}`}</p></div>
                <span className="font-black text-navy-800 shrink-0">{formatLYD(r.priceLYD)}</span>
                <button onClick={() => remove(r.id)} aria-label="حذف" className="h-9 w-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl bg-white border shadow-card p-6">
            <p className="flex justify-between font-black text-lg text-navy-900"><span>الإجمالي (LYD)</span><span>{formatLYD(total)}</span></p>
            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <Button asChild size="lg"><Link href="/checkout">إتمام الطلب ←</Link></Button>
              <BankAccountDialog size="lg" />
              <Button asChild size="lg" variant="whatsapp"><a href={whatsappLink(`مرحباً، لدي ${items.length} بحوث في السلة بإجمالي ${total} د.ل. أريد إتمام الطلب عبر واتساب ${SITE.whatsappDisplay}`)} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-5 w-5" /> واتساب</a></Button>
            </div>
            <button onClick={clear} className="text-xs font-bold text-slate-400 hover:text-red-600 mt-4">إفراغ السلة</button>
          </div>
        </>
      )}
    </div>
  );
}
