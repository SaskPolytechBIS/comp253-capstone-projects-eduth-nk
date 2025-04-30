import { supabase } from "./supabaseClient";

export async function fetchUserName(userId: string) {
    const { data, error } = await supabase
        .from("teachers") //table name
        .select("name")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Error fetching user name:", error);
        return null;
    }

    return data.name;
}