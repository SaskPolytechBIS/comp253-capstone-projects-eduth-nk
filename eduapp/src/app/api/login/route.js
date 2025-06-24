import { checkTeacherLogin, checkStudentLogin } from "@/lib/auth"; // <- We'll move logic here

export async function POST(request) {
    const { username, password, role } = await request.json();

    if (!username || !password || !role) {
        return new Response(JSON.stringify({ error: "Missing fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    let result;

    if (role === "teacher") {
        result = await checkTeacherLogin(username, password);
    } else if (role === "student") {
        result = await checkStudentLogin(username, password);
    } else {
        return new Response(JSON.stringify({ error: "Invalid role" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Handle error from Supabase
    if (result?.message) {
        return new Response(JSON.stringify({ error: result.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}