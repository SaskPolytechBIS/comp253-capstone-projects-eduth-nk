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

export async function updateStudent(studentId, studentName, classId) {
    const { data, error } = await supabase
        .from('Student')
        .update({ StudentName: `${studentName}`, ClassID: `${classId}` })
        .eq('StudentID', `${studentId}`)
        .select()

    if (error) {
        console.log("Error updating classes: " + error.message);
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
