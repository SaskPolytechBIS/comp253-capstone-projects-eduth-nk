import {supabase} from "./supabase";

export async function createStudent(studentName, studentClass, studentUsername, studentPassword) {
    const { data, error } = await supabase
        .from('Student')
        .insert([
            { StudentName: `${studentName}`, ClassID: `${studentClass}`}
        ])
        .select('StudentID')
        .single()

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

export async function createUnit(classId, unitName) {
    const { data, error } = await supabase
        .from('Units')
        .insert([
            { ClassID: `${classId}`, UnitName: `${unitName}` }
        ])
        .select('UnitID')
        .single();

    if (error || !data?.UnitID) {
        console.error("Error inserting unit:", error?.message || "No data returned");
        return null;
    }

    const unitId = data.UnitID;

    return unitId;
}



