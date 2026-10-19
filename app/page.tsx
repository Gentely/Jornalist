import Link from "next/link";
import { ArrowLeft, Award, BookOpenCheck, CheckCircle2, FileText, GraduationCap, Landmark, PenLine, Quote, Search, ShieldCheck, Star, UploadCloud, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ResearchCard from "@/components/ResearchCard";
import BankAccountDialog from "@/components/BankAccountDialog";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { CATEGORIES, RESEARCHES, TESTIMONIALS } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export default function HomePage() {
  const featured = RESEARCHES.filter((r) => r.featured);
  const best = RESEARCHES.filter((r) => r.bestSeller);
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(700px 320px at 85% 10%, #C9A22766, transparent 60%), radial-gradient(600px 300px at 10% 90%, #2563EB55, transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24 grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-center">
          <div>
            <Badge variant="gold" className="mb-5 text-xs px-3 py-1">🎓 منصة ليبية من صبراتة — بإدارة محمد أحمد محمد</Badge>
            <h1 className="text-3xl sm:text-5xl font-black leading-[1.35]">آلاف البحوث الجاهزة والموثقة<br /><span className="text-gold-400">لطلبة الماجستير والدكتوراه</span></h1>
            <p className="mt-5 text-slate-300 leading-8 text-base sm:text-lg max-w-2xl">بحوث ورسائل علمية بصيغ PDF و Word قابلة للتعديل، موثقة بمراجع حديثة من جامعات ليبية معتمدة. ادفع بالتحويل المصرفي أو أتمم طلبك عبر واتساب خلال دقائق.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold"><Link href="/shop"><Search /> تصفح المكتبة <ArrowLeft /></Link></Button>
              <Button asChild size="lg" variant="whatsapp"><a href={whatsappLink("مرحباً، أحتاج مساعدة في اختيار بحث")} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-5 w-5" /> استشرنا واتساب</a></Button>
              <BankAccountDialog size="lg" className="bg-white" />
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              {["مراجع موثقة APA", "تسليم فوري بعد الاعتماد", "دعم ليبي بالعربية"].map((t) => <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-400" /> {t}</span>)}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur p-6 shadow-2xl">
              <p className="font-black text-lg mb-4 flex items-center gap-2"><BookOpenCheck className="text-gold-400" /> أحدث الإضافات هذا الأسبوع</p>
              <div className="space-y-3">
                {RESEARCHES.slice(0, 3).map((r) => (
                  <Link key={r.id} href={`/product/${r.id}`} className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/20 transition p-3.5">
                    <span className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center font-black text-xs ${r.fileType === "PDF" ? "bg-red-600" : "bg-blue-600"}`}>{r.fileType === "PDF" ? "PDF" : "DOC"}</span>
                    <span className="min-w-0"><span className="block font-bold text-sm leading-6 line-clamp-2">{r.title}</span><span className="text-xs text-slate-300">{r.university} • {r.priceLYD} د.ل</span></span>
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5 text-center">
                {[["+1,200","بحث ورسالة"],["+4,800","طالب وباحث"],["4.8/5","تقييم العملاء"]].map(([n,l]) => (
                  <div key={l} className="rounded-2xl bg-navy-900/60 py-3"><p className="font-black text-gold-400">{n}</p><p className="text-[11px] text-slate-300 mt-0.5">{l}</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="mx-auto max-w-7xl px-4 -mt-2 pt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[{i:BookOpenCheck,n:"+1,200",l:"بحث جاهز وموثق"},{i:Users,n:"+4,800",l:"طالب وباحث"},{i:GraduationCap,n:"8",l:"جامعات ليبية"},{i:Award,n:"98%",l:"رضا العملاء"}].map(({i:Icon,n,l}) => (
            <div key={l} className="rounded-2xl bg-white border shadow-card p-5 flex items-center gap-4"><span className="h-12 w-12 rounded-2xl bg-navy-50 text-navy-800 flex items-center justify-center shrink-0"><Icon className="h-6 w-6" /></span><div><p className="text-2xl font-black text-navy-900">{n}</p><p className="text-xs text-slate-500 font-bold">{l}</p></div></div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="mx-auto max-w-7xl px-4 mt-14">
        <div className="flex items-end justify-between mb-6"><div><h2 className="text-2xl sm:text-3xl font-black text-navy-900">تصفح حسب التخصص</h2><p className="text-slate-500 mt-1 text-sm">10 تخصصات أكاديمية رئيسية</p></div><Link href="/shop" className="font-bold text-navy-700 text-sm hover:underline shrink-0">عرض الكل ←</Link></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((c, i) => (
            <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`} className="rounded-2xl bg-white border p-5 text-center hover:shadow-soft hover:border-navy-600/30 transition group">
              <span className="text-3xl block mb-2 group-hover:scale-110 transition">{["⚖️","🩺","🏗️","💻","📊","📚","💰","🏛️","🕌","📰"][i]}</span>
              <span className="font-black text-sm text-navy-900">{c}</span>
              <span className="block text-[11px] text-slate-400 mt-1">{RESEARCHES.filter(r=>r.category===c).length}+ بحث في العرض التجريبي</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      <section className="mx-auto max-w-7xl px-4 mt-16">
        <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mb-1">بحوث مميزة مختارة</h2>
        <p className="text-slate-500 text-sm mb-6">الأعلى تقييماً من طلبة الدراسات العليا في ليبيا • الأسعار بالدينار الليبي (LYD)</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{featured.map((r) => <ResearchCard key={r.id} r={r} />)}</div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="mx-auto max-w-7xl px-4 mt-16">
        <div className="rounded-3xl bg-navy-800 text-white p-7 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">كيف تشتري بحثك؟</h2>
          <p className="text-slate-300 text-sm mb-8">أربع خطوات فقط — بالتحويل المصرفي أو عبر واتساب</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {i:Search,t:"اختر البحث",d:"تصفح المكتبة وفلتر بالتخصص والجامعة ونوع الملف PDF أو Word"},
              {i:Landmark,t:"افتح «حساب الدفع»",d:"اضغط الزر لتظهر لك بيانات الحساب داخل نافذة آمنة وانسخ الرقم"},
              {i:UploadCloud,t:"حوّل وارفع الإيصال",d:"حوّل المبلغ من مصرفك وارفع صورة الإيصال — يصبح طلبك «قيد المراجعة»"},
              {i:ShieldCheck,t:"اعتماد ثم تحميل",d:"نراجع إيصالك ونعتمد الطلب ليفتح لك رابط التحميل فوراً"},
            ].map(({i:Icon,t,d}, idx) => (
              <div key={t} className="rounded-2xl bg-white/10 border border-white/10 p-5">
                <div className="flex items-center justify-between mb-3"><span className="h-11 w-11 rounded-xl bg-gold-500 text-white flex items-center justify-center"><Icon className="h-5 w-5" /></span><span className="text-4xl font-black text-white/15">{idx+1}</span></div>
                <h3 className="font-black mb-1.5">{t}</h3><p className="text-sm text-slate-300 leading-7">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <BankAccountDialog className="bg-white" />
            <Button asChild variant="whatsapp"><a href={whatsappLink("مرحباً، أريد إتمام طلب عبر واتساب")} target="_blank" rel="noreferrer"><WhatsAppIcon /> أو أتمم طلبك عبر واتساب {SITE.whatsappDisplay}</a></Button>
          </div>
        </div>
      </section>

      {/* ===== BEST SELLERS ===== */}
      <section className="mx-auto max-w-7xl px-4 mt-16">
        <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mb-6">الأكثر مبيعاً</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{best.map((r) => <ResearchCard key={r.id} r={r} />)}</div>
        <div className="text-center mt-8"><Button asChild size="lg" variant="outline"><Link href="/shop">عرض كل البحوث (20 في النسخة التجريبية) <ArrowLeft /></Link></Button></div>
      </section>

      {/* ===== CUSTOM CTA + TESTIMONIALS ===== */}
      <section className="mx-auto max-w-7xl px-4 mt-16 grid lg:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-gradient-to-br from-gold-500 to-amber-600 text-white p-8">
          <PenLine className="h-10 w-10 mb-4" />
          <h2 className="text-2xl font-black mb-2">لم تجد موضوعك؟ نكتبه لك خصيصاً</h2>
          <p className="text-white/90 leading-8 text-sm mb-6">أرسل العنوان والتخصص وعدد الصفحات وموعد التسليم، وسنرد عليك بعرض سعر عبر واتساب. كتابة أكاديمية أصلية من الصفر.</p>
          <Button asChild className="bg-white text-amber-700 hover:bg-amber-50"><Link href="/custom-request">اطلب بحثاً مخصصاً <ArrowLeft /></Link></Button>
        </div>
        <div className="rounded-3xl bg-white border shadow-card p-8">
          <h2 className="text-2xl font-black text-navy-900 mb-5 flex items-center gap-2"><Quote className="text-gold-500" /> ماذا قال طلابنا؟</h2>
          <div className="space-y-4">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex gap-0.5 mb-1.5">{[...Array(5)].map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm leading-7 text-slate-700">“{t.text}”</p><cite className="text-xs font-bold text-slate-500 not-italic">— {t.name}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
