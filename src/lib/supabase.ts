import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://abcdefgh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIs..."
export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );