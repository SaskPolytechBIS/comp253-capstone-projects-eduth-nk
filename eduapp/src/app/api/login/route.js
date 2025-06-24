import { supabase } from '@/lib/supabase';

async function checkTeacherLogin(username, password) {
    const { data: TeacherLogin, error } = await supabase
        .from('TeacherLogin')
        .select('TeacherID')
        .eq('Username', username)
        .eq('Password', password);

    if (error) return { message: error.message };
    if (!TeacherLogin || TeacherLogin.length === 0) return { message: 'Invalid teacher credentials' };
    return TeacherLogin[0];
}

async function checkStudentLogin(username, password) {
    const { data: StudentLogin, error } = await supabase
        .from('StudentLogin')
        .select('StudentID')
        .eq('Username', username)
        .eq('Password', password);

    if (error) return { message: error.message };
    if (!StudentLogin || StudentLogin.length === 0) return { message: 'Invalid student credentials' };
    return StudentLogin[0];
}

export async function POST(request) {
    try {
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
    } catch (err) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}