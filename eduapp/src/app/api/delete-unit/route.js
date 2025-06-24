import { supabase } from "@/lib/supabase";

export async function DELETE(request) {
    try {
        const { unitId } = await request.json();

        if (!unitId) {
            return new Response(
                JSON.stringify({ error: "Missing unitId" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { error } = await supabase
            .from("Units")
            .delete()
            .eq("UnitID", unitId);

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