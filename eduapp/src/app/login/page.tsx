"use client";

import { FormEvent, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { redirect, useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (Cookies.get("teacherId")) {
            router.replace("/teacherBoard");
        } else if (Cookies.get("studentId")) {
            router.replace("/studentBoard");
        }
    }, [router]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Try student login first
        let res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                role: "student",
            }),
        });
        let result = await res.json();

        if (res.ok && result?.StudentID) {
            Cookies.set("studentId", result.StudentID);
            Cookies.set("studentName", username);
            router.push("/studentBoard");
            return;
        }

        // If student login failed, try teacher login
        res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                role: "teacher",
            }),
        });
        result = await res.json();

        if (res.ok && result?.TeacherID) {
            Cookies.set("teacherId", result.TeacherID);
            Cookies.set("teacherName", username);
            router.push("/teacherBoard");
        } else {
            alert("Login invalid.");
            if (result?.error) console.error(result.error);
        }
    }

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
                    <label className="block mb-1 text-sm font-medium text-black">
                        Username
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border-2 border-blue-400 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.trim())}
                        required
                    />
                </div>

                <div className="mb-6 relative">
                    <label className="block mb-1 text-sm font-medium text-black">
                        Password
                    </label>
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
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