import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aiqvuywgavkykywnrkow.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcXZ1eXdnYXZreWt5d25ya293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4MzE3NDksImV4cCI6MjAzMTQwNzc0OX0.IqoZPy195Kv5wwQkXZN_rtDcT6r3sVSHo3_2o_3LubI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
