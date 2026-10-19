import {
  createResearchSignedDownloadUrl,
  type DbResearchFile,
} from "@/lib/server/orders";
import {
  HttpError,
  errorResponse,
  jsonNoStore,
  requireAdmin,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SIGNED_URL_EXPIRES_IN_SECONDS = 300;

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
    const signed = await createResearchSignedDownloadUrl(
      admin,
      research,
      SIGNED_URL_EXPIRES_IN_SECONDS,
    );

    return jsonNoStore({ ...signed, slug: research.slug, title: research.title });
  } catch (error) {
    return errorResponse(error);
  }
}
