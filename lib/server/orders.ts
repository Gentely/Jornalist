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

function splitStoragePath(path: string): {
  folder: string;
  fileName: string;
  safePath: string;
} {
  const safePath = assertSafeStoragePath(path);
  const lastSlash = safePath.lastIndexOf("/");
  return {
    safePath,
    folder: lastSlash >= 0 ? safePath.slice(0, lastSlash) : "",
    fileName: lastSlash >= 0 ? safePath.slice(lastSlash + 1) : safePath,
  };
}

async function listObjectNames(
  admin: SupabaseClient,
  bucket: string,
  folder: string,
): Promise<Set<string>> {
  // NOTE: deliberately no `search` option — listing the folder and matching
  // names ourselves avoids false negatives from the storage search filter.
  const { data, error } = await admin.storage.from(bucket).list(folder, {
    limit: 1000,
    offset: 0,
  });

  if (error) {
    // A missing bucket is an installation state the admin files checklist can
    // display usefully as "not uploaded" instead of failing the whole list.
    if (error.message.toLowerCase().includes("bucket not found")) return new Set();
    throw error;
  }
  return new Set((data || []).filter((object) => object.id).map((object) => object.name));
}

export async function storageObjectExists(
  admin: SupabaseClient,
  bucket: string,
  path: string,
): Promise<boolean> {
  const { folder, fileName } = splitStoragePath(path);
  const names = await listObjectNames(admin, bucket, folder);
  return names.has(fileName);
}

/**
 * Returns the subset of `paths` that currently exist in the bucket, using a
 * single list call per distinct folder instead of one call per file. The
 * admin files checklist uses this so a slow connection has far less work to
 * wait for.
 */
export async function storageExistingPaths(
  admin: SupabaseClient,
  bucket: string,
  paths: string[],
): Promise<Set<string>> {
  const folders = new Set<string>();
  const split = paths.map((path) => {
    const parts = splitStoragePath(path);
    folders.add(parts.folder);
    return parts;
  });

  const namesByFolder = new Map<string, Set<string>>();
  await Promise.all(
    [...folders].map(async (folder) => {
      namesByFolder.set(folder, await listObjectNames(admin, bucket, folder));
    }),
  );

  const existing = new Set<string>();
  for (const parts of split) {
    if (namesByFolder.get(parts.folder)?.has(parts.fileName)) {
      existing.add(parts.safePath);
    }
  }
  return existing;
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
