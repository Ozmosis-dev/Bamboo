import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cookie-backed client for the admin: carries the owner's auth session so RLS
 * write policies apply. */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookie writes only work in
            // Server Actions / Route Handlers; safe to ignore here.
          }
        },
      },
    }
  );
}
