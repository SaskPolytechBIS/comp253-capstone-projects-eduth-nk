import {supabase} from "./supabase";

export async function getTeacherClasses(teacherId) {
    let { data: Class, error } = await supabase
        .from('Class')
        .select('ClassID, ClassName')
        .eq('TeacherID', teacherId);

    if (error) {
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

    if (error) {
        return error
    } else {
        return Student
    }
}

export async function getClassFromStudent (studentId) {
    let { data: Class, error } = await supabase
        .from('Student')
        .select('ClassID')
        .eq('StudentID', studentId)

    if (error) {
        console.error("Error retrieving class: " + error.message)
    } else {
        let { data: NewClass, error } = await supabase
            .from('Class')
            .select('ClassID, ClassName, TeacherID')
            .eq('ClassID', Class[0].ClassID)
        if (error){
            console.error("Error retrieving class: " + error.message)
        } else {
            return NewClass;
        }
    }
}

export async function getAllTeachers() {

    let { data: Teacher, error } = await supabase
        .from('Teacher')
        .select('TeacherID,TeacherName')

    if (error) {
        console.error("Error retrieving teachers: " + error.message)
    } else {
        return Teacher;
    }
}

export async function getUnits(classId) {
    let { data: Units, error } = await supabase
        .from('Units')
        .select('UnitID,UnitName')
        .eq('ClassID', classId)

    if (error) {
        console.error("Error retrieving units: " + error.message);
    } else {
        return Units
    }
}

export async function getTeacherName(teacherId){
    let {data: TeacherName, error} = await supabase
        .from('Teacher')
        .select('TeacherName')
        .eq('TeacherID', teacherId)

    if (error) {
        console.error("Error retrieiving teacher name: " + error.message)
    } else {
        return TeacherName
    }
}

export async function getAssignment(assignmentId) {
    let { data: Assignment, error } = await supabase
        .from('Assignment')
        .select('StudentID,AssignmentFolder,UnitId, JSON')
        .eq('AssignmentID', `${assignmentId}`)

    if (error) {
        console.error("Error retrieving assignments: " + error.message)
    } else {
        return Assignment
    }

}