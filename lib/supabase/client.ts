import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://amyzbfafqdbmoyhvrkxm.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFteXpiZmFmcWRibW95aHZya3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzI3OTIsImV4cCI6MjA5MTg0ODc5Mn0.lfnjVn2ebylPV50ZuUThbqIfWespYnLb-FZT8o2hbeM";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
