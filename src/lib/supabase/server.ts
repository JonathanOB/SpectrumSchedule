import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Server-side client using the service role key (bypasses RLS).
// Only call this from Server Components and Server Actions — never expose to the browser.
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}
