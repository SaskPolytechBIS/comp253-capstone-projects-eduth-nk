"use client";

import React, { useState, useEffect } from "react";
import {post} from "@supabase/storage-js/src/lib/fetch";

export default function TeacherDashboard() {
    // Simulated logged-in user's name
    const [userName, setUserName] = useState("sample");

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-5">
                <h2 className="text-xl font-bold mb-6">{userName}'s Dashboard</h2>
                <ul>
                    <li className="mb-4 hover:text-blue-400 cursor-pointer">Profile</li>
                    <li className="mb-4 hover:text-blue-400 cursor-pointer">Create Post</li>
                    <li className="hover:text-blue-400 cursor-pointer">Logout</li>
                </ul>
            </aside>

<<<<<<< Updated upstream
            {/* Main content */}
            <main className="flex-1 bg-gray-100 p-6">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-black">Welcome, {userName}!</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        + New Post
                    </button>
                </header>

                <section className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-black">Your Posts</h2>
                    {post === 0 && (
                        <p className="text-gray-600">No posts yet. Start by creating a new post.</p>
                    )}
                </section>
            </main>
=======
            <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
                {/* Page Content: Sidebar + Main */}
                <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
                    {/* Left Panel */}
                    <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Class</label>
                            <select className="w-full border rounded px-3 py-2">
                                <option>HilsenDager6/7</option>
                                <option>Math</option>
                                <option>IT</option>
                                <option>ACC</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Unit</label>
                            <select className="w-full border rounded px-3 py-2">
                                <option>Area and Perimeter</option>
                                <option>Unit 1</option>
                                <option>Unit 2</option>
                                <option>Unit 3</option>
                                <option>Unit 4</option>
                            </select>
                        </div>

                        <button className="w-full mb-4 bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700">
                            Show Map
                        </button>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Student</label>
                            <select className="w-full border rounded px-3 py-2">
                                <option>Bobby Joe</option>
                                <option>Sunny Le</option>
                                <option>Jack Son</option>
                                <option>Anna Tom</option>
                                <option>Jacky Chan</option>
                            </select>
                        </div>

                        <button className="w-full bg-purple-600 text-white rounded px-3 py-2 hover:bg-purple-700">
                            Show Map
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-2/3 bg-white p-4 rounded-xl shadow overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Content</th>
                                <th className="border p-2 text-center">Basic</th>
                                <th className="border p-2 text-center">Intermediate</th>
                                <th className="border p-2 text-center">Advanced</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-50">
                                    <td className="border p-3 text-sm">
                                        The project's main goal is to supplement the Building Thinking Classroom framework.
                                        We will create a dual-interface system that fosters collaborative learning by enabling teachers
                                        and students to have a conversation about their assessments and allow the parents to view the progress
                                        of their child through the application at home.
                                    </td>
                                    <td className="border p-3 text-center text-xs text-blue-700">
                                        <span className="block underline cursor-pointer">&lt;Enter Assessment&gt;</span>
                                        <span className="block underline cursor-pointer">&lt;attach evidence&gt;</span>
                                    </td>
                                    <td className="border p-3"></td>
                                    <td className="border p-3"></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="border p-3 text-sm">
                                        This project features a database designed to store files uploaded by teachers and students,
                                        including media, voice messages, and collaborative notes. It will also include log-in functionality
                                        and be hosted through a web application.
                                        It will include a database that holds the information for login and the paths to the files for assignments.:
                                    </td>
                                    <td className="border p-3 text-center text-xs text-blue-700">
                                        <span className="block underline cursor-pointer">&lt;Enter Assessment&gt;</span>
                                        <span className="block underline cursor-pointer">&lt;attach evidence&gt;</span>
                                    </td>
                                    <td className="border p-3"></td>
                                    <td className="border p-3"></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="border p-3 text-sm">
                                        Considerations should be made towards the functionality of the application for both students and teachers,
                                        the ability to keep media applicable, accessible, and implementable for both sides, and the ability to log in regardless of where they are.
                                        This is the basis of the framework that we have been requested, and any changes should keep this framework the same.
                                        Questions we can ask ourselves include:
                                    </td>
                                    <td className="border p-3 text-center text-xs text-blue-700">
                                        <span className="block underline cursor-pointer">&lt;Enter Assessment&gt;</span>
                                        <span className="block underline cursor-pointer">&lt;attach evidence&gt;</span>
                                    </td>
                                    <td className="border p-3"></td>
                                    <td className="border p-3"></td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="text-right mt-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Update Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
>>>>>>> Stashed changes
        </div>
    );
}
