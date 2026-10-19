import { randomUUID } from "node:crypto";
import type { Order } from "@/lib/data";
import {
  createOrderAccessToken,
  hashOrderAccessToken,
} from "@/lib/server/order-access";
import {
  HttpError,
  RECEIPTS_BUCKET,
  errorResponse,
  getBearerToken,
  getRequestUser,
  getSupabaseAdminClient,
  jsonNoStore,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_RECEIPT_BYTES = 10 * 1024 * 1024;
const RECEIPT_MIME_TO_EXTENSION: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/gif": ".gif",
  "image/heic": ".heic",
  "image/heif": ".heif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const EXTENSION_TO_MIME: Record<string, string> = Object.fromEntries(
  Object.entries(RECEIPT_MIME_TO_EXTENSION).map(([mime, extension]) => [extension, mime]),
);

interface DbResearch {
  id: string;
  slug: string;
  title: string;
  file_type: string;
  price_lyd: number | string;
}

function requiredText(form: FormData, name: string, label: string, maxLength: number): string {
  const value = String(form.get(name) || "").trim();
  if (!value) throw new HttpError(400, `فضلاً أدخل ${label}.`, "MISSING_FIELD");
  if (value.length > maxLength) {
    throw new HttpError(400, `${label} أطول من الحد المسموح.`, "FIELD_TOO_LONG");
  }
  return value;
}

function parseSlugs(form: FormData): string[] {
  const raw = form.get("items");
  if (typeof raw !== "string") {
    throw new HttpError(400, "لم تصل قائمة البحوث المطلوبة.", "MISSING_ITEMS");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new HttpError(400, "قائمة البحوث المطلوبة غير صالحة.", "INVALID_ITEMS");
  }

  if (!Array.isArray(parsed)) {
    throw new HttpError(400, "قائمة البحوث المطلوبة غير صالحة.", "INVALID_ITEMS");
  }

  const slugs = [...new Set(parsed.map((item) => String(item).trim()).filter(Boolean))];
  if (slugs.length === 0 || slugs.length > 20) {
    throw new HttpError(400, "اختر من بحث واحد إلى 20 بحثاً في الطلب الواحد.", "INVALID_ITEM_COUNT");
  }
  if (slugs.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
    throw new HttpError(400, "أحد معرفات البحوث المطلوبة غير صالح.", "INVALID_RESEARCH_SLUG");
  }

  return slugs;
}

function getReceiptDetails(receipt: FormDataEntryValue | null): {
  file: File;
  extension: string;
  contentType: string;
} {
  if (!(receipt instanceof File) || receipt.size === 0) {
    throw new HttpError(400, "رفع صورة إيصال التحويل إلزامي لإتمام الطلب المصرفي.", "RECEIPT_REQUIRED");
  }

  if (receipt.size > MAX_RECEIPT_BYTES) {
    throw new HttpError(413, "حجم الإيصال أكبر من 10 ميغابايت.", "RECEIPT_TOO_LARGE");
  }

  const nameExtension = receipt.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] || "";
  const normalizedExtension = nameExtension === ".jpeg" ? ".jpg" : nameExtension;
  const extension =
    RECEIPT_MIME_TO_EXTENSION[receipt.type] ||
    (EXTENSION_TO_MIME[normalizedExtension] ? normalizedExtension : "");
  const contentType = extension ? EXTENSION_TO_MIME[extension] : "";

  if (!extension || !contentType) {
    throw new HttpError(
      415,
      "صيغة الإيصال غير مدعومة. استخدم JPG أو PNG أو WebP أو GIF أو HEIC أو PDF.",
      "UNSUPPORTED_RECEIPT_TYPE",
    );
  }

  return { file: receipt, extension, contentType };
}

