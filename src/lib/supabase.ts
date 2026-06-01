import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://abilvnpxcijywerkubrt.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWx2bnB4Y2lqeXdlcmt1YnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzQ0OTcsImV4cCI6MjA5NTA1MDQ5N30.n1fctipjHzSGrf4NFKicESWhe7nlIFa0k0oz-4kG2LU";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );