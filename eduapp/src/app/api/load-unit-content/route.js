import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
        return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
    }

    // Optionally get teacherName from cookies and validate it if needed
    const teacherName = (await cookies()).get("teacherName")?.value;
    if (!teacherName) {
        return NextResponse.json({ error: "Missing teacherName in cookies" }, { status: 401 });
    }

    // Use the provided path directly
    const contentPath = decodeURIComponent(path);

    const { data, error } = await supabase.storage
        .from("assignment")
        .download(contentPath);

    if (error || !data) {
        return NextResponse.json(
            { error: error?.message || "File not found" },
            { status: 404 }
        );
    }

    try {
        const text = await data.text();
        const json = JSON.parse(text);
        return NextResponse.json(json, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to parse JSON" },
            { status: 500 }
        );
    }
}