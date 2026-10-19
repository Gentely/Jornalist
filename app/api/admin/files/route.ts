import { storageObjectExists, type DbResearchFile } from "@/lib/server/orders";
import {
  RESEARCH_FILES_BUCKET,
  errorResponse,
  jsonNoStore,
  requireAdmin,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { admin } = await requireAdmin(request);

    const { data, error } = await admin
      .from("researches")
      .select("id,slug,title,file_type,file_path")
      .order("created_at", { ascending: true });

    if (error) throw error;

    const researches = (data || []) as DbResearchFile[];
    const files = await Promise.all(
      researches.map(async (research) => ({
        slug: research.slug,
        title: research.title,
        fileType: research.file_type,
        filePath: research.file_path,
        exists: await storageObjectExists(admin, RESEARCH_FILES_BUCKET, research.file_path),
      })),
    );

    return jsonNoStore({ bucket: RESEARCH_FILES_BUCKET, files });
  } catch (error) {
    return errorResponse(error);
  }
}
