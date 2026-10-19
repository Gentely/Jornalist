import { Clock3, Mail, MapPin, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import BankAccountDialog from "@/components/BankAccountDialog";
import { SITE } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

export const metadata = { title: "تواصل معنا | Journalist — صبراتة" };
export default function ContactPage() {
  const cards = [
    { icon: <UserRound className="h-6 w-6" />, title: "الإدارة", main: SITE.owner, sub: "مالك ومؤسس المنصة" },
    { icon: <Mail className="h-6 w-6" />, title: "البريد الإلكتروني", main: SITE.email, sub: "نرد خلال 24 ساعة", href: `mailto:${SITE.email}`, ltr: true },
    { icon: <WhatsAppIcon className="h-6 w-6" />, title: "واتساب", main: SITE.whatsappDisplay, sub: "الأسرع — اضغط للمحادثة", href: SITE.whatsappUrl, ltr: true },
    { icon: <MapPin className="h-6 w-6" />, title: "الموقع", main: SITE.location, sub: SITE.bankName },
    { icon: <Clock3 className="h-6 w-6" />, title: "ساعات العمل", main: "السبت – الخميس", sub: "9:00 صباحاً – 9:00 مساءً" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-black text-navy-900">تواصل معنا</h1>
      <p className="text-slate-500 text-sm mt-2">فريق Journalist في {SITE.location} جاهز لمساعدتك — البريد <span dir="ltr" className="font-bold">{SITE.email}</span> أو واتساب <span dir="ltr" className="font-bold">{SITE.whatsappDisplay}</span></p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {cards.map((c) => {
          const inner = (<><span className="h-12 w-12 rounded-2xl bg-navy-50 text-navy-800 flex items-center justify-center mb-3">{c.icon}</span><p className="text-xs font-bold text-slate-400">{c.title}</p><p dir={c.ltr ? "ltr" : undefined} className={`font-black text-navy-900 mt-1 text-sm break-all ${c.ltr ? "text-right" : ""}`}>{c.main}</p><p className="text-xs text-slate-500 mt-1">{c.sub}</p></>);
          return c.href
            ? <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="rounded-3xl bg-white border shadow-card p-5 hover:shadow-soft transition block">{inner}</a>
            : <div key={c.title} className="rounded-3xl bg-white border shadow-card p-5">{inner}</div>;
        })}
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mt-6 items-stretch">
        <div className="rounded-3xl overflow-hidden border shadow-card min-h-[360px] bg-white">
          <iframe title="خريطة صبراتة، ليبيا" src="https://www.google.com/maps?q=Sabratha,+Libya&output=embed" className="w-full h-full min-h-[360px] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <div className="rounded-3xl bg-navy-800 text-white p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-black mb-3">راسلنا الآن</h2>
          <p className="text-slate-300 text-sm leading-8 mb-6">استفسار عن بحث؟ طلب مخصص؟ حالة إيصال؟ أرسل رسالتك عبر واتساب وسنرد عليك مباشرة. للدفع بالتحويل المصرفي افتح «حساب الدفع».</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="whatsapp" size="lg"><a href={whatsappLink("مرحباً منصة Journalist، لدي استفسار")} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-5 w-5" /> واتساب {SITE.whatsappDisplay}</a></Button>
            <Button asChild variant="gold" size="lg"><a href={`mailto:${SITE.email}?subject=${encodeURIComponent("استفسار — منصة Journalist")}`}><Mail /> {SITE.email}</a></Button>
            <BankAccountDialog size="lg" className="bg-white" />
          </div>
          <p className="text-xs text-slate-400 mt-6 leading-6">📍 صبراتة، ليبيا • المصرف: مصرف الجمهورية - المدينة - صبراتة • العملة: الدينار الليبي LYD</p>
        </div>
      </div>
    </div>
  );
}
