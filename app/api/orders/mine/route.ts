import {
  HttpError,
  errorResponse,
  getRequestUser,
  getSupabaseAdminClient,
  jsonNoStore,
} from "@/lib/server/supabase-admin";
import { mapOrder, type DbOrder } from "@/lib/server/orders";

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
    const admin = getSupabaseAdminClient();
    const user = await getRequestUser(admin, request);
    if (!user) {
      throw new HttpError(401, "سجّل الدخول لعرض طلبات حسابك.", "LOGIN_REQUIRED");
    }

    const { data, error } = await admin
      .from("orders")
      .select(ORDER_SELECT)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return jsonNoStore({ orders: ((data || []) as unknown as DbOrder[]).map(mapOrder) });
  } catch (error) {
    return errorResponse(error);
  }
}
