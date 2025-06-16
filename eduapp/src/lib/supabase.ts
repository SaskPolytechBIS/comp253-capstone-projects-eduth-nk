import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://odrybkhmbqqpetshcupz.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kcnlia2htYnFxcGV0c2hjdXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzY5MjYsImV4cCI6MjA2NDcxMjkyNn0.qFmDVfAXMmPVt9i9wMmLdB7bvM5ee05qnwoIToFuBZ0';

export const supabase = createClient(supabaseUrl, supabaseKey);


