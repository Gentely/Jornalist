import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export async function getSupabaseAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch {
    return null;
  }
}

export async function getSupabaseSessionEmail(): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.email || null;
  } catch {
    return null;
  }
}
