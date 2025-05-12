//creates connection to supabase
import 'dotenv/config'
import { supabase } from '@/lib/supabase'

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