import "dotenv/config"
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@lib/supabaseclient.ts'

export async function checkTeacherLogin(username, password) {

    const supabaseRead = supabase;

    let { data: TeacherLogin, error} = await supabaseRead
        .from('TeacherLogin')
        .select('TeacherID')
        .like('Username', username)
        .like('Password', password)

    if (TeacherLogin == null) {
        return error
    } else {
        return TeacherLogin
    }
}


export async function checkStudentLogin(username, password) {

    const supabaseRead = supabase;

    let { data: StudentLogin, error} = await supabaseRead
        .from('StudentLogin')
        .select('StudentID')
        .like('Username', username)
        .like('Password', password)

    if (StudentLogin == null) {
        return error
    } else {
        return StudentLogin
    }

}


