"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  Languages,
  ShoppingCart,
} from "lucide-react";
import type { Research } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BankAccountDialog from "@/components/BankAccountDialog";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { useCart } from "@/lib/cart";
import { cn, formatLYD, whatsappLink } from "@/lib/utils";

/** غلاف البحث: صورة حقيقية مع عنوان البحث في أسفلها حتى تُقرأ كغلاف كتاب واضح. */
export function Cover({ r, tall = false, showTitle = true }: { r: Research; tall?: boolean; showTitle?: boolean }) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-navy-900", tall ? "aspect-[3/4]" : "aspect-[4/3]")}> 
      <Image
        src={r.cover}
        alt={`غلاف بحث: ${r.title}`}
        fill
        priority={tall}
        sizes={tall ? "(max-width: 1024px) 100vw, 420px" : "(max-width: 768px) 100vw, 340px"}
        className="object-cover object-top"
      />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
        <Badge className="border-0 bg-blue-700/95 text-white shadow">
          <FileText className="ms-1 h-3 w-3" /> Word
        </Badge>
        <Badge className="border-0 bg-white/90 text-navy-900 shadow">{r.group}</Badge>
      </div>
      {showTitle && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pb-4 pt-14 text-white">
          <p className="mb-1 text-[11px] font-bold text-gold-400">Journalist | منصة البحوث العلمية</p>
          <p dir="auto" className={cn("font-black leading-6", tall ? "text-lg leading-8" : "text-sm")}>{r.title}</p>
        </div>
      )}
    </div>
  );
}

/**
 * صف بحث واحد ضمن قائمة متتالية سهلة:
 * 1) صورة الغلاف  2) عنوان البحث  3) نبذة مختصرة واضحة
 * 4) المختصر الكامل عند الرغبة  5) السعر والطلب والدفع بعد النبذة.
 */
