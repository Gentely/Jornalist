import { mapOrder, type DbOrder } from "@/lib/server/orders";
import {
  errorResponse,
  jsonNoStore,
  requireAdmin,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ORDER_SELECT = [
  "id",
  "user_id",
  "customer_name",
  "phone",
  "email",
  "total_lyd",
  "method",
  "status",
  "receipt_path",
  "note",
  "created_at",
  "access_token_hash",
  "order_items(price_lyd,researches(id,slug,title,file_type,file_path))",
].join(",");

export async function GET(request: Request) {
  try {
    const { admin, user } = await requireAdmin(request);

    const { data, error } = await admin
      .from("orders")
      .select(ORDER_SELECT)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return jsonNoStore({
      adminEmail: user.email || null,
      orders: ((data || []) as unknown as DbOrder[]).map(mapOrder),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
