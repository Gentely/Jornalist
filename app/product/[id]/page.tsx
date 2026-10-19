"use client";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { BookOpen, Calendar, Check, Download, Eye, FileText, GraduationCap, Languages, Lock, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import { getResearch, RESEARCHES } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ResearchCard";
import ResearchCard from "@/components/ResearchCard";
import BankAccountDialog from "@/components/BankAccountDialog";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { useCart } from "@/lib/cart";
import { formatLYD, whatsappLink } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const r = getResearch(params.id);
  const { add, has } = useCart();
  if (!r) return notFound();
  const related = RESEARCHES.filter((x) => x.category === r.category && x.id !== r.id).slice(0, 3);
  const waText = `مرحباً منصة Journalist،\nأريد شراء هذا البحث:\n📚 ${r.title}\n💰 السعر: ${r.priceLYD} د.ل\n📄 النوع: ${r.fileType}\nشكراً لكم`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="text-xs font-bold text-slate-500 mb-5"><Link href="/" className="hover:text-navy-700">الرئيسية</Link> / <Link href="/shop" className="hover:text-navy-700">المكتبة</Link> / <Link href={`/shop?category=${encodeURIComponent(r.category)}`} className="hover:text-navy-700">{r.category}</Link> / <span className="text-navy-900">تفاصيل البحث</span></nav>

      <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-start">
        <div className="rounded-3xl overflow-hidden shadow-soft border bg-white">
          <Cover r={r} tall />
          <div className="p-5 grid grid-cols-3 text-center divide-x divide-x-reverse divide-slate-100">
            <div><FileText className="h-4 w-4 mx-auto text-slate-400 mb-1" /><p className="text-xs font-black">{r.pages} صفحة</p></div>
            <div><Download className="h-4 w-4 mx-auto text-slate-400 mb-1" /><p className="text-xs font-black">{r.downloads} تحميل</p></div>
            <div><Star className="h-4 w-4 mx-auto text-amber-500 mb-1" /><p className="text-xs font-black">{r.rating} / 5</p></div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border shadow-card p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge>{r.category}</Badge><Badge variant="outline">{r.level}</Badge>
            <Badge className={r.fileType === "PDF" ? "bg-red-600 border-0" : "bg-blue-600 border-0"}>{r.fileType === "PDF" ? "PDF" : "Word (DOCX)"}</Badge>
            {r.bestSeller && <Badge variant="gold">الأكثر مبيعاً</Badge>}
          </div>
          <h1 className="text-2xl sm:text-[28px] font-black text-navy-900 leading-[1.7]">{r.title}</h1>
          <p className="text-sm text-slate-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {r.university}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {r.year}</span>
            <span className="flex items-center gap-1"><Languages className="h-4 w-4" /> {r.language}</span>
          </p>

          <div className="flex items-end gap-3 mt-6 pb-6 border-b">
            <span className="text-4xl font-black text-navy-800">{formatLYD(r.priceLYD)}</span>
            {r.oldPriceLYD && <><span className="text-lg text-slate-400 line-through mb-1">{formatLYD(r.oldPriceLYD)}</span><Badge className="bg-red-600 border-0 mb-1.5">وفّر {r.oldPriceLYD - r.priceLYD} د.ل</Badge></>}
            <span className="text-xs text-slate-400 mb-1.5">شامل التحميل الفوري بعد الاعتماد</span>
          </div>

          {/* Actions — spec: [حساب الدفع] + [واتساب] */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button size="lg" onClick={() => add(r)} disabled={has(r.id)} className="flex-1 min-w-[160px]">{has(r.id) ? <><Check /> أُضيف إلى السلة</> : <><ShoppingCart /> أضف إلى السلة</>}</Button>
            <BankAccountDialog size="lg" className="flex-1 min-w-[150px]" />
            <Button asChild size="lg" variant="whatsapp" className="flex-1 min-w-[150px]"><a href={whatsappLink(waText)} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-5 w-5" /> واتساب</a></Button>
          </div>
          <Button asChild variant="gold" size="lg" className="w-full mt-3"><Link href="/checkout">إتمام الشراء الآن ←</Link></Button>

          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs font-bold text-slate-600">
            {["تحميل فوري بعد اعتماد الإيصال", "مراجع موثقة بنظام APA", "دعم عبر واتساب " + SITE.whatsappDisplay].map((t) => <p key={t} className="flex items-center gap-1.5 rounded-xl bg-slate-50 p-3"><ShieldCheck className="h-4 w-4 text-green-600 shrink-0" /> {t}</p>)}
          </div>

          <h2 className="font-black text-navy-900 mt-8 mb-2 text-lg">ملخص البحث</h2>
          <p className="text-sm leading-8 text-slate-600">{r.abstract}</p>
          <h3 className="font-black text-navy-900 mt-6 mb-3 flex items-center gap-2"><BookOpen className="h-5 w-5 text-gold-500" /> فصول البحث</h3>
          <ul className="space-y-2">{r.chapters.map((c, i) => <li key={c} className="flex items-center gap-3 rounded-xl border p-3 text-sm font-bold"><span className="h-7 w-7 rounded-lg bg-navy-50 flex items-center justify-center text-xs font-black shrink-0">{i+1}</span> {c}</li>)}</ul>
        </div>
      </div>

      {/* ===== Blurred 2-page preview ===== */}
      <section className="mt-10 rounded-3xl bg-white border shadow-card p-6 sm:p-8">
        <h2 className="font-black text-xl text-navy-900 flex items-center gap-2 mb-1"><Eye className="text-gold-500" /> معاينة مجانية — أول صفحتين</h2>
        <p className="text-sm text-slate-500 mb-6">المعاينة مموهة لحماية المحتوى. بعد الشراء تحصل على النسخة الكاملة ({r.pages} صفحة).</p>
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2].map((p) => (
            <div key={p} className="relative rounded-2xl border bg-slate-50 overflow-hidden">
              <div className="p-6 select-none" style={{ filter: "blur(3.5px)" }} aria-hidden>
                <p className="text-center font-black text-navy-900 mb-1">{r.university}</p>
                <p className="text-center text-xs text-slate-500 mb-5">كلية الدراسات العليا — {r.category}</p>
                <p className="font-black text-center leading-7 mb-5">{p === 1 ? r.title : "الفصل الأول: الإطار العام للدراسة"}</p>
                {[...Array(9)].map((_, i) => <div key={i} className="h-2.5 rounded bg-slate-300 mb-2.5" style={{ width: `${92 - (i % 3) * 14}%` }} />)}
                <p className="text-center text-xs text-slate-400 mt-5">{r.year}</p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30">
                <span className="h-12 w-12 rounded-full bg-navy-900/85 text-white flex items-center justify-center shadow-xl"><Lock className="h-5 w-5" /></span>
                <p className="font-black text-navy-900 mt-2 text-sm bg-white/85 px-3 py-1 rounded-full">صفحة {p} — معاينة محمية</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <BankAccountDialog />
          <Button asChild variant="whatsapp"><a href={whatsappLink(waText)} target="_blank" rel="noreferrer"><WhatsAppIcon /> اطلب النسخة الكاملة واتساب</a></Button>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12"><h2 className="text-2xl font-black text-navy-900 mb-5">بحوث ذات صلة في {r.category}</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{related.map((x) => <ResearchCard key={x.id} r={x} />)}</div></section>
      )}
    </div>
  );
}
