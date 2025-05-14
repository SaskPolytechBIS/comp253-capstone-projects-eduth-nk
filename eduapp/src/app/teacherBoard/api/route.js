import { supabase } from '@/lib/supabase'

export async function getTeacherClasses(teacherId) {
    let { data: Class, error } = await supabase
        .from('Class')
        .select("ClassID")
        .like('TeacherID', teacherId)

    if (Class == null) {
        return error
    } else {
        return Class
    }
}

export async function getTeacherName(teacherId) {
    const { data, error } = await supabase
        .from("TeacherLogin") //table name
        .select("Username")
        .eq("TeacherID", teacherId)
        .single();

    if (error) {
        console.error("Error fetching user name:", error);
        return null;
    }

    return data.name;
}
export async function getStudentsFromClass (classId) {
    let { data: Student, error } = await supabase
        .from('Student')
        .select('StudentID')
        .like('ClassID', classId)

    if (Student == null) {
        return error
    } else {
        return Student
    }
}

export async function getStudentNames (studentId) {
    let { data: Student, error } = await supabase
        .from('Student')
        .select('StudentName')
        .like('StudentID', studentId)

    if (Student == null) {
        return error
    } else {
        return Student
    }
}