import { supabase } from '@/lib/supabase'

export async function getTeacherClasses(teacherId) {
    let { data: Class, error } = await supabase
        .from('Class')
        .select('ClassID, ClassName')
        .eq('TeacherID', teacherId);

    if (Class == null) {
        return error
    } else {
        return Class
    }
}

export async function getStudentsFromClass (classId) {
    let { data: Student, error } = await supabase
        .from('Student')
        .select('StudentID,StudentName')
        .eq('ClassID', classId);

    if (Student == null) {
        return error
    } else {
        return Student
    }
}