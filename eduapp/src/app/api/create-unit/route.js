import { supabase } from "@/lib/supabase";

export async function POST(request) {
    try {
        const { unitName, classId } = await request.json();

        if (!unitName || !classId) {
            return new Response(
                JSON.stringify({ error: "Missing unitName or classId" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { data, error } = await supabase
            .from("Units")
            .insert([{ UnitName: unitName, ClassID: Number(classId) }])
            .select()
            .single();

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message || "Insert failed", details: error }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Unexpected POST error:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}