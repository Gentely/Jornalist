import Link from "next/link";
import { BookOpenCheck, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-200 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-11 w-11 rounded-2xl bg-white/10 text-gold-400 flex items-center justify-center"><BookOpenCheck className="h-6 w-6" /></span>
            <div><p className="text-xl font-black text-white">Journalist</p><p className="text-xs text-slate-400">منصة البحوث العلمية</p></div>
          </div>
          <p className="text-sm leading-7 text-slate-300">بحوث Word موثقة في الطب العام وأمراض السرطان وTESOL، تعرض بغلاف ونبذة واضحة قبل الطلب. بإدارة {SITE.owner}</p>
        </div>
        <div>
          <h3 className="font-black text-white mb-4">روابط سريعة</h3>
          <ul className="space-y-2.5 text-sm">
            {[["/shop","تصفح المكتبة"],["/custom-request","اطلب بحثاً مخصصاً"],["/cart","سلة الشراء"],["/checkout","إتمام الطلب"],["/my-orders","طلباتي والتحميلات"]].map(([h,l]) => <li key={h}><Link className="hover:text-gold-400" href={h}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-black text-white mb-4">المنصة</h3>
          <ul className="space-y-2.5 text-sm">
            {[["/about","من نحن"],["/contact","تواصل معنا"],["/login","تسجيل الدخول"],["/admin","لوحة الإدارة"]].map(([h,l]) => <li key={h}><Link className="hover:text-gold-400" href={h}>{l}</Link></li>)}
          </ul>
          <p className="text-xs text-slate-400 mt-5 leading-6">طريقة الدفع: تحويل مصرفي — مصرف الجمهورية • أو عبر واتساب. تظهر بيانات الحساب من زر «حساب الدفع» عند إتمام الطلب.</p>
        </div>
        <div>
          <h3 className="font-black text-white mb-4">تواصل معنا</h3>
          <ul className="space-y-3.5 text-sm">
            <li className="flex gap-2.5"><MapPin className="h-4 w-4 mt-0.5 text-gold-400 shrink-0" /> {SITE.location}</li>
            <li><a href={`mailto:${SITE.email}`} className="flex gap-2.5 hover:text-gold-400"><Mail className="h-4 w-4 mt-0.5 text-gold-400 shrink-0" /> <span dir="ltr">{SITE.email}</span></a></li>
            <li><a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="flex gap-2.5 hover:text-green-300"><WhatsAppIcon className="h-4 w-4 mt-0.5 text-green-400" /> <span dir="ltr">{SITE.whatsappDisplay}</span></a></li>
            <li className="flex gap-2.5"><Phone className="h-4 w-4 mt-0.5 text-gold-400 shrink-0" /> السبت – الخميس: 9ص – 9م</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Journalist — منصة البحوث العلمية. جميع الحقوق محفوظة.</p>
          <p>المالك: {SITE.owner} • صبراتة، ليبيا • العملة: LYD (د.ل)</p>
        </div>
      </div>
    </footer>
  );
}
