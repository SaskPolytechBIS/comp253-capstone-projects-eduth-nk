import { supabase } from "@/lib/supabase";

async function updateStudentLogin(studentId, studentUsername, studentPassword) {
    const { data, error } = await supabase
        .from("StudentLogin")
        .update({ Username: studentUsername, Password: studentPassword })
        .eq("StudentID", studentId)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function PATCH(request) {
    try {
        const { studentId, studentName, classId, studentUsername, studentPassword } = await request.json();

        if (!studentId || !studentName || !classId || !studentUsername || !studentPassword) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { data, error } = await supabase
            .from("Student")
            .update({ StudentName: studentName, ClassID: classId })
            .eq("StudentID", studentId)
            .select("StudentID");

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Update StudentLogin table
        await updateStudentLogin(studentId, studentUsername, studentPassword);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}