"use client";

import {FormEvent, useState} from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons from react-icons/fa
import { checkTeacherLogin, checkStudentLogin} from "./api/route"
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {useEffect} from "react";
import { PostgrestError } from "@supabase/supabase-js";


export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();

    async function handleSubmit (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        checkStudentLogin(username, password).then(studentId => {
            if (studentId == null || studentId instanceof PostgrestError || studentId.length == 0) {
                checkTeacherLogin(username, password).then(teacherId => {
                    if (teacherId == null || teacherId instanceof PostgrestError || teacherId.length == 0) {
                        alert("Login invalid.");
                        if (teacherId instanceof PostgrestError) {
                            console.log(teacherId)
                        }
                    } else {
                        Cookies.set("teacherId", teacherId[0].TeacherID)
                        router.push('/teacherBoard');

                    }
                })
            } else {
                Cookies.set("studentId", studentId[0].StudentID)
                router.push('/studentBoard');
            }
        })
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
