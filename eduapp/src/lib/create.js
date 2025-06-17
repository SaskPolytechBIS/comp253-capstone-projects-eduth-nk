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

export async function createUnit(classId, unitName, students, className, content1, content2, content3, content4, content5) {
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

    const jsonCreate = {
        "1": {
            content: content1,
            basicLink: "null", basicNote: "null", basicGrade: "null",
            advancedLink: "null", advancedNote: "null", advancedGrade: "null",
            intermediateLink: "null", intermediateNote: "null", intermediateGrade: "null"
        },
        "2": {
            content: content2,
            basicLink: "null", basicNote: "null", basicGrade: "null",
            advancedLink: "null", advancedNote: "null", advancedGrade: "null",
            intermediateLink: "null", intermediateNote: "null", intermediateGrade: "null"
        },
        "3": {
            content: content3,
            basicLink: "null", basicNote: "null", basicGrade: "null",
            advancedLink: "null", advancedNote: "null", advancedGrade: "null",
            intermediateLink: "null", intermediateNote: "null", intermediateGrade: "null"
        },
        "4": {
            content: content4,
            basicLink: "null", basicNote: "null", basicGrade: "null",
            advancedLink: "null", advancedNote: "null", advancedGrade: "null",
            intermediateLink: "null", intermediateNote: "null", intermediateGrade: "null"
        },
        "5": {
            content: content5,
            basicLink: "null", basicNote: "null", basicGrade: "null",
            advancedLink: "null", advancedNote: "null", advancedGrade: "null",
            intermediateLink: "null", intermediateNote: "null", intermediateGrade: "null"
        }
    };

    await createAssignment(unitId, unitName, students, className, jsonCreate);

    return unitId;
}


async function createAssignment(unitId, unitName, students, className, JSON) {

        const assignmentString = `assignment/${className}/${unitName}/${studentName}`;

        const { data, error } = await supabase
            .from('Assignment')
            .insert([
                {
                    UnitID: unitId,
                    StudentID: studentId,
                    AssignmentFolder: assignmentString,
                    JSON: jsonData
                }
            ]);

        if (error) {
            console.log("Error creating assignment for student ID", studentId, ":", error.message);
        }
    }
}
