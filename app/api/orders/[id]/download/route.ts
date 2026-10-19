import {
  createResearchSignedDownloadUrl,
  getAccessibleOrder,
  type DbResearchFile,
} from "@/lib/server/orders";
import {
  HttpError,
  errorResponse,
  getSupabaseAdminClient,
  jsonNoStore,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIGNED_URL_EXPIRES_IN_SECONDS = 300;

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const admin = getSupabaseAdminClient();
    const order = await getAccessibleOrder(admin, request, params.id);

    if (order.status !== "approved") {
      throw new HttpError(
        403,
        order.status === "pending"
          ? "طلبك ما يزال قيد المراجعة؛ سيُفتح التحميل بعد اعتماد الإدارة."
          : "هذا الطلب مرفوض، لذلك التحميل غير متاح.",
        "ORDER_NOT_APPROVED",
      );
    }

    let slug = "";
    try {
      const body = (await request.json()) as { slug?: unknown };
      slug = typeof body.slug === "string" ? body.slug.trim() : "";
    } catch {
      throw new HttpError(400, "لم يصل معرف البحث المطلوب تحميله.", "MISSING_RESEARCH_SLUG");
    }

    const research = (order.order_items || [])
      .map((item) =>
        Array.isArray(item.researches) ? item.researches[0] : item.researches,
      )
      .find((item): item is DbResearchFile => Boolean(item && item.slug === slug));

    if (!research) {
      throw new HttpError(404, "هذا البحث ليس ضمن عناصر طلبك المعتمد.", "RESEARCH_NOT_IN_ORDER");
    }

    const signed = await createResearchSignedDownloadUrl(
      admin,
      research,
      SIGNED_URL_EXPIRES_IN_SECONDS,
    );

    return jsonNoStore({
      ...signed,
      slug: research.slug,
      title: research.title,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
