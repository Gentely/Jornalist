"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpenCheck, Search, SearchX } from "lucide-react";
import { ResearchListItem } from "@/components/ResearchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GROUPS, RESEARCHES } from "@/lib/data";
import { cn } from "@/lib/utils";

function ShopInner() {
  const params = useSearchParams();
  const [query, setQuery] = React.useState("");
  const [group, setGroup] = React.useState(params.get("group") || params.get("category") || "all");

  const filtered = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    return RESEARCHES.filter((research) => {
      const inGroup = group === "all" || research.group === group || research.category === group;
      const inSearch = !term || `${research.title} ${research.summary} ${research.category} ${research.group}`.toLowerCase().includes(term);
      return inGroup && inSearch;
    });
  }, [group, query]);

  const reset = () => {
    setGroup("all");
    setQuery("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-navy-800 text-gold-400 shadow-soft"><BookOpenCheck className="h-7 w-7" /></span>
        <h1 className="text-3xl font-black text-navy-900 sm:text-4xl">قائمة البحوث العلمية</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          ابحث بكل بساطة: شاهد صورة الغلاف، واقرأ عنوان البحث ونبذته المختصرة، ثم اختر الطلب والدفع عندما تكون جاهزاً. جميع الأسعار بالدينار الليبي.
        </p>
      </div>

      {/* بحث واحد وأزرار فئات قليلة؛ بلا قوائم أو فلاتر معقدة */}
      <div className="mx-auto mt-7 max-w-3xl">
        <div className="relative">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="اكتب كلمة من عنوان البحث... السكري، الرئة، TESOL" className="h-13 rounded-2xl bg-white ps-12 text-base shadow-card" />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="اختر نوع البحث">
          {GROUPS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setGroup(item.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-black transition",
                group === item.id ? "border-navy-800 bg-navy-800 text-white shadow-soft" : "border-slate-300 bg-white text-navy-800 hover:bg-navy-50",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs font-bold text-slate-500">تظهر الآن {filtered.length} من بحوث الدفعة الأولى</p>
      </div>

      <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-green-200 bg-green-50 p-4 text-center text-sm font-bold leading-7 text-green-900">
        خطوات الطلب: ① اقرأ النبذة ② اضغط «اطلب وادفع الآن» أو واتساب ③ حوّل من «حساب الدفع» وارفع الإيصال.
      </div>

      {filtered.length === 0 ? (
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border bg-white p-12 text-center shadow-card">
          <SearchX className="mx-auto mb-3 h-14 w-14 text-slate-300" />
          <h2 className="text-xl font-black text-navy-900">لم نجد بحثاً بهذه الكلمة</h2>
          <p className="mt-2 text-sm text-slate-500">جرّب كلمة أبسط، أو أرسل موضوعك كبحث مخصص.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button type="button" variant="outline" onClick={reset}>عرض كل البحوث</Button>
            <Button asChild><Link href="/custom-request">اطلب بحثاً مخصصاً</Link></Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-5" aria-label="البحوث مرتبة واحداً تحت الآخر">
          {filtered.map((research) => <ResearchListItem key={research.id} r={research} />)}
        </div>
      )}

      <div className="mt-10 rounded-3xl bg-navy-800 p-7 text-center text-white">
        <h2 className="text-xl font-black">لم تجد موضوعك في هذه القائمة؟</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-300">أرسل العنوان والتخصص وعدد الصفحات المطلوب، وسنتواصل معك عبر واتساب بعرض واضح قبل البدء.</p>
        <Button asChild variant="gold" size="lg" className="mt-5"><Link href="/custom-request">اطلب بحثاً مخصصاً</Link></Button>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return <Suspense fallback={<div className="p-16 text-center font-bold text-navy-900">جارٍ تحميل قائمة البحوث...</div>}><ShopInner /></Suspense>;
}
