"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { VscAccount } from "react-icons/vsc";
import { redirect, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LegendModal } from "@/lib/Modals";

export default function StudentDashboard() {
    const [userName, setUserName] = useState("sample");
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);

    if (Cookies.get("studentId") == undefined) {
        redirect("/login");
    }

    const handleLogout = () => {
        Cookies.remove("studentId");
        router.push("/login");
    };

    const legendItems = [
        { code: "✓", description: "Used when knowledge has been demonstrated individually" },
        { code: "S", description: "Used when knowledge has been demonstrated individually, but with a silly mistake" },
        { code: "H", description: "Used when knowledge has been demonstrated individually, but with help from a teacher or peer" },
        { code: "G", description: "Used when knowledge has been demonstrated within a group" },
        { code: "X", description: "Used when a question has been attempted, but answered incorrectly" },
        { code: "N", description: "Used when a question has not been attempted" },
        { code: "O", description: "Used when knowledge has been demonstrated individually, seen through observation" },
        { code: "C", description: "Used when knowledge has been demonstrated individually, seen through a conversation" },
    ];

    const tableData = [
        "Programming Skills: Enhancing our programming skills by expanding our programming library through utilizing Next.js for the front-end + back-end development and deploying Supabase for the application database.",
        "Time Management: This project will challenge our ability to plan effectively and deliver results under deadlines set by both our team and stakeholders.",
        "Adaptability: As requirements evolve or unexpected challenges arise, we will need to remain flexible—reassessing priorities, adjusting timelines, and refining strategies to stay aligned with project goals",
        "Team Coordination: Working in a team environment like this will teach us how to delegate responsibility, balance workloads, and to communicate through conflicts all while maintaining a shared vision.."
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Top Banner */}
            <header className="w-full bg-violet-700 px-6 py-4 flex justify-between items-center relative">
                <div className="flex items-center gap-4">
                    <span className="text-white text-lg font-semibold">Student Dashboard</span>
                </div>
                <div className="flex items-center gap-4 relative">
                    <Bell className="w-6 h-6 text-white cursor-pointer" />
                    <div>
                        <VscAccount
                            className="w-6 h-6 text-white cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}
                        />
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-50">
                                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="min-h-screen bg-gray-50 p-6 text-black">
                <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-6">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow">
                        <h2 className="text-2xl font-semibold mb-6">Hello Student</h2>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Class</label>
                            <select className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>HilsenDager6/7</option>
                                <option>Math</option>
                                <option>IT</option>
                                <option>ACC</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Unit</label>
                            <select className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Area and Perimeter</option>
                                <option>Unit 1</option>
                                <option>Unit 2</option>
                                <option>Unit 3</option>
                                <option>Unit 4</option>
                            </select>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 bg-white p-6 rounded-xl shadow">
                        {/* Buttons */}
                        <div className="flex justify-end gap-2 mb-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Show Examples</button>
                            <div>
                                <button
                                    onClick={() => setShowPopup(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Show Legend
                                </button>
                                <LegendModal isOpen={showPopup} onClose={() => setShowPopup(false)} items={legendItems} />
                            </div>
                        </div>

                        {/* Array Display Instead of Table */}
                        <div className="space-y-6">
                            {tableData.map((content, index) => (
                                <div key={index} className="border rounded-xl p-6 bg-white shadow">
                                    <p className="font-semibold mb-4">{content}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {["Basic", "Intermediate", "Advanced"].map((level, i) => (
                                            <div key={i} className="border rounded p-3 bg-gray-50 text-sm">
                                                <div className="text-gray-700 font-semibold mb-1">{level}</div>
                                                <div className="text-black font-medium mb-2 text-center text-lg">✓</div>
                                                <div className="text-gray-500 text-left">Note: visible only</div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Update Button */}
                        <div className="flex justify-end gap-2 mt-6">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Map</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
