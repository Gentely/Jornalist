import { storageExistingPaths, type DbResearchFile } from "@/lib/server/orders";
import {
  RESEARCH_FILES_BUCKET,
  errorResponse,
  jsonNoStore,
  requireAdmin,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { admin } = await requireAdmin(request);

    const { data, error } = await admin
      .from("researches")
      .select("id,slug,title,file_type,file_path")
      .order("created_at", { ascending: true });

    if (error) throw error;

    const researches = (data || []) as DbResearchFile[];
    // One storage list per folder (the bucket root here) instead of one call
    // per research: faster responses survive weak mobile connections better.
    const existing = await storageExistingPaths(
      admin,
      RESEARCH_FILES_BUCKET,
      researches.map((research) => research.file_path),
    );

    const files = researches.map((research) => ({
      slug: research.slug,
      title: research.title,
      fileType: research.file_type,
      filePath: research.file_path,
      exists: existing.has(research.file_path.trim().replace(/\\/g, "/")),
    }));

    return jsonNoStore({ bucket: RESEARCH_FILES_BUCKET, files });
  } catch (error) {
    return errorResponse(error);
  }
}
