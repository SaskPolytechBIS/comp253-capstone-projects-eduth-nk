import { supabase } from "@/lib/supabase";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const studentId = url.searchParams.get("studentId");

        if (!studentId) {
            return new Response(
                JSON.stringify({ error: "Missing studentId query parameter" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { data: studentData, error: studentError } = await supabase
            .from("Student")
            .select("ClassID")
            .eq("StudentID", studentId)
            .single();

        if (studentError || !studentData) {
            return new Response(
                JSON.stringify({ error: studentError?.message || "Student not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const classId = studentData.ClassID;

        const { data: classData, error: classError } = await supabase
            .from("Class")
            .select("ClassID, ClassName, TeacherID")
            .eq("ClassID", classId)
            .single();

        if (classError) {
            return new Response(
                JSON.stringify({ error: classError.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify(classData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}