import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aiqvuywgavkykywnrkow.supabase.co";
const supabaseKey = process.env.SUPA_BASE_KEY;
const supabase = createClient(
  supabaseUrl,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcXZ1eXdnYXZreWt5d25ya293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4MzE3NDksImV4cCI6MjAzMTQwNzc0OX0.IqoZPy195Kv5wwQkXZN_rtDcT6r3sVSHo3_2o_3LubI"
);

export default supabase;
