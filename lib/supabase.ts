import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase browser client (Auth / DB / Storage).
 * When env vars are missing the app runs fully in demo mode
 * with mock data + localStorage orders, so `npm run dev` works
 * out of the box. See supabase/schema.sql to go live.
 */
export const isSupabaseConfigured = Boolean(url && anon && !url.includes("your-project"));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anon as string)
  : null;
