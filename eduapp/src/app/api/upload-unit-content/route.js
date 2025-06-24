import { supabase } from "@/lib/supabase";

export async function POST(request) {
    try {
        const { path, content } = await request.json();

        if (!path || !content) {
            return new Response(
                JSON.stringify({ error: "Missing path or content in request body" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const file = new Blob([JSON.stringify(content, null, 2)], {
            type: "application/json",
        });

        const { error } = await supabase.storage
            .from("assignment")
            .upload(decodeURIComponent(path), file, {
                contentType: "application/json",
                upsert: true, // allow overwriting
            });

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify({ success: true }), {
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