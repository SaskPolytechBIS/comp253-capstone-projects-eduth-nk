import { createStudent } from "@/lib/create";

export async function POST(request) {
    try {
        const { studentName, studentClass, studentUsername, studentPassword } = await request.json();

        if (!studentName || !studentClass || !studentUsername || !studentPassword) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const result = await createStudent(studentName, studentClass, studentUsername, studentPassword);

        return new Response(
            JSON.stringify({ success: true, data: result }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}