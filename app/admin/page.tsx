"use client";
import * as React from "react";
import { Banknote, BookOpenCheck, Check, Clock3, Download, Eye, FileUp, LayoutDashboard, Plus, ReceiptText, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BankAccountDialog from "@/components/BankAccountDialog";
import { CATEGORIES, MOCK_ORDERS, RESEARCHES, UNIVERSITIES, type Order, type Research } from "@/lib/data";
import { formatLYD } from "@/lib/utils";

const sel = "h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-navy-600/30";
const KEY_ORDERS = "journalist-orders", KEY_RESEARCH = "journalist-extra-research";

export default function AdminPage() {
  const [tab, setTab] = React.useState<"dash" | "orders" | "add" | "library">("dash");
  const [orders, setOrders] = React.useState<Order[]>(MOCK_ORDERS);
  const [extra, setExtra] = React.useState<Research[]>([]);
  const [receiptView, setReceiptView] = React.useState<Order | null>(null);
  const [toast, setToast] = React.useState("");
  // Add-research form
  const [f, setF] = React.useState({ title: "", category: CATEGORIES[0], university: UNIVERSITIES[2], price: "120", pages: "100", year: "2025", level: "ماجستير", fileType: "PDF", abstract: "" });
  const [coverName, setCoverName] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY_ORDERS);
      if (saved) { const real: Order[] = JSON.parse(saved); setOrders([...real, ...MOCK_ORDERS.filter((m) => !real.some((r) => r.id === m.id))]); }
      const ex = localStorage.getItem(KEY_RESEARCH); if (ex) setExtra(JSON.parse(ex));
    } catch {}
  }, []);

  const persist = (next: Order[]) => {
    setOrders(next);
    try { localStorage.setItem(KEY_ORDERS, JSON.stringify(next.filter((o) => !MOCK_ORDERS.some((m) => m.id === o.id) || true))); } catch {}
  };
  const decide = (id: string, status: "approved" | "rejected") => {
    persist(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    setToast(status === "approved" ? `✅ تم اعتماد ${id} — فُتح التحميل للعميل في صفحة «طلباتي»` : `تم رفض الطلب ${id}`);
    setTimeout(() => setToast(""), 3500);
  };

  const revenue = orders.filter((o) => o.status === "approved").reduce((s, o) => s + o.totalLYD, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const allResearch = [...extra, ...RESEARCHES];

  const addResearch = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Research = {
      id: `res-${Date.now()}`, title: f.title, category: f.category, university: f.university, fileType: f.fileType as "PDF" | "WORD",
      priceLYD: Number(f.price) || 100, pages: Number(f.pages) || 80, year: Number(f.year) || 2025, level: f.level as Research["level"],
      rating: 4.5, downloads: 0, language: "العربية", abstract: f.abstract || "بحث مضاف حديثاً من لوحة الإدارة.", gradient: "from-[#0F2A4A] to-[#16406E]",
      chapters: ["الفصل الأول: الإطار العام للدراسة", "الفصل الثاني: الإطار النظري", "الفصل الثالث: منهجية الدراسة", "الفصل الرابع: النتائج", "الفصل الخامس: التوصيات"],
    };
    const next = [item, ...extra]; setExtra(next);
    try { localStorage.setItem(KEY_RESEARCH, JSON.stringify(next)); } catch {}
    setToast(`✅ أُضيف البحث بنجاح${fileName ? ` (الملف: ${fileName})` : ""}${coverName ? ` — الغلاف: ${coverName}` : ""}. في الإنتاج يُرفع إلى Supabase Storage.`);
    setF({ ...f, title: "", abstract: "" }); setCoverName(""); setFileName(""); setTab("library");
    setTimeout(() => setToast(""), 4000);
  };

  const statusBadge = (s: Order["status"]) => s === "pending" ? <Badge className="bg-amber-500 border-0"><Clock3 className="h-3 w-3 ms-1" />قيد المراجعة</Badge> : s === "approved" ? <Badge className="bg-green-600 border-0"><Check className="h-3 w-3 ms-1" />معتمد</Badge> : <Badge className="bg-red-600 border-0"><X className="h-3 w-3 ms-1" />مرفوض</Badge>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-3xl font-black text-navy-900 flex items-center gap-3"><LayoutDashboard className="text-gold-500" /> لوحة الإدارة</h1>
        <Badge variant="secondary">وضع تجريبي — اربط Supabase للإنتاج</Badge>
        <span className="ms-auto"><BankAccountDialog size="sm" /></span>
      </div>
      <p className="text-sm text-slate-500">الإدارة: محمد أحمد محمد • مصرف الجمهورية - صبراتة • mohamed.bahur@gmail.com</p>
      {toast && <p className="mt-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-bold p-3.5">{toast}</p>}

      <div className="flex flex-wrap gap-2 mt-6">
        {([["dash", "لوحة المؤشرات"], ["orders", `الطلبات والإيصالات (${pendingCount} بالانتظار)`], ["add", "إضافة بحث"], ["library", `المكتبة (${allResearch.length})`]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2.5 rounded-xl text-sm font-black border transition ${tab === k ? "bg-navy-800 text-white border-navy-800" : "bg-white text-navy-800 border-slate-300"}`}>{l}</button>
        ))}
      </div>

      {tab === "dash" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { i: Banknote, n: formatLYD(revenue), l: "إيرادات معتمدة (LYD)", c: "text-green-600 bg-green-50" },
            { i: ShoppingBag, n: String(orders.length), l: "إجمالي الطلبات", c: "text-navy-800 bg-navy-50" },
            { i: Clock3, n: String(pendingCount), l: "طلبات قيد المراجعة", c: "text-amber-600 bg-amber-50" },
            { i: BookOpenCheck, n: String(allResearch.length), l: "بحث في المكتبة", c: "text-violet-600 bg-violet-50" },
          ].map(({ i: Icon, n, l, c }) => (
            <div key={l} className="rounded-3xl bg-white border shadow-card p-6"><span className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-3 ${c}`}><Icon className="h-6 w-6" /></span><p className="text-2xl font-black text-navy-900">{n}</p><p className="text-xs font-bold text-slate-500 mt-1">{l}</p></div>
          ))}
          <div className="sm:col-span-2 lg:col-span-4 rounded-3xl bg-navy-800 text-white p-6 flex flex-wrap items-center gap-4">
            <ReceiptText className="h-9 w-9 text-gold-400" />
            <div className="flex-1 min-w-[220px]"><h2 className="font-black">لديك {pendingCount} إيصال(ات) بانتظار المراجعة</h2><p className="text-sm text-slate-300">راجع صورة الإيصال، قارنها بالمبلغ في حساب مصرف الجمهورية، ثم اعتمد أو ارفض. الاعتماد يفتح التحميل فوراً.</p></div>
            <Button variant="gold" onClick={() => setTab("orders")}>مراجعة الطلبات</Button>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-6 rounded-3xl bg-white border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead><tr className="bg-slate-50 text-navy-900 text-xs">
                {["رقم الطلب", "العميل", "البحوث", "الإجمالي", "الدفع", "الإيصال", "الحالة", "الإجراء (يفتح التحميل)"].map((h) => <th key={h} className="p-3.5 text-right font-black whitespace-nowrap">{h}</th>)}
              </tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-slate-50/60">
                    <td className="p-3.5 font-black whitespace-nowrap">{o.id}<span className="block text-[11px] text-slate-400 font-bold">{o.createdAt}</span></td>
                    <td className="p-3.5 whitespace-nowrap"><span className="font-bold">{o.customerName}</span><span className="block text-[11px] text-slate-400" dir="ltr">{o.phone}</span><span className="block text-[11px] text-slate-400" dir="ltr">{o.email}</span></td>
                    <td className="p-3.5 max-w-[240px]"><span className="line-clamp-2 font-bold text-xs leading-5">{o.items.map((i) => i.title).join("، ")}</span><span className="text-[11px] text-slate-400">{o.items.map((i) => i.fileType).join(" / ")}</span></td>
                    <td className="p-3.5 font-black whitespace-nowrap">{formatLYD(o.totalLYD)}</td>
                    <td className="p-3.5 whitespace-nowrap">{o.method === "bank" ? "تحويل مصرفي" : "واتساب"}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      {o.receiptName ? <button onClick={() => setReceiptView(o)} className="inline-flex items-center gap-1.5 text-navy-700 font-black text-xs bg-navy-50 px-2.5 py-1.5 rounded-lg hover:bg-navy-100"><Eye className="h-3.5 w-3.5" /> عرض الإيصال</button> : <span className="text-xs text-slate-400 font-bold">لا يوجد</span>}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">{statusBadge(o.status)}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      {o.status === "pending" ? (
                        <span className="flex gap-1.5">
                          <Button size="sm" variant="whatsapp" onClick={() => decide(o.id, "approved")}><Check /> اعتماد</Button>
                          <Button size="sm" variant="destructive" onClick={() => decide(o.id, "rejected")}><X /> رفض</Button>
                        </span>
                      ) : o.status === "approved" ? <span className="text-xs font-black text-green-700 flex items-center gap-1"><Download className="h-3.5 w-3.5" /> التحميل مفتوح</span> : <span className="text-xs font-bold text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "add" && (
        <form onSubmit={addResearch} className="mt-6 rounded-3xl bg-white border shadow-card p-6 sm:p-8">
          <h2 className="font-black text-navy-900 text-lg flex items-center gap-2 mb-5"><Plus className="text-gold-500" /> إضافة بحث جديد</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><Label>عنوان البحث *</Label><Input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="عنوان البحث بالكامل..." /></div>
            <div><Label>الفئة</Label><select className={sel} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><Label>الجامعة</Label><select className={sel} value={f.university} onChange={(e) => setF({ ...f, university: e.target.value })}>{UNIVERSITIES.map((u) => <option key={u}>{u}</option>)}</select></div>
            <div><Label>السعر (LYD) *</Label><Input type="number" min={1} required value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></div>
            <div><Label>نوع الملف</Label><select className={sel} value={f.fileType} onChange={(e) => setF({ ...f, fileType: e.target.value })}><option value="PDF">PDF</option><option value="WORD">Word (DOCX)</option></select></div>
            <div><Label>عدد الصفحات</Label><Input type="number" value={f.pages} onChange={(e) => setF({ ...f, pages: e.target.value })} /></div>
            <div><Label>المستوى</Label><select className={sel} value={f.level} onChange={(e) => setF({ ...f, level: e.target.value })}><option>ماجستير</option><option>دكتوراه</option><option>بكالوريوس</option></select></div>
            <div><Label>سنة البحث</Label><Input type="number" value={f.year} onChange={(e) => setF({ ...f, year: e.target.value })} /></div>
            <div>
              <Label>صورة الغلاف (Cover)</Label>
              <label className="flex items-center gap-2 h-11 px-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 cursor-pointer text-sm font-bold text-slate-600 hover:border-navy-600"><FileUp className="h-4 w-4 shrink-0" /><span className="truncate">{coverName || "اختر صورة غلاف..."}</span><input type="file" accept="image/*" className="sr-only" onChange={(e) => setCoverName(e.target.files?.[0]?.name || "")} /></label>
            </div>
            <div className="sm:col-span-2">
              <Label>ملف البحث (PDF / DOCX) *</Label>
              <label className="flex items-center gap-2 h-11 px-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 cursor-pointer text-sm font-bold text-slate-600 hover:border-navy-600"><FileUp className="h-4 w-4 shrink-0" /><span className="truncate">{fileName || "اختر ملف البحث الكامل..."}</span><input type="file" accept=".pdf,.docx,.doc" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} /></label>
            </div>
            <div className="sm:col-span-2"><Label>ملخص البحث</Label><textarea rows={3} value={f.abstract} onChange={(e) => setF({ ...f, abstract: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600/30" placeholder="مستخلص قصير..." /></div>
          </div>
          <Button type="submit" size="lg" className="mt-5"><Plus /> نشر البحث في المكتبة</Button>
          <p className="text-[11px] text-slate-400 font-bold mt-3">في الإنتاج: يُرفع الغلاف إلى bucket «covers» والملف إلى bucket «research-files» في Supabase Storage (انظر supabase/schema.sql).</p>
        </form>
      )}

      {tab === "library" && (
        <div className="mt-6 rounded-3xl bg-white border shadow-card overflow-hidden"><div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]"><thead><tr className="bg-slate-50 text-xs text-navy-900">{["البحث", "الفئة", "الجامعة", "النوع", "السعر", "الصفحات"].map((h) => <th key={h} className="p-3.5 text-right font-black">{h}</th>)}</tr></thead>
            <tbody>{allResearch.map((r) => <tr key={r.id} className="border-t"><td className="p-3.5 font-bold text-xs leading-5 max-w-[300px]"><span className="line-clamp-2">{r.title}</span></td><td className="p-3.5 whitespace-nowrap text-xs">{r.category}</td><td className="p-3.5 whitespace-nowrap text-xs">{r.university}</td><td className="p-3.5"><Badge className={r.fileType === "PDF" ? "bg-red-600 border-0" : "bg-blue-600 border-0"}>{r.fileType}</Badge></td><td className="p-3.5 font-black whitespace-nowrap">{formatLYD(r.priceLYD)}</td><td className="p-3.5">{r.pages}</td></tr>)}</tbody>
          </table></div></div>
      )}

      {/* Receipt preview modal */}
      {receiptView && (
        <div className="fixed inset-0 z-[60] bg-navy-900/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReceiptView(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-black text-navy-900 flex items-center gap-2"><ReceiptText className="text-gold-500" /> إيصال الطلب {receiptView.id}</h3><button onClick={() => setReceiptView(null)} aria-label="إغلاق" className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center"><X className="h-4 w-4" /></button></div>
            {receiptView.receiptDataUrl
              ? <img src={receiptView.receiptDataUrl} alt="صورة إيصال التحويل" className="w-full rounded-2xl border" />
              : <div className="rounded-2xl bg-slate-50 border p-10 text-center" dir="ltr"><ReceiptText className="h-12 w-12 mx-auto text-slate-300 mb-2" /><p className="font-bold text-sm text-slate-600">{receiptView.receiptName}</p><p className="text-xs text-slate-400 mt-1">(طلب تجريبي — الإيصالات الحقيقية من صفحة الدفع تُعرض صورتها هنا)</p></div>}
            <div className="mt-4 space-y-1.5 text-sm font-bold text-slate-600">
              <p className="flex justify-between"><span>العميل</span><span className="text-navy-900">{receiptView.customerName}</span></p>
              <p className="flex justify-between"><span>المبلغ المطلوب التحقق منه</span><span className="text-navy-900">{formatLYD(receiptView.totalLYD)}</span></p>
              <p className="flex justify-between"><span>الحالة</span>{statusBadge(receiptView.status)}</p>
            </div>
            {receiptView.status === "pending" && <div className="flex gap-2 mt-5"><Button className="flex-1" variant="whatsapp" onClick={() => { decide(receiptView.id, "approved"); setReceiptView(null); }}><Check /> اعتماد — فتح التحميل</Button><Button className="flex-1" variant="destructive" onClick={() => { decide(receiptView.id, "rejected"); setReceiptView(null); }}><X /> رفض</Button></div>}
          </div>
        </div>
      )}
    </div>
  );
}
