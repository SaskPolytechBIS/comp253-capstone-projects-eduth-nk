import "dotenv/config"
import { createClient } from '@supabase/supabase-js'

export async function checkTeacherLogin(username, password) {

    const supabaseUrl = 'https://teihpfddelngadtkdtaz.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaWhwZmRkZWxuZ2FkdGtkdGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzgyNjczNSwiZXhwIjoyMDU5NDAyNzM1fQ.NDmyjwJgge_OGL41Bkze09OgF_6XDE61rCtr_jVRCqo"
    const supabase = createClient(supabaseUrl, supabaseKey);

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

    const supabaseUrl = 'https://teihpfddelngadtkdtaz.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaWhwZmRkZWxuZ2FkdGtkdGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzgyNjczNSwiZXhwIjoyMDU5NDAyNzM1fQ.NDmyjwJgge_OGL41Bkze09OgF_6XDE61rCtr_jVRCqo";
    const supabase = createClient(supabaseUrl, supabaseKey);

    let { data: StudentLogin, error} = await supabase
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

checkStudentLogin("hello", "654321").then( value => {
    console.log(value[0])
})


