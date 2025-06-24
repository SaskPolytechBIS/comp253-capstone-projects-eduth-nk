import { supabase } from "@/lib/supabase";

export async function POST(request) {
    try {
        const { studentName, studentClass, studentUsername, studentPassword } = await request.json();

        if (!studentName || !studentClass || !studentUsername || !studentPassword) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { data: studentData, error: studentError } = await supabase
            .from("Student")
            .insert([{ StudentName: studentName, ClassID: studentClass }])
            .select("StudentID")
            .single();

        if (studentError) throw new Error(studentError.message);

        const { data: loginData, error: loginError } = await supabase
            .from("StudentLogin")
            .insert([{ StudentID: studentData.StudentID, Username: studentUsername, Password: studentPassword }])
            .select()
            .single();

        if (loginError) throw new Error(loginError.message);

        return new Response(
            JSON.stringify({ success: true, student: studentData, login: loginData }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
