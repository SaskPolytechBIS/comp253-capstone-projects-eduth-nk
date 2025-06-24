import { supabase } from "@/lib/supabase";

export async function DELETE(request) {
    try {
        const { studentId } = await request.json();

        if (!studentId) {
            return new Response(
                JSON.stringify({ error: "Missing studentId" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { error } = await supabase
            .from("Student")
            .delete()
            .eq("StudentID", studentId);

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}