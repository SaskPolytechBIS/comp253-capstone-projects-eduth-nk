import {supabase} from "./supabase";

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

export async function createClass(className, teacherId) {
    const { data, error } = await supabase
        .from('Class')
        .insert([
            { ClassName: `${className}`, TeacherID: `${teacherId}` },
        ])
        .select()

    if (error){
        console.log("Error creating class: " + error.message)
    } else {
        return data;
    }
}

export async function createNavMapTemplate(JSON) {

    const { data, error } = await supabase
        .from('Template')
        .insert([
            { JSON: `${JSON}`},
        ])
        .select()

    if (error) {
        console.log("Error creating template: " + error.message)
    }

}

export async function createAssignment(studentId, teacherId, templateId, assignmentFolder) {

    const { data, error } = await supabase
        .from('Assignment')
        .insert([
            { StudentID: `${studentId}`, TeacherID: `${teacherId}`, TemplateID: `${templateId}`, AssignmentFolder: `${assignmentFolder}` },
        ])
        .select()

    if (error) {
        console.log("Error creating assignment: " + error.message)
    }

}