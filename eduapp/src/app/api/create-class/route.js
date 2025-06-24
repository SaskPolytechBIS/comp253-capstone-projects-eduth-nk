import { supabase } from "@/lib/supabase";

export async function POST(request) {
    try {
        const { className, teacherId } = await request.json();

        if (!className || !teacherId) {
            return new Response(
                JSON.stringify({ error: "Missing className or teacherId" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { data, error } = await supabase
            .from("Class")
            .insert([{ ClassName: className, TeacherID: teacherId }])
            .select("ClassID, ClassName, TeacherID")
            .single();

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify({ success: true, data }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}