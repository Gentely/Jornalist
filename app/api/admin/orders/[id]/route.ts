import { isUuid } from "@/lib/server/order-access";
import { getOrderById, mapOrder } from "@/lib/server/orders";
import {
  HttpError,
  errorResponse,
  jsonNoStore,
  requireAdmin,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set(["pending", "approved", "rejected"]);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    if (!isUuid(params.id)) {
      throw new HttpError(400, "رقم الطلب غير صالح.", "INVALID_ORDER_ID");
    }

    const { admin } = await requireAdmin(request);

    let status = "";
    try {
      const body = (await request.json()) as { status?: unknown };
      status = typeof body.status === "string" ? body.status : "";
    } catch {
      throw new HttpError(400, "لم تصل حالة الطلب الجديدة.", "MISSING_STATUS");
    }

    if (!ALLOWED_STATUSES.has(status)) {
      throw new HttpError(400, "حالة الطلب المطلوبة غير مدعومة.", "INVALID_STATUS");
    }

    const { error } = await admin
      .from("orders")
      .update({ status })
      .eq("id", params.id);

    if (error) throw error;

    const order = await getOrderById(admin, params.id);
    return jsonNoStore({ order: mapOrder(order) });
  } catch (error) {
    return errorResponse(error);
  }
}
