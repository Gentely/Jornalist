"use client";
import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SearchX, SlidersHorizontal } from "lucide-react";
import ResearchCard from "@/components/ResearchCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES, RESEARCHES, UNIVERSITIES } from "@/lib/data";

const selectCls = "h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-600/30";

function ShopInner() {
  const params = useSearchParams();
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState(params.get("category") || "all");
  const [fileType, setFileType] = React.useState("all");
  const [university, setUniversity] = React.useState("all");
  const [level, setLevel] = React.useState("all");
  const [sort, setSort] = React.useState("popular");

  const filtered = React.useMemo(() => {
    let list = RESEARCHES.filter((r) =>
      (category === "all" || r.category === category) &&
      (fileType === "all" || r.fileType === fileType) &&
      (university === "all" || r.university === university) &&
      (level === "all" || r.level === level) &&
      (q.trim() === "" || r.title.includes(q.trim()) || r.category.includes(q.trim()) || r.university.includes(q.trim()))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceLYD - b.priceLYD);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceLYD - a.priceLYD);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "popular") list = [...list].sort((a, b) => b.downloads - a.downloads);
    if (sort === "newest") list = [...list].sort((a, b) => b.year - a.year);
    return list;
  }, [q, category, fileType, university, level, sort]);

  const reset = () => { setQ(""); setCategory("all"); setFileType("all"); setUniversity("all"); setLevel("all"); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-black text-navy-900">مكتبة البحوث</h1>
      <p className="text-slate-500 mt-2 text-sm">بحوث PDF و Word موثقة من جامعات ليبية • جميع الأسعار بالدينار الليبي (LYD)</p>

      <div className="mt-7 rounded-2xl bg-white border shadow-card p-4 sm:p-5">
        <p className="font-black text-navy-900 flex items-center gap-2 mb-4"><SlidersHorizontal className="h-5 w-5 text-gold-500" /> تصفية النتائج</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 ابحث بعنوان البحث أو التخصص..." /></div>
          <select className={selectCls} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="الفئة">
            <option value="all">كل الفئات</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className={selectCls} value={fileType} onChange={(e) => setFileType(e.target.value)} aria-label="نوع الملف">
            <option value="all">نوع الملف: الكل</option><option value="PDF">PDF</option><option value="WORD">WORD (Word)</option>
          </select>
          <select className={selectCls} value={university} onChange={(e) => setUniversity(e.target.value)} aria-label="الجامعة">
            <option value="all">كل الجامعات</option>{UNIVERSITIES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <select className={selectCls} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="الترتيب">
            <option value="popular">الأكثر تحميلاً</option><option value="newest">الأحدث</option><option value="rating">الأعلى تقييماً</option><option value="price-asc">السعر: الأقل</option><option value="price-desc">السعر: الأعلى</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Filter className="h-4 w-4 text-slate-400" />
          {["all","ماجستير","دكتوراه","بكالوريوس"].map((l) => (
            <button key={l} onClick={() => setLevel(l)} className={`px-3.5 py-1.5 rounded-full text-xs font-black border transition ${level === l ? "bg-navy-800 text-white border-navy-800" : "bg-white text-navy-800 border-slate-300 hover:bg-slate-50"}`}>{l === "all" ? "كل المستويات" : l}</button>
          ))}
          <span className="ms-auto flex items-center gap-3"><span className="text-xs font-bold text-slate-500">{filtered.length} بحثاً</span><Button size="sm" variant="ghost" onClick={reset}>إعادة تعيين</Button></span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white border p-14 text-center">
          <SearchX className="h-14 w-14 mx-auto text-slate-300 mb-3" />
          <h2 className="font-black text-xl text-navy-900">لا توجد نتائج مطابقة</h2>
          <p className="text-sm text-slate-500 mt-2">جرّب تغيير الفلاتر، أو اطلب بحثك مخصصاً وسنجهزه لك.</p>
          <div className="mt-5 flex justify-center gap-2"><Button variant="outline" onClick={reset}>إعادة التعيين</Button><Button asChild><a href="/custom-request">طلب بحث مخصص</a></Button></div>
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{filtered.map((r) => <ResearchCard key={r.id} r={r} />)}</div>
      )}
    </div>
  );
}
export default function ShopPage() { return <Suspense fallback={<div className="p-16 text-center font-bold">جاري التحميل...</div>}><ShopInner /></Suspense>; }
