//creates connection to supabase
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://teihpfddelngadtkdtaz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let { data: Student, error } = await supabase
    .from('Student')
    .select('StudentID')

let { data: Student, error } = await supabase
    .from('Student')
    .select('StudentName')

let { data: Student, error } = await supabase
    .from('Student')
    .select('ClassID')