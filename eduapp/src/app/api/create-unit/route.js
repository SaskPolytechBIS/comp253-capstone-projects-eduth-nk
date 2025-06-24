import { supabase } from "@/lib/supabase";

export async function POST(request) {
    try {
        const { classId, unitName } = await request.json();

        if (!classId || !unitName) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const unitId = await createUnit(classId, unitName);

        if (!unitId) {
            return new Response(
                JSON.stringify({ error: "Failed to create unit" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, unitId }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}