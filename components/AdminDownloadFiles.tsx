"use client";

import * as React from "react";
import {
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileWarning,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSupabaseAccessToken } from "@/lib/auth-client";
import { RESEARCHES } from "@/lib/data";

interface AdminFileRow {
  slug: string;
  title: string;
  fileType: string;
  filePath: string;
  exists: boolean;
}

interface SignedLink {
  url: string;
  fileName: string;
  expiresInSeconds: number;
}

const EXPECTED_FILES: AdminFileRow[] = RESEARCHES.map((research) => ({
  slug: research.id,
  title: research.title,
  fileType: research.fileType,
  filePath: `${research.id}.docx`,
  exists: false,
}));

async function readApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "حدث خطأ أثناء الاتصال بخادم التحميلات.";
  } catch {
    return "حدث خطأ أثناء الاتصال بخادم التحميلات.";
  }
}

export default function AdminDownloadFiles({ enabled }: { enabled: boolean }) {
  const [files, setFiles] = React.useState<AdminFileRow[]>(EXPECTED_FILES);
  const [links, setLinks] = React.useState<Record<string, SignedLink>>({});
  const [loading, setLoading] = React.useState(false);
  const [busySlug, setBusySlug] = React.useState("");
  const [copiedSlug, setCopiedSlug] = React.useState("");
  const [error, setError] = React.useState("");

  const loadFiles = React.useCallback(async () => {
    if (!enabled) {
      setFiles(EXPECTED_FILES);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = await getSupabaseAccessToken();
      if (!token) throw new Error("انتهت جلسة المدير. سجّل الدخول من جديد.");

      const response = await fetch("/api/admin/files", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await readApiError(response));

      const body = (await response.json()) as { files?: AdminFileRow[] };
      if (body.files && body.files.length > 0) {
        const bySlug = new Map(body.files.map((file) => [file.slug, file]));
        setFiles([
          ...EXPECTED_FILES.map((expected) => bySlug.get(expected.slug) || expected),
          ...body.files.filter((file) => !EXPECTED_FILES.some((expected) => expected.slug === file.slug)),
        ]);
      } else {
        setFiles(EXPECTED_FILES);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل قائمة الملفات.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  React.useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  const createLink = async (slug: string) => {
    setBusySlug(slug);
    setError("");
    setCopiedSlug("");
    try {
      const token = await getSupabaseAccessToken();
      if (!token) throw new Error("انتهت جلسة المدير. سجّل الدخول من جديد.");

      const response = await fetch(`/api/admin/files/${encodeURIComponent(slug)}/download`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await readApiError(response));

      const link = (await response.json()) as SignedLink;
      setLinks((current) => ({ ...current, [slug]: link }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إنشاء رابط التحميل.");
    } finally {
      setBusySlug("");
    }
  };

  const copyLink = async (slug: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      window.setTimeout(() => setCopiedSlug(""), 2500);
    } catch {
      setError("تعذر النسخ التلقائي؛ افتح الرابط وانسخه من شريط عنوان المتصفح.");
    }
  };

  return (
    <div className="mt-6 rounded-3xl bg-white border shadow-card p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <h2 className="font-black text-navy-900 text-lg flex items-center gap-2">
            <Download className="text-gold-500" /> ملفات التحميل السبعة
          </h2>
          <p className="text-xs leading-6 font-bold text-slate-500 mt-1">
            هذه روابط مباشرة خاصة بالمدير من حاوية <span dir="ltr">research-files</span>،
            وصالحة لمدة 5 دقائق من لحظة الإنشاء. لا تنشرها كروابط دائمة للزبائن.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => void loadFiles()} disabled={loading || !enabled}>
          {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />} تحديث الحالة
        </Button>
      </div>

      {!enabled && (
        <p className="mt-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold p-3.5">
          وضع Supabase الإنتاجي غير جاهز في هذه اللوحة بعد؛ القائمة التالية تعرض أسماء
          الملفات المطلوبة فقط. بعد ضبط مفاتيح الخادم وتسجيل دخول المدير ستظهر حالة
          كل ملف وتعمل أزرار الروابط.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold p-3.5">
          {error}
        </p>
      )}

      <div className="mt-5 space-y-3">
        {files.map((file, index) => {
          const signed = links[file.slug];
          return (
            <div key={file.slug} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-start gap-3">
                <span className="h-10 w-10 shrink-0 rounded-xl bg-navy-800 text-gold-400 flex items-center justify-center font-black text-sm">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-sm leading-6 text-navy-900">{file.title}</h3>
                  <p dir="ltr" className="text-left text-xs font-bold text-slate-500 truncate mt-1">
                    research-files/{file.filePath}
                  </p>
                </div>
                {file.exists ? (
                  <Badge className="bg-green-600 border-0"><CheckCircle2 className="h-3 w-3 ms-1" /> مرفوع</Badge>
                ) : (
                  <Badge className="bg-amber-500 border-0"><FileWarning className="h-3 w-3 ms-1" /> غير مرفوع</Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  type="button"
                  size="sm"
                  variant="whatsapp"
                  disabled={!enabled || !file.exists || busySlug === file.slug}
                  onClick={() => void createLink(file.slug)}
                >
                  {busySlug === file.slug ? <Loader2 className="animate-spin" /> : <Download />}
                  إنشاء رابط مباشر (5 دقائق)
                </Button>
                {signed && (
                  <>
                    <Button asChild size="sm">
                      <a href={signed.url} target="_blank" rel="noreferrer">
                        <ExternalLink /> فتح التحميل
                      </a>
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => void copyLink(file.slug, signed.url)}>
                      <Copy /> {copiedSlug === file.slug ? "تم النسخ" : "نسخ الرابط"}
                    </Button>
                  </>
                )}
              </div>

              {!file.exists && enabled && (
                <p className="text-[11px] leading-5 font-bold text-amber-700 mt-3">
                  ارفع هذا الملف في Supabase Storage داخل الحاوية الخاصة بالاسم نفسه تماماً، ثم اضغط «تحديث الحالة».
                </p>
              )}
              {signed && (
                <p className="text-[11px] leading-5 font-bold text-green-700 mt-3">
                  أُنشئ رابط آمن للملف <span dir="ltr">{signed.fileName}</span>، وينتهي بعد {Math.ceil(signed.expiresInSeconds / 60)} دقائق.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
