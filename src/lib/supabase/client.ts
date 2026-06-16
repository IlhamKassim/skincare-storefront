import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === 'your-supabase-url') {
    // Return a dummy client or handle as needed for Demo Mode
    return {} as any;
  }

  return createBrowserClient(url, key)
}
