import { supabase } from "@/lib/supabase";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const teacherId = url.searchParams.get("teacherId");

        if (!teacherId) {
            return new Response(
                JSON.stringify({ error: "Missing teacherId query parameter" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { data, error } = await supabase
            .from("Teacher")
            .select("TeacherName")
            .eq("TeacherID", teacherId)
            .single();

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify(data), {
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