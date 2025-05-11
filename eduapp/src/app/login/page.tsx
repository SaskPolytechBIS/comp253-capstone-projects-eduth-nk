"use client";
import "dotenv/config"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons from react-icons/fa
import { supabase } from "@/lib/supabase";


export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);

        const { data: teacher, error: teacherError } = await supabase
            .from("TeacherLogin")
            .select("*")
            .eq("Username", email.trim())
            .eq("Password", password.trim())
            .maybeSingle();

        if (teacherError) {
            console.error("Login error:", teacherError.message);
            alert("Login error!");
            return;
        }

        if (teacher) {
            console.log("Login successful", teacher);
            router.push("/teacherBoard");
        }else {

            const {data: student, error: studentError} = await supabase
                .from("StudentLogin")
                .select("*")
                .eq("Username", email.trim())
                .eq("Password", password.trim())
                .maybeSingle();

            if (studentError) {
                console.error("Student query error:", studentError.message);
                alert("Login error!");
                return;
            }

            if (student) {
                console.log("Student login successful", student);
                router.push("/studentBoard");
                return;
            } else {
                //if Username or Password incorrect
                alert("Username or Password incorrect");
            }
        }

    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-black">Login</h1>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-black">Username</label>
                    <input
                        type="username"
                        className="w-full px-3 py-2 border-2 border-blue-400 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.trim())}
                        required
                    />
                </div>
                <div className="mb-6 relative">
                    <label className="block mb-1 text-sm font-medium text-black">Password</label>
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        className="w-full px-3 py-2 border-2 border-blue-400 rounded-md pr-10 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.trim())}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-0.1"
                        onClick={togglePasswordVisibility}
                    >
                        {isPasswordVisible ? (
                            <FaEye size={20} className="text-gray-600" />
                        ) : (
                            <FaEyeSlash size={20} className="text-gray-600" />
                        )}
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                    Log In
                </button>
            </form>
        </div>
    );
}
