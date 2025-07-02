import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );

export default createClient()