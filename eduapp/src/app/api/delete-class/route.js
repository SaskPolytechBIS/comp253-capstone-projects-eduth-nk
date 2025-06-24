import { supabase } from "@/lib/supabase";

export async function DELETE(request) {
    try {
        const { classId } = await request.json();

        if (!classId) {
            return new Response(
                JSON.stringify({ error: "Missing classId" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { error } = await supabase
            .from("Class")
            .delete()
            .eq("ClassID", classId);

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