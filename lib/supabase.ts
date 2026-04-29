import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://votbnaykwrljywzpwpul.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdGJuYXlrd3Jsanl3enB3cHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTU1OTMsImV4cCI6MjA5MzAzMTU5M30.3bGc9p146U-qpeqlEE_UpZ4tovjfSJzl0eobfJjKJ7k";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
