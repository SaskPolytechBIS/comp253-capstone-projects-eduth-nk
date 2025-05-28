import {supabase} from "./supabase";

export async function deleteClass(classId) {
    const { error } = await supabase
        .from('Class')
        .delete()
        .eq('ClassID', `${classId}`)

    if (error) {
        console.log("Error deleting class: " + error.message)
    }
}

export async function deleteStudent (studentId) {
    const { error } = await supabase
        .from('Student')
        .delete()
        .eq('StudentID', `${studentId}`)

    if (error) {
        console.log("Error deleting student: " + error.message)
    }
}

export async function deleteNavMap(navMapId) {

    const { error } = await supabase
        .from('NavigationMap')
        .delete()
        .eq('NavMapID', `${navMapId}`)

    if (error) {
        console.log("Error deleting navigation map: " + error.message)
    }
}
