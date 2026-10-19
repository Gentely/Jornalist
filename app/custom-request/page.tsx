"use client";
import * as React from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import BankAccountDialog from "@/components/BankAccountDialog";
import { CATEGORIES, UNIVERSITIES } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";

const sel = "h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-navy-600/30";
export default function CustomRequestPage() {
  const [f, setF] = React.useState({ name: "", phone: "", email: "", title: "", category: CATEGORIES[0], university: UNIVERSITIES[2], level: "ماجستير", pages: "80", deadline: "", fileType: "WORD", details: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const message = `طلب بحث مخصص — منصة Journalist\n\n👤 الاسم: ${f.name}\n📱 الهاتف: ${f.phone}\n📧 البريد: ${f.email}\n📌 العنوان المطلوب: ${f.title}\n📚 التخصص: ${f.category}\n🎓 الجامعة: ${f.university}\n📖 المستوى: ${f.level}\n📄 عدد الصفحات: ${f.pages}\n🗂️ نوع الملف: ${f.fileType}\n⏰ موعد التسليم: ${f.deadline || "—"}\n📝 تفاصيل: ${f.details || "—"}\n\nأرجو إرسال عرض السعر بالدينار الليبي.`;
  const valid = f.name.trim() && f.phone.trim() && f.title.trim();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl bg-navy-800 text-white p-8 mb-6">
        <PenLine className="h-9 w-9 text-gold-400 mb-3" />
        <h1 className="text-3xl font-black">اطلب بحثاً مخصصاً</h1>
        <p className="text-slate-300 text-sm leading-7 mt-2">املأ البيانات واضغط الإرسال — ستفتح محادثة واتساب إلى <span dir="ltr" className="font-bold text-white">00218918199601</span> وطلبك جاهز للإرسال. نرد بعرض سعر (LYD) خلال ساعات العمل.</p>
      </div>
      <form className="rounded-3xl bg-white border shadow-card p-6 sm:p-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>الاسم الكامل *</Label><Input value={f.name} onChange={set("name")} placeholder="اسمك" required /></div>
          <div><Label>رقم الهاتف / واتساب *</Label><Input dir="ltr" className="text-left" value={f.phone} onChange={set("phone")} placeholder="09xxxxxxxx" required /></div>
          <div className="sm:col-span-2"><Label>البريد الإلكتروني</Label><Input type="email" dir="ltr" className="text-left" value={f.email} onChange={set("email")} placeholder="you@example.com" /></div>
          <div className="sm:col-span-2"><Label>عنوان البحث / الموضوع المطلوب *</Label><Input value={f.title} onChange={set("title")} placeholder="مثال: أثر التعليم الإلكتروني على التحصيل الدراسي..." required /></div>
          <div><Label>التخصص</Label><select className={sel} value={f.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><Label>الجامعة</Label><select className={sel} value={f.university} onChange={set("university")}>{UNIVERSITIES.map((u) => <option key={u}>{u}</option>)}<option>جامعة أخرى</option></select></div>
          <div><Label>المستوى الدراسي</Label><select className={sel} value={f.level} onChange={set("level")}><option>ماجستير</option><option>دكتوراه</option><option>بكالوريوس</option></select></div>
          <div><Label>نوع الملف المطلوب</Label><select className={sel} value={f.fileType} onChange={set("fileType")}><option value="WORD">Word (DOCX) قابل للتعديل</option><option value="PDF">PDF</option><option value="WORD + PDF">Word + PDF</option></select></div>
          <div><Label>عدد الصفحات التقريبي</Label><Input type="number" min={10} value={f.pages} onChange={set("pages")} /></div>
          <div><Label>موعد التسليم المطلوب</Label><Input type="date" value={f.deadline} onChange={set("deadline")} /></div>
        </div>
        <div><Label>تفاصيل إضافية</Label><textarea value={f.details} onChange={set("details")} rows={4} className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600/30" placeholder="المنهجية، حجم العينة، الفصول المطلوبة، نظام التوثيق..." /></div>
        <Button asChild variant="whatsapp" size="lg" className={`w-full h-14 text-base ${!valid ? "opacity-50 pointer-events-none" : ""}`}>
          <a href={whatsappLink(message)} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-6 w-6" /> إرسال الطلب عبر واتساب 00218918199601</a>
        </Button>
        {!valid && <p className="text-xs font-bold text-slate-400 text-center">أكمل الاسم والهاتف وعنوان البحث لتفعيل الإرسال</p>}
        <div className="flex items-center justify-center gap-3 pt-1"><span className="text-xs text-slate-500 font-bold">اتفقت معنا على السعر؟ ادفع الآن:</span><BankAccountDialog size="sm" /></div>
      </form>
    </div>
  );
}
