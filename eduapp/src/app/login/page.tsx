"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons from react-icons/fa

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        // Add Supabase login logic here later
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };



    return (
        <>
            <div>
                <h1 className="text-4xl font-bold text-center text-black mt-20  "> Welcome to BTC Assessments </h1>
            </div>
            <div className="flex items-center justify-center mt-20">
                <form
                    onSubmit={handleSubmit}
                    className=" p-8 rounded-xl shadow-md w-full max-w-sm "
                >
                    <h1 className="text-2xl font-bold text-center text-black ">Login</h1>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-black">Username</label>
                        <input
                            type="username"
                            className="w-full px-3 py-2 border-2 border-blue-400 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required/>
                    </div>
                    <div className="mb-6 relative">
                        <label className="block mb-1 text-sm font-medium text-black">Password</label>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            className="w-full px-3 py-2 border-2 border-blue-400 rounded-md pr-10 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required/>
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-0.1"
                            onClick={togglePasswordVisibility}
                        >
                            {isPasswordVisible ? (
                                <FaEye size={20} className="text-gray-600"/>
                            ) : (
                                <FaEyeSlash size={20} className="text-gray-600"/>
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
        </>
    );
}
