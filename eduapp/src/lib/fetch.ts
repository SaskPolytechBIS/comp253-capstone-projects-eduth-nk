import { supabase } from "./supabase";

export async function fetchUserName(teacherId: string) {
    const { data, error } = await supabase
        .from("Teacher") //table name
        .select("name")
        .eq("id", teacherId)
        .single();

    if (error) {
        console.error("Error fetching user name:", error);
        return null;
    }

    return data.name;
}