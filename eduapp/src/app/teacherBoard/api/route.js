//creates connection to supabase
import 'dotenv/config'

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://teihpfddelngadtkdtaz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY_SECRET
const supabase = createClient(supabaseUrl, supabaseKey)

export async function getStudent() {
    let {data: Student, error} = await supabase
        .from('Student')
        .select('StudentID')

    if(Student == null) {
        return error;
    } else {
        return Student;
    }
}

export async function getStudentName() {
        let { data: Student, error } = await supabase
            .from('Student')
            .select('StudentName')
        return Student;
}

getStudent().then(value => {
    console.log(value)});

getStudentName().then(value => {
    console.log(value)});