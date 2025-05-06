"use client";


import React, { useState } from "react";
import { Bell   } from "lucide-react"; // icon library or image
import { VscAccount } from "react-icons/vsc";
import { getStudent } from "@/app/studentBoard/api/route";


export default function TeacherDashboard() {
    const [userName, setUserName] = useState("sample");

    return (
        <div className="flex flex-col min-h-screen ">
            {/* Top Banner */}
            <header className="w-full bg-violet-700 px-6 py-4 flex justify-between items-center ">
                <button className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + New Assignment
                </button>
                <div className="flex items-center gap-4">
                    <Bell className="w-6 h-6 text-gray-700 text-white cursor-pointer"/>
                    <VscAccount className="w-6 h-6 text-gray-700 text-white cursor-pointer"/>
                </div>
            </header>
            <div className="min-h-screen bg-gray-50 p-6 text-black">
                <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-6">
                    {/* Page Content: Sidebar + Main */}
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
                        {/* Top Buttons */}
                        <div className="flex justify-end gap-2 mb-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Show Examples
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Show Legend
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse text-sm">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Content</th>
                                    <th className="border px-4 py-2 text-center">Basic</th>
                                    <th className="border px-4 py-2 text-center">Intermediate</th>
                                    <th className="border px-4 py-2 text-center">Advanced</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className="hover:bg-gray-50">
                                    <td className="border px-4 py-3">
                                        Programming Skills: Enhancing our programming skills by expanding our programming library
                                        through utilizing Next.js for the front-end + back-end development and deploying Supabase
                                        for the application database.
                                    </td>
                                    <td className="border px-4 py-3 text-center text-xs text-blue-700">
                                        <>
                                            <span className="block underline cursor-pointer">&lt;Enter Assessment&gt;</span>
                                            <span className="block underline cursor-pointer">&lt;attach evidence&gt;</span>
                                        </>
                                    </td>
                                    <td className="border px-4 py-3"></td>
                                    <td className="border px-4 py-3"></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="border px-4 py-3">
                                        Time Management: This project will challenge our ability to plan effectively
                                        and deliver results under deadlines set by both our team and stakeholders.
                                    </td>
                                    <td className="border px-4 py-3 text-center text-xs text-blue-700">
                                        <>
                                            <span className="block underline cursor-pointer">&lt;Enter Assessment&gt;</span>
                                            <span className="block underline cursor-pointer">&lt;attach evidence&gt;</span>
                                        </>
                                    </td>
                                    <td className="border px-4 py-3"></td>
                                    <td className="border px-4 py-3"></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="border px-4 py-3">
                                        Adaptability: As requirements evolve or unexpected challenges arise,
                                        we will need to remain flexible—reassessing priorities, adjusting timelines,
                                        and refining strategies to stay aligned with project goals
                                    </td>
                                    <td className="border px-4 py-3 text-center text-xs text-blue-700">
                                        <>
                                            <span className="block underline cursor-pointer">&lt;Enter Assessment&gt;</span>
                                            <span className="block underline cursor-pointer">&lt;attach evidence&gt;</span>
                                        </>
                                    </td>
                                    <td className="border px-4 py-3"></td>
                                    <td className="border px-4 py-3"></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="border px-4 py-3">
                                        Team Coordination: Working in a team environment like this will teach us
                                        how to delegate responsibility, balance workloads, and to communicate through
                                        conflicts all while maintaining a shared vision..
                                    </td>
                                    <td className="border px-4 py-3 text-center text-xs text-blue-700">
                                        <>
                                            <span className="block underline cursor-pointer">&lt;Enter Assessment&gt;</span>
                                            <span className="block underline cursor-pointer">&lt;attach evidence&gt;</span>
                                        </>
                                    </td>
                                    <td className="border px-4 py-3"></td>
                                    <td className="border px-4 py-3"></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Bottom Buttons */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Show Legend
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Update Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}