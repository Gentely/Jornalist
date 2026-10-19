import { getAccessibleOrder, mapOrder } from "@/lib/server/orders";
import {
  errorResponse,
  getSupabaseAdminClient,
  jsonNoStore,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const admin = getSupabaseAdminClient();
    const order = await getAccessibleOrder(admin, request, params.id);
    return jsonNoStore({ order: mapOrder(order) });
  } catch (error) {
    return errorResponse(error);
  }
}
