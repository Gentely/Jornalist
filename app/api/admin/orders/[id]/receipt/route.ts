import {
  assertSafeStoragePath,
  getOrderById,
  storageObjectExists,
} from "@/lib/server/orders";
import {
  HttpError,
  RECEIPTS_BUCKET,
  errorResponse,
  jsonNoStore,
  requireAdmin,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECEIPT_URL_EXPIRES_IN_SECONDS = 300;

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { admin } = await requireAdmin(request);
    const order = await getOrderById(admin, params.id);

    if (!order.receipt_path) {
      throw new HttpError(404, "لا يوجد إيصال مرفوع لهذا الطلب.", "RECEIPT_NOT_FOUND");
    }

    const receiptPath = assertSafeStoragePath(order.receipt_path);
    if (!(await storageObjectExists(admin, RECEIPTS_BUCKET, receiptPath))) {
      throw new HttpError(404, "ملف الإيصال المسجل غير موجود في التخزين الخاص.", "RECEIPT_NOT_FOUND");
    }

    const { data, error } = await admin.storage
      .from(RECEIPTS_BUCKET)
      .createSignedUrl(receiptPath, RECEIPT_URL_EXPIRES_IN_SECONDS);

    if (error || !data?.signedUrl) {
      throw error || new Error("Supabase did not return a receipt signed URL");
    }

    return jsonNoStore({
      url: data.signedUrl,
      expiresInSeconds: RECEIPT_URL_EXPIRES_IN_SECONDS,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
