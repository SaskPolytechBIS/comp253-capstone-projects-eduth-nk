import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://teihpfddelngadtkdtaz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaWhwZmRkZWxuZ2FkdGtkdGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjY3MzUsImV4cCI6MjA1OTQwMjczNX0.CVW96OJJR2fmpM0PXityo8yIvxqWtIrrUILD6gFHFgQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
