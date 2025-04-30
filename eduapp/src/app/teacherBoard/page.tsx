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
        </div>
    );
}
