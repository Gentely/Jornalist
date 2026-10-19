import Link from "next/link";
import { Award, BookOpenCheck, GraduationCap, ShieldCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "من نحن | Journalist — منصة البحوث العلمية" };
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-10">
        <span className="h-16 w-16 rounded-3xl bg-navy-800 text-gold-400 flex items-center justify-center mx-auto mb-4"><BookOpenCheck className="h-8 w-8" /></span>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-900">من نحن</h1>
        <p className="mt-4 text-lg leading-9 text-slate-600 max-w-3xl mx-auto font-medium">
          Journalist من صبراتة - بإدارة محمد أحمد محمد - نوفر بحوث PDF و Word موثقة من جامعات ليبية
        </p>
      </div>
      <div className="rounded-3xl bg-white border shadow-card p-7 sm:p-10 text-slate-600 leading-9 text-[15px] space-y-4">
        <p><strong className="text-navy-900">Journalist — منصة البحوث العلمية</strong> منصة ليبية متخصصة في توفير البحوث والرسائل العلمية الجاهزة والموثقة لطلبة الماجستير والدكتوراه والبكالوريوس في الجامعات الليبية: جامعة طرابلس، بنغازي، صبراتة، مصراتة، عمر المختار، الزاوية، الأكاديمية الليبية وغيرها.</p>
        <p>يدير المنصة <strong className="text-navy-900">محمد أحمد محمد (محمد بحور)</strong> من مدينة صبراتة، ليبيا. نوفر ملفات PDF جاهزة للطباعة وملفات Word (DOCX) منسقة وقابلة للتعديل، بمراجع حديثة موثقة وفق الأسلوب الأكاديمي المعتمد (APA)، وبأسعار بالدينار الليبي تناسب الطالب الليبي.</p>
        <p>الدفع متاح بالتحويل المصرفي عبر <strong className="text-navy-900">مصرف الجمهورية - المدينة - صبراتة</strong> (تظهر بيانات الحساب داخل نافذة «حساب الدفع» عند إتمام الطلب حفاظاً على أمنها)، أو بإتمام الطلب مباشرة عبر واتساب <span dir="ltr" className="font-bold">00218918199601</span>. وبمجرد اعتماد إيصال التحويل من الإدارة يُفتح لك التحميل فوراً.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { i: Target, t: "رسالتنا", d: "أن يحصل كل طالب ليبي على مرجع علمي موثوق بسرعة وسعر عادل وبعملته المحلية." },
          { i: ShieldCheck, t: "التزامنا بالجودة", d: "كل بحث يمر بمراجعة للتنسيق والتوثيق قبل نشره، ومعاينة من صفحتين قبل الشراء." },
          { i: Award, t: "خبرة محلية", d: "نعرف متطلبات الجامعات والأكاديميات الليبية ودليل كتابة الرسائل فيها." },
        ].map(({ i: Icon, t, d }) => (
          <div key={t} className="rounded-3xl bg-white border shadow-card p-6"><Icon className="h-8 w-8 text-gold-500 mb-3" /><h2 className="font-black text-navy-900 mb-2">{t}</h2><p className="text-sm leading-7 text-slate-500">{d}</p></div>
        ))}
      </div>
      <div className="rounded-3xl bg-navy-800 text-white p-8 mt-6 flex flex-col sm:flex-row items-center gap-6">
        <GraduationCap className="h-14 w-14 text-gold-400 shrink-0" />
        <div className="flex-1 text-center sm:text-right"><h2 className="text-xl font-black">جاهز تبدأ بحثك؟</h2><p className="text-sm text-slate-300 mt-1">تصفح مكتبتنا أو اطلب موضوعك خصيصاً — فريقنا في صبراتة يرد عليك عبر واتساب.</p></div>
        <Button asChild variant="gold" size="lg"><Link href="/shop">تصفح المكتبة</Link></Button>
      </div>
    </div>
  );
}
