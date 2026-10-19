import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  FileText,
  GraduationCap,
  HeartPulse,
  Landmark,
  Languages,
  PenLine,
  ShieldCheck,
  Stethoscope,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResearchListItem } from "@/components/ResearchCard";
import BankAccountDialog from "@/components/BankAccountDialog";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { RESEARCHES } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const GROUP_CARDS = [
  { label: "بحوث طبية عامة", href: `/shop?group=${encodeURIComponent("بحوث طبية عامة")}`, icon: Stethoscope, note: "الصحة العامة وطب الأسرة والأمراض المزمنة" },
  { label: "أمراض السرطان", href: `/shop?group=${encodeURIComponent("أمراض السرطان")}`, icon: HeartPulse, note: "الرئة والبروستاتا والثدي والكشف المبكر والعلاج" },
  { label: "TESOL — اللغة الإنجليزية", href: `/shop?group=${encodeURIComponent("TESOL — اللغة الإنجليزية")}`, icon: Languages, note: "مناهج تعليم الإنجليزية وتقنيات تعلم المفردات" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(700px 320px at 85% 10%, #C9A22766, transparent 60%), radial-gradient(600px 300px at 10% 90%, #2563EB55, transparent 60%)" }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 lg:grid-cols-[1.1fr_.9fr] lg:py-20">
          <div>
            <Badge variant="gold" className="mb-5 px-3 py-1 text-xs">منصة ليبية من صبراتة — بإدارة محمد أحمد محمد</Badge>
            <h1 className="text-3xl font-black leading-[1.45] sm:text-5xl">
              بحوث علمية موثقة
              <span className="block text-gold-400">بغلاف واضح ونبذة قبل الطلب</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              تصفح قائمة بسيطة من البحوث الطبية وبحوث السرطان وTESOL. لكل بحث صورة غلاف وعنوان ونبذة مختصرة ومختصر علمي كامل، وبعد قراءته يمكنك الطلب والدفع بالتحويل المصرفي أو واتساب.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold"><Link href="#research-list"><BookOpenCheck /> شاهد قائمة البحوث <ArrowLeft /></Link></Button>
              <Button asChild size="lg" variant="whatsapp"><a href={whatsappLink("مرحباً، أحتاج مساعدة في اختيار بحث من القائمة")} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-5 w-5" /> اسألنا واتساب</a></Button>
              <BankAccountDialog size="lg" className="bg-white" />
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
              {["نبذة قبل الدفع", "مراجع موثقة داخل كل بحث", "ملفات Word قابلة للتعديل"].map((text) => (
                <span key={text} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-400" /> {text}</span>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <p className="mb-4 flex items-center gap-2 text-lg font-black"><BookOpenCheck className="text-gold-400" /> الدفعة الأولى المتاحة الآن</p>
              <div className="space-y-3">
                {RESEARCHES.slice(0, 3).map((research) => (
                  <Link key={research.id} href={`/product/${research.id}`} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 transition hover:bg-white/20">
                    <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg"><Image src={research.cover} alt="" fill sizes="48px" className="object-cover object-top" /></span>
                    <span className="min-w-0">
                      <span dir="auto" className="block text-sm font-bold leading-6 line-clamp-2">{research.title}</span>
                      <span className="text-xs text-slate-300">{research.group} • {research.priceLYD} د.ل</span>
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[["7", "بحوث كاملة"], ["3", "مجالات رئيسية"], ["Word", "قابل للتعديل"]].map(([number, label]) => (
                  <div key={label} className="rounded-2xl bg-navy-900/60 py-3"><p className="font-black text-gold-400">{number}</p><p className="mt-0.5 text-[11px] text-slate-300">{label}</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10" aria-label="ملخص الدفعة الحالية">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: BookOpenCheck, number: String(RESEARCHES.length), label: "بحوث ظاهرة في القائمة" },
            { icon: Stethoscope, number: "2", label: "بحوث طبية عامة" },
            { icon: HeartPulse, number: "3", label: "بحوث أمراض سرطان" },
            { icon: Languages, number: "2", label: "بحوث TESOL بالإنجليزية" },
          ].map(({ icon: Icon, number, label }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-card">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-50 text-navy-800"><Icon className="h-6 w-6" /></span>
              <div><p className="text-2xl font-black text-navy-900">{number}</p><p className="text-xs font-bold text-slate-500">{label}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-12">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div><h2 className="text-2xl font-black text-navy-900 sm:text-3xl">اختر المجال الذي يناسبك</h2><p className="mt-1 text-sm text-slate-500">ثلاثة اختيارات فقط، من دون قوائم معقدة.</p></div>
          <Link href="/shop" className="shrink-0 text-sm font-bold text-navy-700 hover:underline">عرض القائمة كاملة ←</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {GROUP_CARDS.map(({ label, href, icon: Icon, note }) => (
            <Link key={label} href={href} className="rounded-3xl border bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
              <Icon className="mb-4 h-9 w-9 text-gold-600" />
              <h3 className="text-lg font-black text-navy-900">{label}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">{note}</p>
              <p className="mt-3 text-xs font-black text-navy-700">{RESEARCHES.filter((research) => research.group === label).length} بحوث متاحة الآن ←</p>
            </Link>
          ))}
        </div>
      </section>

      {/* القائمة الرئيسة المطلوبة: غلاف + عنوان + نبذة + طلب، بحث تحت الآخر */}
      <section id="research-list" className="mx-auto max-w-6xl scroll-mt-28 px-4 mt-14" aria-labelledby="research-list-title">
        <div className="text-center">
          <Badge variant="gold">الدفعة الأولى</Badge>
          <h2 id="research-list-title" className="mt-3 text-2xl font-black text-navy-900 sm:text-3xl">قائمة البحوث المتتالية</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            كل بحث مستقل في سطر واضح: شاهد الغلاف، واقرأ العنوان والنبذة، وافتح المختصر الكامل إذا رغبت، ثم استخدم أزرار الطلب والدفع الموجودة أسفل النبذة مباشرة.
          </p>
        </div>
        <div className="mt-7 space-y-5">
          {RESEARCHES.map((research) => <ResearchListItem key={research.id} r={research} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-14">
        <div className="rounded-3xl bg-navy-800 p-7 text-white sm:p-10">
          <h2 className="text-2xl font-black sm:text-3xl">كيف تطلب وتدفع؟</h2>
          <p className="mb-8 mt-2 text-sm text-slate-300">أربع خطوات قصيرة بعد قراءة المختصر.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpenCheck, title: "شاهد واقرأ", text: "راجع صورة الغلاف والعنوان والنبذة والمختصر العلمي ومحتويات البحث." },
              { icon: Landmark, title: "اختر الدفع", text: "اضغط «حساب الدفع» للتحويل المصرفي، أو الزر الأخضر لإتمام الطلب عبر واتساب." },
              { icon: UploadCloud, title: "ارفع الإيصال", text: "بعد التحويل أرفق صورة إيصال واضحة، وسيصبح الطلب «قيد المراجعة»." },
              { icon: ShieldCheck, title: "الاعتماد والتسليم", text: "نراجع الإيصال، وبعد الاعتماد يتم تسليم ملف Word الكامل وفق بيانات التواصل." },
            ].map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <div className="mb-3 flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-white"><Icon className="h-5 w-5" /></span><span className="text-4xl font-black text-white/15">{index + 1}</span></div>
                <h3 className="mb-1.5 font-black">{title}</h3><p className="text-sm leading-7 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <BankAccountDialog className="bg-white" />
            <Button asChild variant="whatsapp"><a href={whatsappLink("مرحباً، قرأت نبذة بحث وأريد إتمام طلب عبر واتساب")} target="_blank" rel="noreferrer"><WhatsAppIcon /> إتمام الطلب عبر واتساب {SITE.whatsappDisplay}</a></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 mt-14 lg:grid-cols-2">
        <div className="rounded-3xl bg-gradient-to-br from-gold-500 to-amber-600 p-8 text-white">
          <PenLine className="mb-4 h-10 w-10" />
          <h2 className="mb-2 text-2xl font-black">موضوعك ليس داخل القائمة؟</h2>
          <p className="mb-6 text-sm leading-8 text-white/90">أرسل العنوان والتخصص وعدد الصفحات وموعد التسليم المطلوب. سنرسل لك عرضاً واضحاً على واتساب قبل أن تدفع أي مبلغ.</p>
          <Button asChild className="bg-white text-amber-700 hover:bg-amber-50"><Link href="/custom-request">اطلب بحثاً مخصصاً <ArrowLeft /></Link></Button>
        </div>
        <div className="rounded-3xl border bg-white p-8 shadow-card">
          <h2 className="flex items-center gap-2 text-2xl font-black text-navy-900"><GraduationCap className="text-gold-600" /> ماذا يشمل كل بحث؟</h2>
          <ul className="mt-5 space-y-3 text-sm font-bold leading-7 text-slate-600">
            {["مستخلص عربي ومستخلص إنجليزي", "مقدمة وأسئلة بحث ومنهجية مراجعة أدبية", "محاور تحليلية ومناقشة وحدود للدراسة", "خاتمة وتوصيات وقائمة مراجع موثقة", "ملف Word منسق يمكن تعديله وطباعته"].map((item) => (
              <li key={item} className="flex items-start gap-2"><FileText className="mt-1 h-4 w-4 shrink-0 text-green-600" /> {item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
