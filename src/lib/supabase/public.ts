import { createClient } from "@supabase/supabase-js";

/** Anon-key client for public reads (RLS allows select only). Safe to use at
 * build time — no cookies or session involved. */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
