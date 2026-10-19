import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Supabase's current dashboards issue a Publishable key (sb_publishable_...).
// Older projects may expose the equivalent legacy anon key instead.
const publicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase browser client (Auth / DB / Storage).
 * Only a Publishable/legacy anon key may be used here; a secret key must
 * never be placed in a NEXT_PUBLIC_* variable. When env vars are missing the
 * app runs in demo mode with local data so `npm run dev` works out of the box.
 * See supabase/schema.sql to go live.
 */
export const isSupabaseConfigured = Boolean(
  url &&
    publicKey &&
    !url.includes("your-project") &&
    !publicKey.includes("your-") &&
    !publicKey.startsWith("sb_secret_"),
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, publicKey as string)
  : null;
