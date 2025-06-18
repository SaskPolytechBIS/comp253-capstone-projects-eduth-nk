import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://odrybkhmbqqpetshcupz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kcnlia2htYnFxcGV0c2hjdXB6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTEzNjkyNiwiZXhwIjoyMDY0NzEyOTI2fQ.pGKj4MMtPV6VshHGJCZ9nm-fLNVd2ue_jaIDB06wC8I'
export const supabase = createClient(supabaseUrl, supabaseKey);
