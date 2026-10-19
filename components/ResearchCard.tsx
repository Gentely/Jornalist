"use client";
import Link from "next/link";
import { BookOpen, Check, Download, FileText, FileType2, GraduationCap, ShoppingCart, Star } from "lucide-react";
import type { Research } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatLYD } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { whatsappLink } from "@/lib/utils";

export function Cover({ r, tall = false }: { r: Research; tall?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${r.gradient} ${tall ? "h-64" : "h-44"} flex flex-col justify-between p-5 text-white`}>
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1.5px, transparent 1.6px)", backgroundSize: "22px 22px" }} />
      <div className="relative flex items-start justify-between gap-2">
        <Badge className={r.fileType === "PDF" ? "bg-red-600 text-white border-0" : "bg-blue-600 text-white border-0"}>
          {r.fileType === "PDF" ? <FileText className="h-3 w-3 ms-1" /> : <FileType2 className="h-3 w-3 ms-1" />} {r.fileType === "PDF" ? "PDF" : "Word"}
        </Badge>
        {r.bestSeller && <Badge variant="gold">الأكثر مبيعاً</Badge>}
      </div>
      <div className="relative">
        <BookOpen className="h-9 w-9 opacity-90 mb-2" />
        <p className="font-black leading-7 line-clamp-2 text-[15px]">{r.title}</p>
        <p className="text-[11px] opacity-80 mt-1 flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {r.university} • {r.year}</p>
      </div>
    </div>
  );
}

export default function ResearchCard({ r }: { r: Research }) {
  const { add, has } = useCart();
  const inCart = has(r.id);
  return (
    <article className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all flex flex-col">
      <Link href={`/product/${r.id}`}><Cover r={r} /></Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <Badge variant="secondary">{r.category}</Badge><Badge variant="outline">{r.level}</Badge>
          <span className="ms-auto flex items-center gap-1 text-xs font-bold text-amber-600"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r.rating}</span>
        </div>
        <Link href={`/product/${r.id}`} className="font-black text-navy-900 leading-7 line-clamp-2 hover:text-navy-600">{r.title}</Link>
        <p className="text-xs text-slate-500 mt-1.5">{r.university} • {r.pages} صفحة • {r.downloads} تحميل</p>
        <div className="mt-auto pt-4">
          <div className="flex items-end gap-2 mb-3">
            <span className="text-2xl font-black text-navy-800">{formatLYD(r.priceLYD)}</span>
            {r.oldPriceLYD && <span className="text-sm text-slate-400 line-through mb-0.5">{formatLYD(r.oldPriceLYD)}</span>}
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-2">
            <Button size="sm" onClick={() => add(r)} disabled={inCart} className="h-10">
              {inCart ? <><Check /> في السلة</> : <><ShoppingCart /> أضف للسلة</>}
            </Button>
            <Button asChild size="sm" variant="whatsapp" className="h-10 w-10 p-0" aria-label="طلب عبر واتساب">
              <a href={whatsappLink(`مرحباً، أريد طلب البحث: ${r.title} — السعر ${r.priceLYD} د.ل`)} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-5 w-5" /></a>
            </Button>
            <Button asChild size="sm" variant="secondary" className="h-10 w-10 p-0" aria-label="التفاصيل">
              <Link href={`/product/${r.id}`}><Download className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
