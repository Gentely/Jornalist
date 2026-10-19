"use client";
import * as React from "react";
import Link from "next/link";
import { Banknote, BookOpenCheck, Check, Clock3, Download, Eye, FileUp, LayoutDashboard, Loader2, LogIn, LogOut, Plus, ReceiptText, RefreshCw, ShieldAlert, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdminDownloadFiles from "@/components/AdminDownloadFiles";
import BankAccountDialog from "@/components/BankAccountDialog";
import { getSupabaseAccessToken, getSupabaseSessionEmail } from "@/lib/auth-client";
import { CATEGORIES, MOCK_ORDERS, RESEARCHES, UNIVERSITIES, type Order, type Research } from "@/lib/data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { formatLYD } from "@/lib/utils";

type BackendState = "demo" | "checking" | "ready" | "signed-out" | "forbidden" | "unconfigured";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const adminOrderLabel = (id: string) => (UUID_PATTERN.test(id) ? `JRN-${id.slice(0, 8).toUpperCase()}` : id);
const formatAdminDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("ar-LY");
};

async function readAdminApiError(response: Response): Promise<{ message: string; code: string }> {
  try {
    const body = (await response.json()) as { error?: unknown; code?: unknown };
    return {
      message: typeof body.error === "string" ? body.error : "تعذر الاتصال بواجهة إدارة Supabase.",
      code: typeof body.code === "string" ? body.code : "",
    };
  } catch {
    return { message: "تعذر الاتصال بواجهة إدارة Supabase.", code: "" };
  }
}

const sel = "h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-navy-600/30";
const KEY_ORDERS = "journalist-orders", KEY_RESEARCH = "journalist-extra-research";

