import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://qpztyzhosqbmzptazlnx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwenR5emhvc3FibXpwdGF6bG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MzcwMzIsImV4cCI6MjA1NDQxMzAzMn0.QHoczPirwGF3tORYqytBEXYBdj7AKRGJM8aBT1Pu-d8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
