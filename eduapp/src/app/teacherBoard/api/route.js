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

export async function createStudent(studentName, studentClass, studentUsername, studentPassword) {
    const { data, error } = await supabase
        .from('Student')
        .insert([
            { StudentName: `${studentName}`, ClassID: `${studentClass}`}
        ])
        .select('StudentID')
        .single()

    console.log(data)
    if (error) {
        console.log("Error inserting student: " + error.message);
    } else {
        await createStudentLogin(data.StudentID, studentUsername, studentPassword)
    }

}

async function createStudentLogin(studentId, studentUsername, studentPassword){
    const { data, error } = await supabase
        .from('StudentLogin')
        .insert([
            { StudentID: `${studentId}`, Username: `${studentUsername}`, Password: `${studentPassword}` },
        ])
        .select()

    if (error) {
        console.log("Error inserting student login: " + error.message)
    } else {
        return data;
    }
}

export async function getAllTeachers() {
    
}