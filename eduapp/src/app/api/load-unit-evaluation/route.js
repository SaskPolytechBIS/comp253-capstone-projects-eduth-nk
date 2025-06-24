import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const encodedPath = searchParams.get("path");

        if (!encodedPath) {
            return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
        }

        // Decode the path (in case it's URL encoded)
        const filePath = decodeURIComponent(encodedPath);


        const { data, error } = await supabase.storage
            .from("assignment")
            .download(filePath);

        if (error || !data) {
            return NextResponse.json(
                { error: error?.message || "File not found" },
                { status: 404 }
            );
        }

        const text = await data.text();
        const json = JSON.parse(text);

        return NextResponse.json(json, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}