import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aiqvuywgavkykywnrkow.supabase.co";
const supabaseKey = process.env.SUPA_BASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
