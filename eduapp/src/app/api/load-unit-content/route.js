import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");
    const unitId = searchParams.get("unitId");

    if (!className || !unitId) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Get teacherName from cookies
    const teacherName = cookies().get("teacherName")?.value;
    if (!teacherName) {
        return NextResponse.json({ error: "Missing teacherName in cookies" }, { status: 401 });
    }

    const contentPath = `${teacherName}/${className}/${unitId}/unit_content.json`;

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