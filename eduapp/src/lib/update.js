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

export async function updateTemplate(JSON, templateId) {
    const { data, error } = await supabase
        .from('Template')
        .update({ JSON: `${JSON}` })
        .eq('TemplateID', `${templateId}` )
        .select()

    if (error) {
        console.log("Error updating template: " + error.message)
    }
}