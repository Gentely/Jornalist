"use client";
import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Download, Lock, PackageOpen, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/data";
import { formatLYD } from "@/lib/utils";

const STATUS = {
  pending: { label: "قيد المراجعة", cls: "bg-amber-500 border-0", icon: Clock3 },
  approved: { label: "تم الاعتماد — التحميل مفتوح", cls: "bg-green-600 border-0", icon: CheckCircle2 },
  rejected: { label: "مرفوض — تواصل معنا", cls: "bg-red-600 border-0", icon: XCircle },
} as const;

function demoDownload(title: string, fileType: string) {
  const ext = fileType === "PDF" ? "txt" : "txt";
  const blob = new Blob([`Journalist — منصة البحوث العلمية\n\n${title}\n\nهذه نسخة تجريبية (Demo) للتوضيح.\nفي الإنتاج يتم تقديم الملف الحقيقي من Supabase Storage برابط موقّع بعد اعتماد الطلب.\n\nالمالك: محمد أحمد محمد — صبراتة، ليبيا\nmohamed.bahur@gmail.com`], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `Journalist-${title.slice(0, 24)}.${ext}`; a.click();
  URL.revokeObjectURL(a.href);
}

export default function MyOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  React.useEffect(() => {
    try {
      // Refresh statuses: admin decisions are stored in journalist-orders
      const all: Order[] = JSON.parse(localStorage.getItem("journalist-orders") || "[]");
      const mine: Order[] = JSON.parse(localStorage.getItem("journalist-my-orders") || "[]");
      setOrders(mine.map((m) => all.find((a) => a.id === m.id) || m));
    } catch {}
  }, []);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black text-navy-900">طلباتي والتحميلات</h1>
      <p className="text-sm text-slate-500 mt-2">يُفتح زر التحميل تلقائياً بمجرد أن يعتمد فريقنا إيصال تحويلك من لوحة الإدارة.</p>
      {orders.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white border p-14 text-center"><PackageOpen className="h-14 w-14 mx-auto text-slate-300 mb-3" /><h2 className="font-black text-xl text-navy-900">لا توجد طلبات بعد على هذا الجهاز</h2><p className="text-sm text-slate-500 mt-2 mb-5">أتمم طلباً بالتحويل المصرفي من صفحة إتمام الطلب وستجده هنا.</p><Button asChild><Link href="/shop">تصفح المكتبة</Link></Button></div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => { const S = STATUS[o.status]; const Icon = S.icon; return (
            <div key={o.id} className="rounded-3xl bg-white border shadow-card p-5">
              <div className="flex flex-wrap items-center gap-3 pb-4 border-b">
                <span className="font-black text-navy-900">{o.id}</span><span className="text-xs text-slate-400 font-bold">{o.createdAt}</span>
                <Badge className={S.cls}><Icon className="h-3 w-3 ms-1" /> {S.label}</Badge>
                <span className="ms-auto font-black text-navy-800">{formatLYD(o.totalLYD)}</span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {o.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 text-sm">
                    <span className="flex-1 font-bold text-navy-900 leading-6 line-clamp-1">{it.title} <span className="text-slate-400">({it.fileType})</span></span>
                    {o.status === "approved"
                      ? <Button size="sm" variant="whatsapp" onClick={() => demoDownload(it.title, it.fileType)}><Download /> تحميل</Button>
                      : <Button size="sm" variant="secondary" disabled><Lock /> مقفل</Button>}
                  </li>
                ))}
              </ul>
              {o.status === "pending" && <p className="text-xs font-bold text-amber-700 bg-amber-50 rounded-xl p-3 mt-4">⏳ إيصالك قيد المراجعة من الإدارة. عادة يتم الاعتماد خلال ساعات العمل (السبت–الخميس 9ص–9م).</p>}
              {o.status === "rejected" && <p className="text-xs font-bold text-red-700 bg-red-50 rounded-xl p-3 mt-4">تعذر اعتماد الإيصال (صورة غير واضحة أو مبلغ غير مطابق). تواصل معنا واتساب 00218918199601.</p>}
            </div> ); })}
        </div>
      )}
    </div>
  );
}
