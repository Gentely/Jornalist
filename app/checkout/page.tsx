"use client";
import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, ImagePlus, Landmark, ShoppingBag, Trash2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BankAccountDialog from "@/components/BankAccountDialog";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { useCart } from "@/lib/cart";
import { formatLYD, whatsappLink } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import type { Order } from "@/lib/data";

export default function CheckoutPage() {
  const { items, total, remove, clear } = useCart();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [receipt, setReceipt] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string>("");
  const [error, setError] = React.useState("");
  const [placed, setPlaced] = React.useState<Order | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const onReceipt = (f: File | null) => {
    setReceipt(f); setError("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const waMessage = React.useMemo(() => {
    const lines = items.map((r, i) => `${i + 1}- ${r.title} (${r.fileType}) — ${r.priceLYD} د.ل`).join("\n");
    return `مرحباً منصة Journalist،\nأريد إتمام طلب عبر واتساب:\n\n📚 البحوث:\n${lines || "—"}\n\n💰 الإجمالي: ${total} د.ل (LYD)\n👤 الاسم: ${name || "—"}\n📱 الهاتف: ${phone || "—"}\n📧 البريد: ${email || "—"}${note ? `\n📝 ملاحظة: ${note}` : ""}`;
  }, [items, total, name, phone, email, note]);

  // ---- OPTION A · Bank transfer: receipt REQUIRED -> order = قيد المراجعة ----
  const submitBankOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return setError("سلتك فارغة — أضف بحثاً أولاً من المكتبة.");
    if (!name.trim() || !phone.trim() || !email.trim()) return setError("فضلاً أكمل الاسم ورقم الهاتف والبريد الإلكتروني.");
    if (!receipt) return setError("⚠️ رفع صورة إيصال التحويل إلزامي لإتمام الطلب بالتحويل المصرفي. حوّل أولاً عبر زر «حساب الدفع» ثم ارفع الإيصال.");
    setSubmitting(true);
    const receiptDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => resolve("");
      reader.readAsDataURL(receipt);
    });
    const order: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name.trim(), phone: phone.trim(), email: email.trim(),
      items: items.map((r) => ({ id: r.id, title: r.title, priceLYD: r.priceLYD, fileType: r.fileType })),
      totalLYD: total, method: "bank", status: "pending", // قيد المراجعة
      receiptName: receipt.name, receiptDataUrl: receiptDataUrl.length < 1_800_000 ? receiptDataUrl : "",
      createdAt: new Date().toISOString().slice(0, 10), note,
    };
    try {
      const old = JSON.parse(localStorage.getItem("journalist-orders") || "[]");
      localStorage.setItem("journalist-orders", JSON.stringify([order, ...old]));
      localStorage.setItem("journalist-my-orders", JSON.stringify([order, ...JSON.parse(localStorage.getItem("journalist-my-orders") || "[]")]));
    } catch {}
    setPlaced(order); clear(); setSubmitting(false);
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="h-20 w-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-5"><Clock3 className="h-10 w-10" /></span>
        <Badge className="bg-amber-500 border-0 mb-3">حالة الطلب: قيد المراجعة</Badge>
        <h1 className="text-3xl font-black text-navy-900">تم استلام طلبك بنجاح ✓</h1>
        <p className="text-slate-600 leading-8 mt-3">رقم الطلب: <strong className="text-navy-900">{placed.id}</strong> • الإجمالي: <strong>{formatLYD(placed.totalLYD)}</strong><br />
        إيصالك (<span dir="ltr">{placed.receiptName}</span>) قيد المراجعة الآن. بعد اعتماد الإدارة سيُفتح لك التحميل في صفحة «طلباتي» وسنعلمك عبر واتساب/البريد.</p>
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <Button asChild><Link href="/my-orders">متابعة حالة طلبي</Link></Button>
          <Button asChild variant="whatsapp"><a href={whatsappLink(`مرحباً، أرسلت الطلب ${placed.id} بالتحويل المصرفي ورفعت الإيصال. بانتظار الاعتماد.`)} target="_blank" rel="noreferrer"><WhatsAppIcon /> تأكيد عبر واتساب</a></Button>
          <Button asChild variant="outline"><Link href="/shop">متابعة التصفح</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-black text-navy-900">إتمام الطلب</h1>
      <p className="text-slate-500 text-sm mt-2">ادفع بالتحويل المصرفي (مصرف الجمهورية) أو أتمم الطلب عبر واتساب — الأسعار بالدينار الليبي LYD</p>

      <div className="grid lg:grid-cols-[1fr_420px] gap-6 mt-8 items-start">
        {/* -------- Form -------- */}
        <form onSubmit={submitBankOrder} className="space-y-6">
          <section className="rounded-3xl bg-white border shadow-card p-6">
            <h2 className="font-black text-navy-900 text-lg mb-4">1) بياناتك</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="name">الاسم الكامل *</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: أحمد سالم" required /></div>
              <div><Label htmlFor="phone">رقم الهاتف / واتساب *</Label><Input id="phone" dir="ltr" className="text-left" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" required /></div>
              <div className="sm:col-span-2"><Label htmlFor="email">البريد الإلكتروني (لاستلام البحث) *</Label><Input id="email" type="email" dir="ltr" className="text-left" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
              <div className="sm:col-span-2"><Label htmlFor="note">ملاحظات (اختياري)</Label><textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600/30" placeholder="أي تفاصيل إضافية عن طلبك..." /></div>
            </div>
          </section>

          {/* -------- OPTION A · Bank Transfer -------- */}
          <section className="rounded-3xl bg-white border-2 border-navy-800/15 shadow-card p-6">
            <h2 className="font-black text-navy-900 text-lg flex items-center gap-2"><Landmark className="text-navy-700" /> 2) خيار (أ): التحويل المصرفي</h2>
            <ol className="text-sm leading-8 text-slate-600 mt-3 list-decimal pr-5 space-y-1">
              <li>اضغط زر <strong className="text-navy-900">«حساب الدفع»</strong> لعرض بيانات الحساب وانسخ رقم الحساب أو الايبان.</li>
              <li>حوّل مبلغ الإجمالي <strong className="text-navy-900">({formatLYD(total)})</strong> من تطبيق مصرفك.</li>
              <li>ارفع صورة إيصال التحويل بالأسفل، ثم اضغط «تأكيد الطلب» — سيصبح طلبك <Badge className="bg-amber-500 border-0 mx-1">قيد المراجعة</Badge> حتى الاعتماد.</li>
            </ol>

            {/* Required trigger — bank numbers appear ONLY inside its modal */}
            <div className="mt-5">
              <BankAccountDialog size="lg" className="w-full sm:w-auto" />
              <p className="text-[11px] text-slate-400 font-bold mt-2">🔒 لأسباب أمنية، بيانات الحساب لا تظهر إلا داخل هذه النافذة.</p>
            </div>

            {/* Required receipt upload — directly below the button */}
            <div className="mt-6">
              <Label htmlFor="receipt">ارفع صورة إيصال التحويل <span className="text-red-600">* (إلزامي)</span></Label>
              {!receipt ? (
                <label htmlFor="receipt" className="mt-1 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-navy-600 hover:bg-navy-50 transition cursor-pointer p-8 text-center">
                  <UploadCloud className="h-10 w-10 text-slate-400" />
                  <span className="font-black text-navy-900 text-sm">اضغط لرفع صورة الإيصال</span>
                  <span className="text-xs text-slate-400">JPG / PNG / PDF — تأكد من وضوح المبلغ ورقم العملية</span>
                </label>
              ) : (
                <div className="mt-1 rounded-2xl border-2 border-green-200 bg-green-50 p-4 flex items-center gap-4">
                  {preview && receipt.type.startsWith("image") ? <img src={preview} alt="معاينة الإيصال" className="h-16 w-16 object-cover rounded-xl border" /> : <span className="h-16 w-16 rounded-xl bg-white border flex items-center justify-center"><ImagePlus className="text-green-600" /></span>}
                  <div className="min-w-0 flex-1"><p className="font-black text-sm text-green-800 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> تم إرفاق الإيصال</p><p dir="ltr" className="text-xs text-slate-500 text-left truncate mt-1">{receipt.name} • {(receipt.size / 1024).toFixed(0)} KB</p></div>
                  <button type="button" onClick={() => onReceipt(null)} aria-label="إزالة الإيصال" className="h-9 w-9 rounded-lg bg-white border flex items-center justify-center text-red-600 shrink-0"><X className="h-4 w-4" /></button>
                </div>
              )}
              <input id="receipt" type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => onReceipt(e.target.files?.[0] || null)} />
            </div>

            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold p-3.5">{error}</p>}
            <Button type="submit" size="lg" disabled={submitting || items.length === 0} className="w-full mt-5">
              {submitting ? "جاري إرسال الطلب..." : <>تأكيد الطلب بالتحويل المصرفي — {formatLYD(total)}</>}
            </Button>
          </section>

          {/* -------- OPTION B · WhatsApp (main green CTA) -------- */}
          <section className="rounded-3xl border-2 border-green-200 bg-green-50/60 p-6 text-center">
            <h2 className="font-black text-navy-900">خيار (ب): أو أتمم طلبك مباشرة عبر واتساب</h2>
            <p className="text-sm text-slate-600 mt-1.5 mb-5">سنستلم تفاصيل طلبك جاهزة ونكمل معك الدفع والتسليم في المحادثة.</p>
            <Button asChild variant="whatsapp" size="lg" className="w-full text-base h-14">
              <a href={whatsappLink(waMessage)} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-6 w-6" /> إتمام الطلب عبر واتساب {SITE.whatsappDisplay}</a>
            </Button>
          </section>
        </form>

        {/* -------- Order summary -------- */}
        <aside className="rounded-3xl bg-white border shadow-card p-6 lg:sticky lg:top-32">
          <h2 className="font-black text-navy-900 text-lg flex items-center gap-2 mb-4"><ShoppingBag className="text-gold-500" /> ملخص الطلب</h2>
          {items.length === 0 ? (
            <div className="text-center py-8"><p className="font-bold text-slate-500 mb-4">سلتك فارغة</p><Button asChild variant="outline"><Link href="/shop">تصفح المكتبة</Link></Button></div>
          ) : (
            <>
              <ul className="space-y-3">
                {items.map((r) => (
                  <li key={r.id} className="flex gap-3 rounded-2xl border p-3">
                    <span className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center text-white font-black text-[10px] ${r.fileType === "PDF" ? "bg-red-600" : "bg-blue-600"}`}>{r.fileType === "PDF" ? "PDF" : "DOC"}</span>
                    <span className="min-w-0 flex-1"><Link href={`/product/${r.id}`} className="block font-black text-xs leading-5 text-navy-900 line-clamp-2 hover:underline">{r.title}</Link><span className="text-xs font-bold text-slate-500">{formatLYD(r.priceLYD)}</span></span>
                    <button onClick={() => remove(r.id)} aria-label="حذف" className="text-slate-300 hover:text-red-600 self-start"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
              <div className="border-t mt-5 pt-4 space-y-2 text-sm font-bold text-slate-600">
                <p className="flex justify-between"><span>المجموع الفرعي</span><span>{formatLYD(total)}</span></p>
                <p className="flex justify-between"><span>التسليم الرقمي</span><span className="text-green-600">مجاني</span></p>
                <p className="flex justify-between text-base font-black text-navy-900 border-t pt-3"><span>الإجمالي (LYD)</span><span>{formatLYD(total)}</span></p>
              </div>
              <p className="text-[11px] leading-6 text-slate-400 font-bold mt-4">المصرف: {SITE.bankName} • يفتح التحميل بعد اعتماد الإيصال من الإدارة. للمساعدة: {SITE.email}</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
