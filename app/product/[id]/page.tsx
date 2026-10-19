"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  Check,
  Eye,
  FileText,
  Languages,
  Lock,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { getResearch, RESEARCHES } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cover, ResearchListItem } from "@/components/ResearchCard";
import BankAccountDialog from "@/components/BankAccountDialog";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { useCart } from "@/lib/cart";
import { formatLYD, whatsappLink } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const research = getResearch(params.id);
  const { add, has } = useCart();

  if (!research) return notFound();

  const related = RESEARCHES.filter((item) => item.group === research.group && item.id !== research.id).slice(0, 2);
  const inCart = has(research.id);
  const waText = `مرحباً منصة Journalist،\nقرأت مختصر هذا البحث وأريد شراءه:\n${research.title}\nالسعر: ${research.priceLYD} د.ل\nالنوع: Word (DOCX)`;

  const orderNow = () => {
    add(research);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-9">
      <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs font-bold text-slate-500" aria-label="مسار الصفحة">
        <Link href="/" className="hover:text-navy-700">الرئيسية</Link><span>/</span>
        <Link href="/shop" className="hover:text-navy-700">قائمة البحوث</Link><span>/</span>
        <Link href={`/shop?group=${encodeURIComponent(research.group)}`} className="hover:text-navy-700">{research.group}</Link><span>/</span>
        <span className="text-navy-900">تفاصيل البحث</span>
      </nav>

      <div className="grid items-start gap-7 lg:grid-cols-[350px_1fr]">
        {/* صورة الغلاف كبيرة وواضحة */}
        <aside className="overflow-hidden rounded-3xl border bg-white shadow-soft lg:sticky lg:top-32">
          <Cover r={research} tall />
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 p-4 text-center">
            <div><FileText className="mx-auto mb-1 h-4 w-4 text-slate-400" /><p className="text-xs font-black">نحو {research.pages} صفحة</p></div>
            <div><BookOpenCheck className="mx-auto mb-1 h-4 w-4 text-slate-400" /><p className="text-xs font-black">{research.words.toLocaleString("ar-LY")} كلمة</p></div>
            <div><CalendarDays className="mx-auto mb-1 h-4 w-4 text-slate-400" /><p className="text-xs font-black">{research.year}</p></div>
          </div>
          <p className="border-t border-slate-100 px-5 py-4 text-center text-xs font-bold leading-6 text-slate-500">
            الملف الكامل لا يظهر على الموقع ولا يُنشر علناً؛ يتم تسليمه بعد تأكيد الدفع واعتماد الطلب.
          </p>
        </aside>

        <main className="min-w-0">
          <div className="rounded-3xl border bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap gap-2">
              <Badge>{research.group}</Badge>
              <Badge variant="secondary">{research.category}</Badge>
              <Badge variant="outline">{research.level}</Badge>
              <Badge className="border-0 bg-blue-700 text-white">Word (DOCX)</Badge>
            </div>

            {/* عنوان البحث أولاً */}
            <h1 dir="auto" className="mt-4 text-2xl font-black leading-[1.8] text-navy-900 sm:text-[30px]">{research.title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-slate-500">
              <span className="inline-flex items-center gap-1"><Languages className="h-4 w-4" /> {research.language}</span>
              <span>{research.university}</span>
              <span>إصدار {research.year}</span>
            </p>

            {/* النبذة قبل أي زر شراء */}
            <section className="mt-6 rounded-3xl border border-blue-100 bg-bank p-5 sm:p-6" aria-labelledby="short-summary-title">
              <p id="short-summary-title" className="text-lg font-black text-navy-900">نبذة مختصرة عن البحث</p>
              <p className="mt-1 text-xs font-bold text-blue-700">اقرأ هذه النبذة والمختصر العلمي أسفلها قبل الطلب والدفع.</p>
              <p className="mt-3 text-[15px] font-medium leading-8 text-slate-700">{research.summary}</p>
            </section>

            <section className="mt-7" aria-labelledby="full-summary-title">
              <h2 id="full-summary-title" className="text-xl font-black text-navy-900">المختصر العلمي الكامل</h2>
              <p dir="auto" className="mt-3 text-sm leading-8 text-slate-600 sm:text-[15px] sm:leading-9">{research.abstract}</p>
            </section>

            <section className="mt-7" aria-labelledby="contents-title">
              <h2 id="contents-title" className="flex items-center gap-2 text-xl font-black text-navy-900"><BookOpenCheck className="h-5 w-5 text-gold-600" /> ماذا ستجد داخل البحث؟</h2>
              <ul className="mt-4 space-y-2">
                {research.chapters.map((chapter, index) => (
                  <li key={chapter} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold text-slate-700">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-navy-800 shadow-sm">{index + 1}</span>
                    <span dir="auto">{chapter}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid gap-3 text-xs font-bold text-slate-600 sm:grid-cols-3">
                <p className="rounded-2xl bg-slate-50 p-3"><ShieldCheck className="mb-1 h-4 w-4 text-green-600" /> توثيق داخل النص وقائمة مراجع في النهاية</p>
                <p className="rounded-2xl bg-slate-50 p-3"><FileText className="mb-1 h-4 w-4 text-blue-600" /> نسخة Word قابلة للتعديل والطباعة</p>
                <p className="rounded-2xl bg-slate-50 p-3"><Eye className="mb-1 h-4 w-4 text-amber-600" /> المستخلصات العربية والإنجليزية مدمجة في الملف</p>
              </div>
            </section>
          </div>

          {/* الطلب والدفع بعد المختصر مباشرة، في مكان واحد لا يحتاج بحثاً */}
          <section className="mt-6 rounded-3xl bg-navy-800 p-6 text-white shadow-soft sm:p-8" aria-labelledby="order-title">
            <p className="text-sm font-black text-gold-400">قرأت المختصر؟ هذه هي الخطوة الأخيرة</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <h2 id="order-title" className="text-2xl font-black">الطلب والدفع</h2>
              <p className="text-4xl font-black">{formatLYD(research.priceLYD)}</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              اضغط «اطلب وادفع الآن» للانتقال إلى إتمام الطلب، أو افتح «حساب الدفع» للتحويل المصرفي، أو أكمل عبر واتساب. يبدأ تسليم الملف بعد تأكيد الدفع واعتماد الإيصال.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button type="button" variant="gold" size="lg" onClick={orderNow} className="h-13">اطلب وادفع الآن <ArrowLeft /></Button>
              <Button type="button" variant="secondary" size="lg" onClick={() => add(research)} disabled={inCart} className="h-13">
                {inCart ? <><Check /> البحث موجود في السلة</> : <><ShoppingCart /> أضف إلى السلة</>}
              </Button>
              <BankAccountDialog size="lg" className="h-13 w-full bg-white" />
              <Button asChild variant="whatsapp" size="lg" className="h-13">
                <a href={whatsappLink(waText)} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-5 w-5" /> اطلب عبر واتساب {SITE.whatsappDisplay}</a>
              </Button>
            </div>
            <p className="mt-4 text-center text-[11px] font-bold leading-6 text-slate-400">
              في التحويل المصرفي: حوّل أولاً ثم ارفع صورة الإيصال من صفحة إتمام الطلب، وسيظهر طلبك «قيد المراجعة» إلى حين الاعتماد.
            </p>
          </section>

          {/* Representation of protected preview design; actual research text remains unpublished */}
          <section className="mt-6 rounded-3xl border bg-white p-6 shadow-card sm:p-7">
            <h2 className="flex items-center gap-2 text-xl font-black text-navy-900"><Lock className="h-5 w-5 text-gold-600" /> حماية البحث الكامل</h2>
            <p className="mt-3 text-sm leading-8 text-slate-600">
              النبذة والمختصر وفهرس المحتويات متاحة مجاناً هنا لمساعدتك على اتخاذ قرار واضح. أما نص البحث الكامل فيبقى خاصاً ولا يوضع في صفحة عامة على الإنترنت، حفاظاً على قيمته وحتى لا تتم فهرسته أو نسخه قبل الشراء.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["النبذة والمختصر: متاحان الآن", "فهرس المحتويات: متاح الآن", "النص الكامل: بعد تأكيد الطلب"].map((text) => (
                <p key={text} className="rounded-2xl bg-slate-50 p-4 text-center text-xs font-black leading-6 text-navy-800">{text}</p>
              ))}
            </div>
          </section>
        </main>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-2 text-2xl font-black text-navy-900">بحوث أخرى في {research.group}</h2>
          <p className="mb-5 text-sm text-slate-500">تكمل القائمة تحت بعضها بالطريقة نفسها: الغلاف، ثم العنوان والنبذة، ثم الطلب.</p>
          <div className="space-y-5">{related.map((item) => <ResearchListItem key={item.id} r={item} />)}</div>
        </section>
      )}
    </div>
  );
}
