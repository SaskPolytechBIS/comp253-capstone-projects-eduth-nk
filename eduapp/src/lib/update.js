import {supabase} from "./supabase";

export async function updateClass(classId, className, teacherId) {
    const { data, error } = await supabase
        .from('Class')
        .update({ ClassName: `${className}`, TeacherID: `${teacherId}` })
        .eq('ClassID', `${classId}`)
        .select()

    if (error) {
        console.log("Error updating classes: " + error.message);
    }
}

export async function updateStudent(studentId, studentName, classId, studentUsername, studentPassword) {
    const { data, error } = await supabase
        .from('Student')
        .update({ StudentName: `${studentName}`, ClassID: `${classId}` })
        .eq('StudentID', `${studentId}`)
        .select('StudentID')

    if (error) {
        console.log("Error updating student: " + error.message);
    } else {
        updateStudentLogin(studentId, studentUsername, studentPassword)
    }
}

async function updateStudentLogin(studentId, studentUsername, studentPassword) {
    const { data, error } = await supabase
        .from('StudentLogin')
        .update({ Username: `${studentUsername}`, Password: `${studentPassword}`})
        .eq('StudentID', `${studentId}`)
        .select()

    if (error) {
        console.log("Error updating student login: " + error.message)
    }
}

export async function updateUnit(unitId, unitName) {
    const { data, error } = await supabase
        .from('Units')
        .update({ UnitName: `${unitName}` })
        .eq('UnitID', `${unitId}`)
        .select()

    if (error) {
        console.log("Error updating unit: " + error.message)
    }
}

export async function updateAssignment (assignmentId, JSON) {

    const { data, error } = await supabase
        .from('Assignment')
        .update({ JSON: `${JSON}` })
        .eq('AssignmentID', `${assignmentId}`)
        .select()

    if (error) {
        console.log("Error updating assignment: " + error.message)
    }

}