export default function AdminPage() {
  const [tab, setTab] = React.useState<"dash" | "orders" | "files" | "add" | "library">("dash");
  const [orders, setOrders] = React.useState<Order[]>(MOCK_ORDERS);
  const [extra, setExtra] = React.useState<Research[]>([]);
  const [receiptView, setReceiptView] = React.useState<Order | null>(null);
  const [toast, setToast] = React.useState("");
  const [backendState, setBackendState] = React.useState<BackendState>(isSupabaseConfigured ? "checking" : "demo");
  const [backendMessage, setBackendMessage] = React.useState("");
  const [adminEmail, setAdminEmail] = React.useState("");
  const [busyOrderId, setBusyOrderId] = React.useState("");
  const [receiptBusyId, setReceiptBusyId] = React.useState("");
  // Add-research form
  const [f, setF] = React.useState({ title: "", category: CATEGORIES[0], university: UNIVERSITIES[2], price: "120", pages: "100", year: "2025", level: "ماجستير", fileType: "PDF", abstract: "" });
  const [coverName, setCoverName] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  const loadProductionOrders = React.useCallback(async () => {
    if (!isSupabaseConfigured) {
      setBackendState("demo");
      return;
    }

    setBackendState("checking");
    setBackendMessage("");

    try {
      const [token, sessionEmail] = await Promise.all([
        getSupabaseAccessToken(),
        getSupabaseSessionEmail(),
      ]);
      setAdminEmail(sessionEmail || "");

      if (!token) {
        setBackendState("signed-out");
        setBackendMessage("سجّل الدخول بحساب المدير لعرض طلبات وملفات Supabase الحقيقية.");
        return;
      }

      let response: Response | null = null;
      let lastNetworkError: unknown = null;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          response = await fetch("/api/admin/orders", {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          });
          break;
        } catch (networkError) {
          lastNetworkError = networkError;
          if (attempt < 2) {
            await new Promise((resolve) => window.setTimeout(resolve, 900 * (attempt + 1)));
          }
        }
      }
      if (!response) {
        throw lastNetworkError instanceof Error
          ? lastNetworkError
          : new Error("تعذر الاتصال بخادم الإدارة.");
      }

      if (!response.ok) {
        const apiError = await readAdminApiError(response);
        const status = response.status;
        setBackendMessage(apiError.message);
        setBackendState((prev) => {
          // Keep a working panel on screen if a background refresh hits a
          // transient server error; only deterministic states replace it.
          if (prev === "ready" && status >= 500 && apiError.code !== "BACKEND_NOT_CONFIGURED") return prev;
          return status === 503 || apiError.code === "BACKEND_NOT_CONFIGURED"
            ? "unconfigured"
            : status === 401
              ? "signed-out"
              : "forbidden";
        });
        return;
      }

      const body = (await response.json()) as { adminEmail?: string | null; orders?: Order[] };
      setAdminEmail(body.adminEmail || sessionEmail || "");
      setOrders(body.orders || []);
      setBackendState("ready");
    } catch (error) {
      setBackendState("unconfigured");
      setBackendMessage(error instanceof Error ? error.message : "تعذر تحميل طلبات Supabase.");
    }
  }, []);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY_ORDERS);
      if (saved) { const real: Order[] = JSON.parse(saved); setOrders([...real, ...MOCK_ORDERS.filter((m) => !real.some((r) => r.id === m.id))]); }
      const ex = localStorage.getItem(KEY_RESEARCH); if (ex) setExtra(JSON.parse(ex));
    } catch {}

    void loadProductionOrders();
  }, [loadProductionOrders]);

  const persist = (next: Order[]) => {
    setOrders(next);
    try { localStorage.setItem(KEY_ORDERS, JSON.stringify(next.filter((o) => !MOCK_ORDERS.some((m) => m.id === o.id) || true))); } catch {}
  };

  const decide = async (id: string, status: "approved" | "rejected") => {
    if (backendState === "ready") {
      setBusyOrderId(id);
      try {
        const token = await getSupabaseAccessToken();
        if (!token) throw new Error("انتهت جلسة المدير. سجّل الدخول من جديد.");

        const response = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
          cache: "no-store",
        });
        if (!response.ok) throw new Error((await readAdminApiError(response)).message);

        const body = (await response.json()) as { order?: Order };
        if (body.order) {
          setOrders((current) => current.map((order) => (order.id === id ? body.order as Order : order)));
        }
        setToast(
          status === "approved"
            ? `✅ تم اعتماد ${adminOrderLabel(id)} في Supabase — فُتح التحميل الآمن للعميل في صفحة «طلباتي»`
            : `تم رفض الطلب ${adminOrderLabel(id)} في Supabase`,
        );
      } catch (error) {
        setToast(error instanceof Error ? error.message : "تعذر تحديث حالة الطلب.");
      } finally {
        setBusyOrderId("");
        setTimeout(() => setToast(""), 4000);
      }
      return;
    }

    persist(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    setToast(status === "approved" ? `✅ تم اعتماد ${id} — فُتح التحميل للعميل في صفحة «طلباتي»` : `تم رفض الطلب ${id}`);
    setTimeout(() => setToast(""), 3500);
  };

  const openReceipt = async (order: Order) => {
    if (backendState !== "ready") {
      setReceiptView(order);
      return;
    }

    setReceiptBusyId(order.id);
    try {
      const token = await getSupabaseAccessToken();
      if (!token) throw new Error("انتهت جلسة المدير. سجّل الدخول من جديد.");

      const response = await fetch(`/api/admin/orders/${encodeURIComponent(order.id)}/receipt`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error((await readAdminApiError(response)).message);

      const body = (await response.json()) as { url?: string };
      if (!body.url) throw new Error("لم يصل رابط الإيصال الآمن من الخادم.");
      window.open(body.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "تعذر فتح الإيصال.");
      setTimeout(() => setToast(""), 4000);
    } finally {
      setReceiptBusyId("");
    }
  };

  const signOutAdmin = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAdminEmail("");
    setBackendState(isSupabaseConfigured ? "signed-out" : "demo");
    setBackendMessage("تم تسجيل الخروج. سجّل الدخول بحساب مدير للمتابعة.");
  };

  const revenue = orders.filter((o) => o.status === "approved").reduce((s, o) => s + o.totalLYD, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const allResearch = backendState === "ready" ? RESEARCHES : [...extra, ...RESEARCHES];

  const addResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (backendState === "ready") {
      setToast("إضافة عنوان جديد إلى كتالوج Supabase ليست مفعلة من هذه اللوحة بعد. تبويب «ملفات التحميل» جاهز للبحوث السبعة الحالية؛ لا تحفظ هذا النموذج كطلب إنتاجي.");
      setTimeout(() => setToast(""), 5000);
      return;
    }
    const item: Research = {
      id: `res-${Date.now()}`,
      title: f.title,
      summary: f.abstract ? f.abstract.slice(0, 220) : "نبذة مختصرة ستضيفها الإدارة قبل نشر البحث في القائمة.",
      category: f.category,
      group: f.category.includes("TESOL") ? "TESOL — اللغة الإنجليزية" : f.category.startsWith("سرطان") ? "أمراض السرطان" : "بحوث طبية عامة",
      university: f.university,
      fileType: f.fileType as "PDF" | "WORD",
      priceLYD: Number(f.price) || 100,
      pages: Number(f.pages) || 80,
      words: 0,
      year: Number(f.year) || 2026,
      level: f.level,
      rating: 0,
      downloads: 0,
      language: "العربية",
      abstract: f.abstract || "بحث مضاف حديثاً من لوحة الإدارة.",
      cover: "/covers/01-amr.jpg",
      gradient: "from-[#0F2A4A] to-[#16406E]",
      chapters: ["الفصل الأول: الإطار العام للدراسة", "الفصل الثاني: الإطار النظري", "الفصل الثالث: منهجية الدراسة", "الفصل الرابع: النتائج", "الفصل الخامس: التوصيات"],
    };
    const next = [item, ...extra]; setExtra(next);
    try { localStorage.setItem(KEY_RESEARCH, JSON.stringify(next)); } catch {}
    setToast(`✅ أُضيف البحث بنجاح${fileName ? ` (الملف: ${fileName})` : ""}${coverName ? ` — الغلاف: ${coverName}` : ""}. في الإنتاج يُرفع إلى Supabase Storage.`);
    setF({ ...f, title: "", abstract: "" }); setCoverName(""); setFileName(""); setTab("library");
    setTimeout(() => setToast(""), 4000);
  };

  const statusBadge = (s: Order["status"]) => s === "pending" ? <Badge className="bg-amber-500 border-0"><Clock3 className="h-3 w-3 ms-1" />قيد المراجعة</Badge> : s === "approved" ? <Badge className="bg-green-600 border-0"><Check className="h-3 w-3 ms-1" />معتمد</Badge> : <Badge className="bg-red-600 border-0"><X className="h-3 w-3 ms-1" />مرفوض</Badge>;

  if (isSupabaseConfigured && backendState !== "ready") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl bg-white border shadow-card p-8 text-center">
          <span className="h-16 w-16 rounded-3xl bg-navy-800 text-gold-400 flex items-center justify-center mx-auto mb-5">
            {backendState === "checking" ? <Loader2 className="h-8 w-8 animate-spin" /> : <ShieldAlert className="h-8 w-8" />}
          </span>
          <h1 className="text-2xl font-black text-navy-900">لوحة إدارة Supabase محمية</h1>
          <p className="text-sm leading-7 font-bold text-slate-500 mt-3">
            {backendState === "checking"
              ? "جاري التحقق من جلسة المدير وتحميل الطلبات الحقيقية..."
              : backendMessage || "لا يمكن عرض بيانات الإنتاج في الوقت الحالي."}
          </p>
          {adminEmail && (
            <p dir="ltr" className="text-left text-sm font-black text-navy-900 bg-navy-50 rounded-xl px-4 py-3 mt-4 break-all">
              {adminEmail}
            </p>
          )}
          {backendState === "forbidden" && (
            <p className="text-xs leading-6 font-bold text-slate-500 mt-4">
              افتح Supabase ثم <strong>Table Editor → profiles</strong> وغيّر دور هذا الحساب إلى <span dir="ltr">admin</span>، ثم أعد المحاولة.
            </p>
          )}
          {backendState === "unconfigured" && (
            <p className="text-xs leading-6 font-bold text-slate-500 mt-4">
              تحقق من وجود <span dir="ltr">SUPABASE_SECRET_KEY</span> في متغيرات Vercel الخاصة بالخادم،
              ومن تطبيق آخر migration، ثم أعد نشر الموقع.
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {backendState === "signed-out" && (
              <Button asChild><Link href="/login?next=%2Fadmin"><LogIn /> تسجيل دخول المدير</Link></Button>
            )}
            {backendState !== "checking" && (
              <Button type="button" variant="outline" onClick={() => void loadProductionOrders()}><RefreshCw /> إعادة المحاولة</Button>
            )}
            {adminEmail && backendState !== "checking" && (
              <Button type="button" variant="secondary" onClick={() => void signOutAdmin()}><LogOut /> تسجيل الخروج</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-3xl font-black text-navy-900 flex items-center gap-3"><LayoutDashboard className="text-gold-500" /> لوحة الإدارة</h1>
        {backendState === "ready" ? (
          <Badge className="bg-green-600 border-0">Supabase إنتاجي{adminEmail ? ` — ${adminEmail}` : ""}</Badge>
        ) : (
          <Badge variant="secondary">وضع تجريبي — اربط Supabase للإنتاج</Badge>
        )}
        <span className="ms-auto flex items-center gap-2">
          {backendState === "ready" && (
            <>
              <Button type="button" size="sm" variant="outline" onClick={() => void loadProductionOrders()}><RefreshCw /> تحديث</Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => void signOutAdmin()}><LogOut /> خروج</Button>
            </>
          )}
          <BankAccountDialog size="sm" />
        </span>
      </div>
      <p className="text-sm text-slate-500">الإدارة: محمد أحمد محمد • مصرف الجمهورية - صبراتة • mohamed.bahur@gmail.com</p>
      {toast && <p className="mt-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-bold p-3.5">{toast}</p>}

      <div className="flex flex-wrap gap-2 mt-6">
        {([["dash", "لوحة المؤشرات"], ["orders", `الطلبات والإيصالات (${pendingCount} بالانتظار)`], ["files", "ملفات التحميل (7)"], ["add", "إضافة بحث"], ["library", `المكتبة (${allResearch.length})`]] as const).map(([k, l]) => (
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
                {orders.length === 0 && (
                  <tr><td colSpan={8} className="p-10 text-center font-bold text-slate-400">لا توجد طلبات حقيقية بعد في Supabase.</td></tr>
                )}
                {orders.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-slate-50/60">
                    <td className="p-3.5 font-black whitespace-nowrap">{adminOrderLabel(o.id)}<span className="block text-[11px] text-slate-400 font-bold">{formatAdminDate(o.createdAt)}</span></td>
                    <td className="p-3.5 whitespace-nowrap"><span className="font-bold">{o.customerName}</span><span className="block text-[11px] text-slate-400" dir="ltr">{o.phone}</span><span className="block text-[11px] text-slate-400" dir="ltr">{o.email}</span></td>
                    <td className="p-3.5 max-w-[240px]"><span className="line-clamp-2 font-bold text-xs leading-5">{o.items.map((i) => i.title).join("، ")}</span><span className="text-[11px] text-slate-400">{o.items.map((i) => i.fileType).join(" / ")}</span></td>
                    <td className="p-3.5 font-black whitespace-nowrap">{formatLYD(o.totalLYD)}</td>
                    <td className="p-3.5 whitespace-nowrap">{o.method === "bank" ? "تحويل مصرفي" : "واتساب"}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      {o.receiptName || o.hasReceipt ? <button onClick={() => void openReceipt(o)} disabled={receiptBusyId === o.id} className="inline-flex items-center gap-1.5 text-navy-700 font-black text-xs bg-navy-50 px-2.5 py-1.5 rounded-lg hover:bg-navy-100 disabled:opacity-50">{receiptBusyId === o.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />} عرض الإيصال</button> : <span className="text-xs text-slate-400 font-bold">لا يوجد</span>}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">{statusBadge(o.status)}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      {o.status === "pending" ? (
                        <span className="flex gap-1.5">
                          <Button size="sm" variant="whatsapp" disabled={busyOrderId === o.id} onClick={() => void decide(o.id, "approved")}>{busyOrderId === o.id ? <Loader2 className="animate-spin" /> : <Check />} اعتماد</Button>
                          <Button size="sm" variant="destructive" disabled={busyOrderId === o.id} onClick={() => void decide(o.id, "rejected")}><X /> رفض</Button>
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

      {tab === "files" && <AdminDownloadFiles enabled={backendState === "ready"} />}

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
          <Button type="submit" size="lg" className="mt-5" disabled={backendState === "ready"}><Plus /> نشر البحث في المكتبة</Button>
          <p className="text-[11px] text-slate-400 font-bold mt-3">
            {backendState === "ready"
              ? "هذا النموذج تجريبي فقط في الوقت الحالي ولا يكتب إلى Supabase. لإدارة ملفات الدفعة الحالية استخدم تبويب «ملفات التحميل (7)»."
              : "في الإنتاج: يُرفع الغلاف إلى bucket «covers» والملف إلى bucket «research-files» في Supabase Storage (انظر supabase/config.toml وملفات migrations)."}
          </p>
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
