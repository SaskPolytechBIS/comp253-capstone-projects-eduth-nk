"use client";
import "dotenv/config"

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons from react-icons/fa
import { checkTeacherLogin, checkStudentLogin } from "./api/route"
import {useRouter} from "next/router";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);

        checkStudentLogin(username, password).then(value => {
            if (typeof value != "string") {
                checkTeacherLogin(username, password).then(value1 => {
                    if (typeof value1 != "string") {
                        console.log(value1)
                        //error
                    } else {
                        console.log("Teacher login")
                        useRouter().push('@/src/app/teacherBoard');
                    }
                })
            } else {
                console.log("Student login");
                useRouter().push('@/src/app/studentBoard');
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
                        onChange={(e) => setUsername(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
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
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Log In
                </button>
            </form>
        </div>
    );
}
