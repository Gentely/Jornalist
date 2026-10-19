import {
  assertSafeStoragePath,
  storageObjectExists,
  type DbResearchFile,
} from "@/lib/server/orders";
import {
  HttpError,
  RESEARCH_FILES_BUCKET,
  errorResponse,
  jsonNoStore,
  requireAdmin,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Mirrors the research-files bucket limit declared in supabase/config.toml.
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
  ".pdf": "application/pdf",
};

function extensionOf(fileName: string): string {
  const lower = fileName.trim().toLowerCase();
  const dot = lower.lastIndexOf(".");
  return dot >= 0 ? lower.slice(dot) : "";
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const slug = decodeURIComponent(params.slug).trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new HttpError(400, "معرف البحث غير صالح.", "INVALID_RESEARCH_SLUG");
    }

    const { admin } = await requireAdmin(request);

    const { data, error } = await admin
      .from("researches")
      .select("id,slug,title,file_type,file_path")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new HttpError(404, "البحث غير موجود في قاعدة البيانات.", "RESEARCH_NOT_FOUND");
    }

    const research = data as DbResearchFile;
    // The stored database path is authoritative: the admin never has to rename
    // anything, and a browser can never pick an arbitrary storage destination.
    const targetPath = assertSafeStoragePath(research.file_path);
    const expectedExtension = extensionOf(targetPath);

    const form = await request.formData();
    const uploaded = form.get("file");
    if (!(uploaded instanceof File)) {
      throw new HttpError(400, "اختر ملف البحث أولاً.", "RESEARCH_FILE_REQUIRED");
    }
    if (extensionOf(uploaded.name) !== expectedExtension) {
      throw new HttpError(
        400,
        `نوع الملف لا يطابق المطلوب لهذا البحث (${expectedExtension.replace(".", "").toUpperCase()}).`,
        "RESEARCH_FILE_TYPE_MISMATCH",
      );
    }
    if (uploaded.size === 0) {
      throw new HttpError(400, "الملف المختار فارغ.", "RESEARCH_FILE_EMPTY");
    }
    if (uploaded.size > MAX_FILE_SIZE_BYTES) {
      throw new HttpError(400, "حجم الملف أكبر من الحد الأقصى (50MB).", "RESEARCH_FILE_TOO_LARGE");
    }

    const bytes = Buffer.from(await uploaded.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from(RESEARCH_FILES_BUCKET)
      .upload(targetPath, bytes, {
        contentType: CONTENT_TYPE_BY_EXTENSION[expectedExtension] || uploaded.type || undefined,
        cacheControl: "0",
        upsert: true,
      });
    if (uploadError) throw uploadError;

    const exists = await storageObjectExists(admin, RESEARCH_FILES_BUCKET, targetPath);

    return jsonNoStore({
      file: {
        slug: research.slug,
        title: research.title,
        fileType: research.file_type,
        filePath: research.file_path,
        exists,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
