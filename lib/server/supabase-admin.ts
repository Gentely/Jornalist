import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const RESEARCH_FILES_BUCKET = "research-files";
export const RECEIPTS_BUCKET = "receipts";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export class BackendNotConfiguredError extends Error {
  readonly code = "BACKEND_NOT_CONFIGURED";
  readonly status = 503;

  constructor() {
    super("خدمة الطلبات والتحميلات الآمنة غير مهيأة بعد على هذا النشر.");
    this.name = "BackendNotConfiguredError";
  }
}

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, message: string, code = "REQUEST_FAILED") {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
  }
}

export function isSupabaseBackendConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseSecretKey &&
      !supabaseUrl.includes("your-project") &&
      !supabaseSecretKey.includes("your-"),
  );
}

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Trusted server-only Supabase client.
 *
 * The secret/service-role key bypasses RLS, so this module must only be
 * imported by Next.js Route Handlers or other server code. Every route using
 * it performs its own user/admin/order-token authorization first.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!isSupabaseBackendConfigured()) {
    throw new BackendNotConfiguredError();
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(supabaseUrl as string, supabaseSecretKey as string, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });
  }

  return cachedAdminClient;
}

export function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization) return null;
  const [scheme, token] = authorization.split(/\s+/, 2);
  return scheme?.toLowerCase() === "bearer" && token ? token : null;
}

export async function getRequestUser(
  admin: SupabaseClient,
  request: Request,
): Promise<User | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function isAdminUser(admin: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return !error && data?.role === "admin";
}

export async function requireAdmin(request: Request): Promise<{
  admin: SupabaseClient;
  user: User;
}> {
  const admin = getSupabaseAdminClient();
  const user = await getRequestUser(admin, request);

  if (!user) {
    throw new HttpError(401, "سجّل الدخول بحساب المدير أولاً.", "ADMIN_LOGIN_REQUIRED");
  }

  if (!(await isAdminUser(admin, user.id))) {
    throw new HttpError(403, "هذا الحساب ليس له دور مدير في جدول profiles.", "ADMIN_ROLE_REQUIRED");
  }

  return { admin, user };
}

export function jsonNoStore(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      Pragma: "no-cache",
    },
  });
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof BackendNotConfiguredError) {
    return jsonNoStore({ error: error.message, code: error.code }, error.status);
  }

  if (error instanceof HttpError) {
    return jsonNoStore({ error: error.message, code: error.code }, error.status);
  }

  console.error("Supabase backend request failed", error);
  return jsonNoStore(
    { error: "حدث خطأ غير متوقع في الخادم. حاول مرة أخرى أو تواصل مع الإدارة.", code: "INTERNAL_ERROR" },
    500,
  );
}