export async function POST(request: Request) {
  let orderId: string | null = null;
  let uploadedReceiptPath: string | null = null;

  try {
    const admin = getSupabaseAdminClient();

    // A supplied customer session must be valid; silently downgrading an
    // expired/forged token to a guest order would make account purchases
    // disappear from that customer's account.
    const suppliedBearer = getBearerToken(request);
    const authenticatedUser = suppliedBearer ? await getRequestUser(admin, request) : null;
    if (suppliedBearer && !authenticatedUser) {
      throw new HttpError(401, "انتهت جلسة تسجيل الدخول. سجّل الدخول مجدداً أو أعد تحميل الصفحة.", "INVALID_SESSION");
    }

    const form = await request.formData();
    const customerName = requiredText(form, "customerName", "الاسم الكامل", 160);
    const phone = requiredText(form, "phone", "رقم الهاتف", 40);
    const email = requiredText(form, "email", "البريد الإلكتروني", 254).toLowerCase();
    const noteValue = String(form.get("note") || "").trim();
    if (noteValue.length > 1000) {
      throw new HttpError(400, "الملاحظة أطول من الحد المسموح.", "FIELD_TOO_LONG");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpError(400, "البريد الإلكتروني غير صالح.", "INVALID_EMAIL");
    }

    const slugs = parseSlugs(form);
    const receiptDetails = getReceiptDetails(form.get("receipt"));

    const { data: researchRows, error: researchError } = await admin
      .from("researches")
      .select("id,slug,title,file_type,price_lyd")
      .in("slug", slugs);

    if (researchError) throw researchError;

    const bySlug = new Map(
      ((researchRows || []) as DbResearch[]).map((research) => [research.slug, research]),
    );
    const missing = slugs.filter((slug) => !bySlug.has(slug));
    if (missing.length > 0) {
      throw new HttpError(
        400,
        "بعض البحوث المختارة غير موجودة في قاعدة بيانات Supabase بعد. تحقق من تطبيق ترحيل بيانات الدفعة الأولى.",
        "RESEARCH_NOT_IN_DATABASE",
      );
    }

    const orderedResearch = slugs.map((slug) => bySlug.get(slug) as DbResearch);
    const total = Math.round(
      orderedResearch.reduce((sum, research) => sum + Number(research.price_lyd), 0) * 100,
    ) / 100;

    orderId = randomUUID();
    const accessToken = createOrderAccessToken();
    const createdAt = new Date().toISOString();

    const { error: orderError } = await admin.from("orders").insert({
      id: orderId,
      user_id: authenticatedUser?.id || null,
      customer_name: customerName,
      phone,
      email,
      total_lyd: total,
      method: "bank",
      status: "pending",
      receipt_path: null,
      access_token_hash: hashOrderAccessToken(accessToken),
      note: noteValue || null,
    });
    if (orderError) throw orderError;

    const { error: itemsError } = await admin.from("order_items").insert(
      orderedResearch.map((research) => ({
        order_id: orderId,
        research_id: research.id,
        price_lyd: Number(research.price_lyd),
      })),
    );
    if (itemsError) throw itemsError;

    uploadedReceiptPath = `${orderId}/${randomUUID()}${receiptDetails.extension}`;
    const receiptBytes = Buffer.from(await receiptDetails.file.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from(RECEIPTS_BUCKET)
      .upload(uploadedReceiptPath, receiptBytes, {
        cacheControl: "3600",
        contentType: receiptDetails.contentType,
        upsert: false,
      });
    if (uploadError) throw uploadError;

    const { error: receiptUpdateError } = await admin
      .from("orders")
      .update({ receipt_path: uploadedReceiptPath })
      .eq("id", orderId);
    if (receiptUpdateError) throw receiptUpdateError;

    const order: Order = {
      id: orderId,
      customerName,
      phone,
      email,
      items: orderedResearch.map((research) => ({
        id: research.slug,
        title: research.title,
        priceLYD: Number(research.price_lyd),
        fileType: research.file_type,
      })),
      totalLYD: total,
      method: "bank",
      status: "pending",
      receiptName: receiptDetails.file.name,
      hasReceipt: true,
      backend: "supabase",
      accessToken,
      createdAt,
      note: noteValue || undefined,
    };

    return jsonNoStore({ order }, 201);
  } catch (error) {
    // Storage and Postgres cannot share one transaction; remove the partial
    // order/object so a failed checkout never appears as a payable order.
    if (orderId) {
      try {
        const admin = getSupabaseAdminClient();
        if (uploadedReceiptPath) {
          await admin.storage.from(RECEIPTS_BUCKET).remove([uploadedReceiptPath]);
        }
        await admin.from("orders").delete().eq("id", orderId);
      } catch (cleanupError) {
        console.error("Failed to clean up a partial Supabase order", cleanupError);
      }
    }

    return errorResponse(error);
  }
}
