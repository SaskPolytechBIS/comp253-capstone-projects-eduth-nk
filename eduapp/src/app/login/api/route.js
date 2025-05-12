import { supabase } from '@/lib/supabase'

export async function checkTeacherLogin(username, password) {

    let { data: TeacherLogin, error} = await supabase
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

    let {data: StudentLogin, error} = await supabase
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