export function ResearchListItem({ r }: { r: Research }) {
  const { add, has } = useCart();
  const router = useRouter();
  const [expanded, setExpanded] = React.useState(false);
  const inCart = has(r.id);
  const waText = `مرحباً منصة Journalist،\nقرأت نبذة هذا البحث وأريد طلبه:\n${r.title}\nالسعر: ${r.priceLYD} د.ل\nالنوع: Word (DOCX)`;

  const orderNow = () => {
    add(r);
    router.push("/checkout");
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:shadow-soft">
      <div className="flex flex-col md:flex-row">
        {/* 1) الغلاف */}
        <Link href={`/product/${r.id}`} className="block shrink-0 md:w-64 lg:w-72" aria-label={`فتح صفحة بحث ${r.title}`}>
          <div className="relative h-72 w-full overflow-hidden bg-navy-900 md:h-full md:min-h-[330px]">
            <Image src={r.cover} alt={`غلاف بحث: ${r.title}`} fill sizes="(max-width: 768px) 100vw, 288px" className="object-cover object-top transition duration-500 hover:scale-[1.03]" />
            <div className="absolute start-3 top-3 rounded-full bg-blue-700 px-3 py-1 text-[11px] font-black text-white shadow">Word DOCX</div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-12 text-[11px] font-bold text-white md:hidden">Journalist | منصة البحوث العلمية</div>
          </div>
        </Link>

        {/* 2) العنوان + 3) النبذة + 4) المختصر + 5) الطلب */}
        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{r.group}</Badge>
            <Badge variant="secondary">{r.category}</Badge>
            <Badge variant="outline">{r.level}</Badge>
            <span className="text-xs font-bold text-slate-500">{r.language}</span>
          </div>

          <Link href={`/product/${r.id}`} className="mt-3 block hover:text-navy-600">
            <h2 dir="auto" className="text-xl font-black leading-9 text-navy-900 sm:text-2xl sm:leading-10">{r.title}</h2>
          </Link>

          <div className="mt-3 rounded-2xl border border-blue-100 bg-bank p-4" aria-label="نبذة مختصرة عن البحث">
            <p className="mb-1.5 flex items-center gap-2 text-sm font-black text-navy-900">
              <BookOpen className="h-4 w-4 text-gold-600" /> نبذة مختصرة عن البحث
            </p>
            <p className="text-sm leading-7 text-slate-700">{r.summary}</p>
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="mt-3 inline-flex items-center gap-1 text-sm font-black text-navy-700 hover:underline"
            >
              {expanded ? "إخفاء المختصر الكامل" : "عرض المختصر العلمي الكامل قبل الطلب"}
              <ChevronDown className={cn("h-4 w-4 transition", expanded && "rotate-180")} />
            </button>
            {expanded && (
              <div className="mt-3 border-t border-blue-100 pt-3">
                <p dir="auto" className="text-sm leading-8 text-slate-600">{r.abstract}</p>
                <p className="mt-3 text-xs font-black text-navy-900">أبرز محتويات البحث:</p>
                <ul className="mt-2 grid gap-1.5 text-xs font-bold leading-6 text-slate-600 sm:grid-cols-2">
                  {r.chapters.slice(0, 6).map((chapter) => (
                    <li key={chapter} className="flex items-start gap-1.5"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-green-600" /><span dir="auto">{chapter}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-500">
            <span>نحو {r.pages} صفحة بعد التنسيق</span>
            <span>{r.words.toLocaleString("ar-LY")} كلمة تقريباً</span>
            <span className="inline-flex items-center gap-1"><Languages className="h-3.5 w-3.5" /> {r.language}</span>
            <span>ملف Word قابل للتعديل والطباعة</span>
          </div>

          {/* الطلب والدفع يأتيان بعد مشاهدة النبذة، في شريط واضح واحد */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="shrink-0">
                <p className="text-[11px] font-bold text-slate-400">السعر الكلي</p>
                <p className="text-3xl font-black text-navy-800">{formatLYD(r.priceLYD)}</p>
              </div>
              <div className="grid flex-1 grid-cols-1 gap-2 min-[520px]:grid-cols-2 lg:grid-cols-4">
                <Button type="button" onClick={orderNow} className="h-11">
                  اطلب وادفع الآن <ArrowLeft />
                </Button>
                <Button type="button" variant="secondary" onClick={() => add(r)} disabled={inCart} className="h-11">
                  {inCart ? <><Check /> داخل السلة</> : <><ShoppingCart /> أضف إلى السلة</>}
                </Button>
                <BankAccountDialog className="h-11 w-full" />
                <Button asChild variant="whatsapp" className="h-11">
                  <a href={whatsappLink(waText)} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-5 w-5" /> اطلب واتساب</a>
                </Button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-bold text-slate-400">بعد اعتماد إيصال التحويل أو تأكيد طلب واتساب، يصبح ملف البحث متاحاً وفق خطوات التسليم.</p>
              <Link href={`/product/${r.id}`} className="text-xs font-black text-navy-700 hover:underline">فتح صفحة البحث والمعاينة ←</Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/** بطاقة مصغرة للمقترحات، تستخدم صورة الغلاف ونبذة قصيرة دون تعقيد. */
export default function ResearchCard({ r }: { r: Research }) {
  const { add, has } = useCart();
  const inCart = has(r.id);
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/product/${r.id}`}><Cover r={r} /></Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-1.5"><Badge variant="secondary">{r.group}</Badge><Badge variant="outline">Word</Badge></div>
        <Link href={`/product/${r.id}`} className="font-black leading-7 text-navy-900 line-clamp-2 hover:text-navy-600"><span dir="auto">{r.title}</span></Link>
        <p className="mt-2 text-xs leading-6 text-slate-500 line-clamp-3">{r.summary}</p>
        <p className="mt-2 text-[11px] font-bold text-slate-400">نحو {r.pages} صفحة • {r.language}</p>
        <div className="mt-auto pt-4">
          <p className="mb-3 text-2xl font-black text-navy-800">{formatLYD(r.priceLYD)}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild size="sm" variant="outline" className="h-10"><Link href={`/product/${r.id}`}>اقرأ النبذة</Link></Button>
            <Button size="sm" onClick={() => add(r)} disabled={inCart} className="h-10">{inCart ? "في السلة" : "أضف للسلة"}</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
