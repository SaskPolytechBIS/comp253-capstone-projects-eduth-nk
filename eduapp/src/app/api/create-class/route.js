import { supabase } from "@/lib/supabase";

export async function POST(request) {
    try {
        const {className, teacherId} = await request.json();

        if (!className || !teacherId) {
            return new Response(
                JSON.stringify({error: "Missing required fields"}),
                {status: 400, headers: {"Content-Type": "application/json"}}
            );
        }

        const result = await createClass(className, teacherId);

        return new Response(
            JSON.stringify({success: true, data: result}),
            {status: 201, headers: {"Content-Type": "application/json"}}
        );
    } catch (error) {
        return new Response(
            JSON.stringify({error: error.message || "Internal Server Error"}),
            {status: 500, headers: {"Content-Type": "application/json"}}
        );
    }
}