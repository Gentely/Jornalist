import type { SupabaseClient } from "@supabase/supabase-js";
import type { Order } from "@/lib/data";
import {
  HttpError,
  RESEARCH_FILES_BUCKET,
  getRequestUser,
  isAdminUser,
} from "@/lib/server/supabase-admin";
import {
  ORDER_ACCESS_TOKEN_HEADER,
  isUuid,
  verifyOrderAccessToken,
} from "@/lib/server/order-access";

export interface DbResearchFile {
  id: string;
  slug: string;
  title: string;
  file_type: string;
  file_path: string;
  price_lyd?: number | string;
}

interface DbOrderItem {
  price_lyd: number | string;
  researches: DbResearchFile | DbResearchFile[] | null;
}

export interface DbOrder {
  id: string;
  user_id: string | null;
  customer_name: string;
  phone: string;
  email: string;
  total_lyd: number | string;
  method: "bank" | "whatsapp";
  status: "pending" | "approved" | "rejected";
  receipt_path: string | null;
  note: string | null;
  created_at: string;
  access_token_hash: string | null;
  order_items?: DbOrderItem[] | null;
}

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

function oneResearch(item: DbOrderItem): DbResearchFile | null {
  if (Array.isArray(item.researches)) return item.researches[0] || null;
  return item.researches;
}

export function mapOrder(row: DbOrder): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    items: (row.order_items || []).flatMap((item) => {
      const research = oneResearch(item);
      if (!research) return [];
      return [
        {
          id: research.slug,
          title: research.title,
          priceLYD: Number(item.price_lyd),
          fileType: research.file_type,
        },
      ];
    }),
    totalLYD: Number(row.total_lyd),
    method: row.method,
    status: row.status,
    receiptName: row.receipt_path ? "إيصال مرفوع إلى التخزين الخاص" : undefined,
    hasReceipt: Boolean(row.receipt_path),
    backend: "supabase",
    createdAt: row.created_at,
    note: row.note || undefined,
  };
}

export async function getOrderById(
  admin: SupabaseClient,
  orderId: string,
): Promise<DbOrder> {
  if (!isUuid(orderId)) {
    throw new HttpError(400, "رقم الطلب غير صالح.", "INVALID_ORDER_ID");
  }

  const { data, error } = await admin
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new HttpError(404, "الطلب غير موجود أو لا يمكن الوصول إليه.", "ORDER_NOT_FOUND");
  }

  return data as unknown as DbOrder;
}

export async function userCanAccessOrder(
  admin: SupabaseClient,
  request: Request,
  order: DbOrder,
): Promise<boolean> {
  const suppliedToken = request.headers.get(ORDER_ACCESS_TOKEN_HEADER);
  if (verifyOrderAccessToken(suppliedToken, order.access_token_hash)) {
    return true;
  }

  const user = await getRequestUser(admin, request);
  if (!user) return false;
  if (order.user_id && order.user_id === user.id) return true;
  return isAdminUser(admin, user.id);
}

export async function getAccessibleOrder(
  admin: SupabaseClient,
  request: Request,
  orderId: string,
): Promise<DbOrder> {
  const order = await getOrderById(admin, orderId);

  if (!(await userCanAccessOrder(admin, request, order))) {
    // Use the same response as a missing order so order IDs cannot be used to
    // enumerate another customer's purchase.
    throw new HttpError(404, "الطلب غير موجود أو لا يمكن الوصول إليه.", "ORDER_NOT_FOUND");
  }

  return order;
}

export function assertSafeStoragePath(path: string): string {
  const normalized = path.trim().replace(/\\/g, "/");

  if (
    !normalized ||
    normalized.startsWith("/") ||
    normalized.length > 512 ||
    normalized.split("/").some((segment) => !segment || segment === "." || segment === "..")
  ) {
    throw new HttpError(500, "مسار الملف المسجل في قاعدة البيانات غير صالح.", "INVALID_FILE_PATH");
  }

  return normalized;
}

export async function storageObjectExists(
  admin: SupabaseClient,
  bucket: string,
  path: string,
): Promise<boolean> {
  const safePath = assertSafeStoragePath(path);
  const lastSlash = safePath.lastIndexOf("/");
  const folder = lastSlash >= 0 ? safePath.slice(0, lastSlash) : "";
  const fileName = lastSlash >= 0 ? safePath.slice(lastSlash + 1) : safePath;

  const { data, error } = await admin.storage.from(bucket).list(folder, {
    limit: 100,
    offset: 0,
    search: fileName,
  });

  if (error) {
    // A missing bucket is an installation state the admin files checklist can
    // display usefully as "not uploaded" instead of failing the whole list.
    if (error.message.toLowerCase().includes("bucket not found")) return false;
    throw error;
  }
  return Boolean(data?.some((object) => object.name === fileName && object.id));
}

export async function createSignedDownloadUrl(
  admin: SupabaseClient,
  bucket: string,
  path: string,
  expiresInSeconds = 300,
): Promise<{ url: string; fileName: string; expiresInSeconds: number }> {
  const safePath = assertSafeStoragePath(path);
  const fileName = safePath.split("/").pop() || "download";

  if (!(await storageObjectExists(admin, bucket, safePath))) {
    throw new HttpError(
      404,
      `الملف «${fileName}» غير مرفوع بعد إلى حاوية Supabase الخاصة.`,
      "FILE_NOT_UPLOADED",
    );
  }

  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUrl(safePath, expiresInSeconds, { download: fileName });

  if (error || !data?.signedUrl) {
    throw error || new Error("Supabase did not return a signed URL");
  }

  return { url: data.signedUrl, fileName, expiresInSeconds };
}

export async function createResearchSignedDownloadUrl(
  admin: SupabaseClient,
  research: DbResearchFile,
  expiresInSeconds = 300,
) {
  return createSignedDownloadUrl(
    admin,
    RESEARCH_FILES_BUCKET,
    research.file_path,
    expiresInSeconds,
  );
}
