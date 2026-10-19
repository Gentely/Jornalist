"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function safeNextPath(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [busy, setBusy] = React.useState(false);
  const [nextPath, setNextPath] = React.useState("");
  const [currentEmail, setCurrentEmail] = React.useState("");

  React.useEffect(() => {
    const queryNext = safeNextPath(new URLSearchParams(window.location.search).get("next"));
    setNextPath(queryNext);

    if (!isSupabaseConfigured || !supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user.email || "";
      setCurrentEmail(sessionEmail);
      if (sessionEmail && queryNext) router.replace(queryNext);
    });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    if (!isSupabaseConfigured || !supabase) {
      setMsg("وضع تجريبي: لم يتم ربط Supabase بعد. ضع بيانات مشروعك في .env.local (راجع .env.example ودليل النشر وملفات supabase/migrations) وسيعمل تسجيل الدخول/الإنشاء فوراً. تصفح المكتبة والشراء يعملان دون حساب.");
      setBusy(false); return;
    }
    const res = mode === "login" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
    if (!res.error && res.data.session?.user.email) {
      setCurrentEmail(res.data.session.user.email);
      if (nextPath) {
        router.push(nextPath);
        return;
      }
    }
    setMsg(res.error ? `⚠️ ${res.error.message}` : mode === "login" ? "✅ تم تسجيل الدخول بنجاح" : "✅ تم إنشاء الحساب — تحقق من بريدك للتأكيد إذا طُلب التأكيد");
    setBusy(false);
  };

  const signOut = async () => {
    if (!supabase) return;
    setBusy(true);
    await supabase.auth.signOut();
    setCurrentEmail("");
    setMsg("تم تسجيل الخروج. يمكنك الدخول بحساب آخر.");
    setBusy(false);
  };
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl bg-white border shadow-card p-7">
        <span className="h-12 w-12 rounded-2xl bg-navy-800 text-gold-400 flex items-center justify-center mb-4"><LogIn className="h-6 w-6" /></span>
        <h1 className="text-2xl font-black text-navy-900">{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</h1>
        <p className="text-sm text-slate-500 mt-1.5">حسابك يجمع مشترياتك وتحميلاتك بعد اعتماد الإيصالات (Supabase Auth).</p>
        {currentEmail && (
          <div className="mt-5 rounded-2xl bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-bold text-green-900">أنت مسجل حالياً بالبريد:</p>
            <p dir="ltr" className="text-left text-sm font-black text-green-950 mt-1 break-all">{currentEmail}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button asChild size="sm"><Link href={nextPath || "/my-orders"}>متابعة</Link></Button>
              <Button type="button" size="sm" variant="outline" onClick={() => void signOut()} disabled={busy}><LogOut /> تسجيل الخروج</Button>
            </div>
          </div>
        )}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><Label>البريد الإلكتروني</Label><Input type="email" required dir="ltr" className="text-left" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          <div><Label>كلمة المرور</Label><Input type="password" required dir="ltr" className="text-left" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
          {msg && <p className="rounded-xl bg-slate-50 border p-3.5 text-sm font-bold text-slate-700 leading-7">{msg}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "جاري التنفيذ..." : mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}</Button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm font-bold text-navy-700 hover:underline mt-4">{mode === "login" ? "ليس لديك حساب؟ إنشاء حساب جديد" : "لديك حساب؟ تسجيل الدخول"}</button>
        <p className="text-xs text-slate-400 font-bold mt-5">للشراء السريع دون حساب استخدم <Link href="/checkout" className="underline">الدفع كزائر</Link> أو واتساب 00218918199601</p>
      </div>
    </div>
  );
}
