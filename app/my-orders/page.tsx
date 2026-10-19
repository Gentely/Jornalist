"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Download,
  KeyRound,
  Loader2,
  Lock,
  PackageOpen,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getSupabaseAccessToken } from "@/lib/auth-client";
import type { Order } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatLYD } from "@/lib/utils";

const STATUS = {
  pending: { label: "قيد المراجعة", cls: "bg-amber-500 border-0", icon: Clock3 },
  approved: { label: "تم الاعتماد — التحميل مفتوح", cls: "bg-green-600 border-0", icon: CheckCircle2 },
  rejected: { label: "مرفوض — تواصل معنا", cls: "bg-red-600 border-0", icon: XCircle },
} as const;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ORDER_ACCESS_TOKEN_HEADER = "x-order-access-token";

function orderLabel(id: string): string {
  return UUID_PATTERN.test(id) ? `JRN-${id.slice(0, 8).toUpperCase()}` : id;
}

function isProductionOrder(order: Order): boolean {
  return order.backend === "supabase" || UUID_PATTERN.test(order.id);
}

function formatOrderDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("ar-LY");
}

async function readApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "تعذر تنفيذ الطلب من الخادم.";
  } catch {
    return "تعذر تنفيذ الطلب من الخادم.";
  }
}

function demoDownload(title: string) {
  const blob = new Blob(
    [
      `Journalist — منصة البحوث العلمية\n\n${title}\n\nهذه نسخة تجريبية (Demo) للتوضيح.\nفي الإنتاج يتم تقديم الملف الحقيقي من Supabase Storage برابط موقّع بعد اعتماد الطلب.\n\nالمالك: محمد أحمد محمد — صبراتة، ليبيا\nmohamed.bahur@gmail.com`,
    ],
    { type: "text/plain;charset=utf-8" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Journalist-${title.slice(0, 24)}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function MyOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [downloadKey, setDownloadKey] = React.useState("");
  const [lookupOrderId, setLookupOrderId] = React.useState("");
  const [lookupToken, setLookupToken] = React.useState("");
  const [lookingUp, setLookingUp] = React.useState(false);

  const persistOrders = React.useCallback((next: Order[]) => {
    setOrders(next);
    try {
      localStorage.setItem("journalist-my-orders", JSON.stringify(next));
    } catch {}
  }, []);

  const fetchProductionOrder = React.useCallback(
    async (order: Order, accountToken: string | null): Promise<Order> => {
      const headers: Record<string, string> = {};
      if (accountToken) headers.Authorization = `Bearer ${accountToken}`;
      if (order.accessToken) headers[ORDER_ACCESS_TOKEN_HEADER] = order.accessToken;

      const response = await fetch(`/api/orders/${encodeURIComponent(order.id)}`, {
        headers,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await readApiError(response));

      const body = (await response.json()) as { order?: Order };
      if (!body.order) throw new Error("وصلت استجابة غير مكتملة من الخادم.");

      return {
        ...body.order,
        backend: "supabase",
        // The API never returns the plain token again; retain the copy saved
        // by checkout on this device.
        accessToken: order.accessToken,
      };
    },
    [],
  );

  const loadOrders = React.useCallback(
    async (manual = false) => {
      if (manual) setRefreshing(true);
      else setLoading(true);
      if (manual) setMessage("");

      let localOrders: Order[] = [];
      try {
        const all: Order[] = JSON.parse(localStorage.getItem("journalist-orders") || "[]");
        const mine: Order[] = JSON.parse(localStorage.getItem("journalist-my-orders") || "[]");
        localOrders = mine.map((m) =>
          isProductionOrder(m) ? m : all.find((a) => a.id === m.id) || m,
        );
      } catch {}

      setOrders(localOrders);

      if (!isSupabaseConfigured) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        const accountToken = await getSupabaseAccessToken();
        const remoteById = new Map<string, Order>();
        const warnings: string[] = [];

        if (accountToken) {
          const response = await fetch("/api/orders/mine", {
            headers: { Authorization: `Bearer ${accountToken}` },
            cache: "no-store",
          });
          if (response.ok) {
            const body = (await response.json()) as { orders?: Order[] };
            for (const order of body.orders || []) {
              const local = localOrders.find((item) => item.id === order.id);
              remoteById.set(order.id, {
                ...order,
                backend: "supabase",
                accessToken: local?.accessToken,
              });
            }
          } else {
            warnings.push(await readApiError(response));
          }
        }

        const productionLocal = localOrders.filter(
          (order) => isProductionOrder(order) && !remoteById.has(order.id),
        );
        const fetched = await Promise.allSettled(
          productionLocal.map((order) => fetchProductionOrder(order, accountToken)),
        );
        fetched.forEach((result, index) => {
          if (result.status === "fulfilled") {
            remoteById.set(result.value.id, result.value);
          } else {
            warnings.push(
              result.reason instanceof Error
                ? result.reason.message
                : `تعذر تحديث حالة الطلب ${orderLabel(productionLocal[index].id)}`,
            );
          }
        });

        const merged = [
          ...remoteById.values(),
          ...localOrders.filter((order) => !remoteById.has(order.id)),
        ].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        // Do not persist account-only orders fetched from the server on a
        // potentially shared browser. Orders already saved on this device and
        // guest orders with a local tracking token remain available offline.
        const localIds = new Set(localOrders.map((order) => order.id));
        const persisted = merged.filter((order) => localIds.has(order.id) || order.accessToken);
        setOrders(merged);
        try {
          localStorage.setItem("journalist-my-orders", JSON.stringify(persisted));
        } catch {}
        if (warnings.length > 0) {
          setMessage(warnings[0]);
        } else if (manual) {
          setMessage("تم تحديث حالات الطلبات.");
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "تعذر تحديث الطلبات من Supabase.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchProductionOrder, persistOrders],
  );

  React.useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const download = async (order: Order, slug: string, title: string) => {
    if (!isProductionOrder(order)) {
      demoDownload(title);
      return;
    }

    const key = `${order.id}:${slug}`;
    setDownloadKey(key);
    setMessage("");

    try {
      const accountToken = await getSupabaseAccessToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accountToken) headers.Authorization = `Bearer ${accountToken}`;
      if (order.accessToken) headers[ORDER_ACCESS_TOKEN_HEADER] = order.accessToken;

      const response = await fetch(`/api/orders/${encodeURIComponent(order.id)}/download`, {
        method: "POST",
        headers,
        body: JSON.stringify({ slug }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await readApiError(response));

      const body = (await response.json()) as { url?: string; expiresInSeconds?: number };
      if (!body.url) throw new Error("لم يصل رابط التحميل من الخادم.");

      const a = document.createElement("a");
      a.href = body.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMessage(`بدأ تحميل «${title}». الرابط الآمن صالح لمدة ${Math.ceil((body.expiresInSeconds || 300) / 60)} دقائق.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر إنشاء رابط التحميل.");
    } finally {
      setDownloadKey("");
    }
  };

  const lookup = async (event: React.FormEvent) => {
    event.preventDefault();
    const orderId = lookupOrderId.trim();
    const token = lookupToken.trim();
    if (!UUID_PATTERN.test(orderId) || token.length < 20) {
      setMessage("أدخل رقم الطلب الكامل ورمز المتابعة الصحيحين من شاشة تأكيد الطلب.");
      return;
    }

    setLookingUp(true);
    setMessage("");
    try {
      const accountToken = await getSupabaseAccessToken();
      const reference: Order = {
        id: orderId,
        customerName: "",
        phone: "",
        email: "",
        items: [],
        totalLYD: 0,
        method: "bank",
        status: "pending",
        backend: "supabase",
        accessToken: token,
        createdAt: new Date().toISOString(),
      };
      const order = await fetchProductionOrder(reference, accountToken);
      persistOrders([order, ...orders.filter((item) => item.id !== order.id)]);
      setLookupOrderId("");
      setLookupToken("");
      setMessage("تمت إضافة الطلب إلى هذا الجهاز.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر العثور على الطلب.");
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-[240px]">
          <h1 className="text-3xl font-black text-navy-900">طلباتي والتحميلات</h1>
          <p className="text-sm leading-7 text-slate-500 mt-2">
            يُفتح زر التحميل بمجرد اعتماد الإدارة لإيصالك، ويُنشأ عند الضغط رابط
            آمن مؤقت من التخزين الخاص بدلاً من رابط عام دائم.
          </p>
        </div>
        {isSupabaseConfigured && (
          <Button type="button" variant="outline" onClick={() => void loadOrders(true)} disabled={refreshing || loading}>
            {refreshing ? <Loader2 className="animate-spin" /> : <RefreshCw />} تحديث الحالة
          </Button>
        )}
      </div>

      {message && (
        <p role="status" className="mt-5 rounded-xl bg-navy-50 border border-navy-100 text-navy-800 text-sm font-bold p-3.5">
          {message}
        </p>
      )}

      {isSupabaseConfigured && (
        <form onSubmit={lookup} className="mt-6 rounded-3xl bg-white border shadow-card p-5">
          <h2 className="font-black text-navy-900 flex items-center gap-2">
            <KeyRound className="text-gold-500" /> استرجاع طلب من جهاز آخر
          </h2>
          <p className="text-xs leading-6 font-bold text-slate-500 mt-1">
            للضيف: أدخل رقم الطلب الكامل ورمز المتابعة اللذين ظهرا بعد إتمام الطلب.
            إذا اشتريت بحسابك، سجّل الدخول وستظهر طلبات الحساب تلقائياً.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <div>
              <Label htmlFor="lookup-order-id">رقم الطلب الكامل</Label>
              <Input id="lookup-order-id" dir="ltr" className="text-left" value={lookupOrderId} onChange={(e) => setLookupOrderId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            </div>
            <div>
              <Label htmlFor="lookup-token">رمز متابعة الطلب</Label>
              <Input id="lookup-token" dir="ltr" className="text-left" type="password" value={lookupToken} onChange={(e) => setLookupToken(e.target.value)} placeholder="Order tracking code" />
            </div>
          </div>
          <Button type="submit" className="mt-4" disabled={lookingUp}>
            {lookingUp ? <Loader2 className="animate-spin" /> : <KeyRound />} إضافة الطلب
          </Button>
        </form>
      )}

      {loading ? (
        <div className="mt-10 rounded-3xl bg-white border p-14 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-navy-700" />
          <p className="font-bold text-slate-500 mt-3">جاري تحميل طلباتك...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white border p-14 text-center">
          <PackageOpen className="h-14 w-14 mx-auto text-slate-300 mb-3" />
          <h2 className="font-black text-xl text-navy-900">لا توجد طلبات بعد على هذا الجهاز</h2>
          <p className="text-sm text-slate-500 mt-2 mb-5">
            أتمم طلباً بالتحويل المصرفي من صفحة إتمام الطلب وستجده هنا، أو سجّل الدخول بحساب الشراء.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild><Link href="/shop">تصفح المكتبة</Link></Button>
            {isSupabaseConfigured && <Button asChild variant="outline"><Link href="/login?next=%2Fmy-orders">تسجيل الدخول</Link></Button>}
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const status = STATUS[order.status];
            const StatusIcon = status.icon;
            return (
              <article key={order.id} className="rounded-3xl bg-white border shadow-card p-5">
                <div className="flex flex-wrap items-center gap-3 pb-4 border-b">
                  <span className="font-black text-navy-900">{orderLabel(order.id)}</span>
                  <span className="text-xs text-slate-400 font-bold">{formatOrderDate(order.createdAt)}</span>
                  <Badge className={status.cls}><StatusIcon className="h-3 w-3 ms-1" /> {status.label}</Badge>
                  <span className="ms-auto font-black text-navy-800">{formatLYD(order.totalLYD)}</span>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {order.items.map((item) => {
                    const key = `${order.id}:${item.id}`;
                    return (
                      <li key={item.id} className="flex items-center gap-3 text-sm">
                        <span className="flex-1 font-bold text-navy-900 leading-6 line-clamp-2">
                          {item.title} <span className="text-slate-400">({item.fileType})</span>
                        </span>
                        {order.status === "approved" ? (
                          <Button
                            size="sm"
                            variant="whatsapp"
                            disabled={downloadKey === key}
                            onClick={() => void download(order, item.id, item.title)}
                          >
                            {downloadKey === key ? <Loader2 className="animate-spin" /> : <Download />}
                            {downloadKey === key ? "جاري التهيئة..." : "تحميل"}
                          </Button>
                        ) : (
                          <Button size="sm" variant="secondary" disabled><Lock /> مقفل</Button>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {order.status === "pending" && (
                  <p className="text-xs font-bold text-amber-700 bg-amber-50 rounded-xl p-3 mt-4">
                    ⏳ إيصالك قيد المراجعة من الإدارة. عادة يتم الاعتماد خلال ساعات العمل (السبت–الخميس 9ص–9م).
                  </p>
                )}
                {order.status === "rejected" && (
                  <p className="text-xs font-bold text-red-700 bg-red-50 rounded-xl p-3 mt-4">
                    تعذر اعتماد الإيصال (صورة غير واضحة أو مبلغ غير مطابق). تواصل معنا عبر واتساب.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
