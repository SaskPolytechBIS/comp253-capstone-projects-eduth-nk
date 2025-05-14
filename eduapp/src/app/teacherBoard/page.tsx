"use client";


import React, { useState } from "react";
import { Bell } from "lucide-react"; // icon library or image
import { VscAccount } from "react-icons/vsc";
import ClientEditorModal from "@/components/ClientEditorModal";
import {redirect, useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {} from './api/route'

export default function TeacherDashboard() {
    const [userName, setUserName] = useState("sample");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignmentContent, setAssignmentContent] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    //handle pop-up modal for add class and student
    const [showClassModal, setShowClassModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [className, setClassName] = useState("");
    const [teacherName, setTeacherName] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentUsername, setStudentUsername] = useState("");
    const [studentPassword, setStudentPassword] = useState("");

    //redirects to login if no teacher cookie
    if (Cookies.get('teacherId') == undefined) {
        redirect('/login')
    }

    const classes =
    const handleClassSubmit = () => {
        console.log("Class:", className, "Teacher:", teacherName);
        setClassName("");
        setTeacherName("");
        setShowClassModal(false);
    };

    const handleStudentSubmit = () => {
        console.log("Student:", studentName, "Username:", studentUsername);
        setStudentName("");
        setStudentUsername("");
        setShowStudentModal(false);
    };
    // Handle logout
    const handleLogout = () => {
        Cookies.remove("teacherId");
        router.push("/login");         // Redirect to login
    };

    //const studentName = getStudentName();
    const handleNewAssignmentClick = () => {
        setIsModalOpen(true);
    };

    const handleModalSave = (content: string) => {
        console.log("Assignment Content:", content);
        setAssignmentContent(content);
        setIsModalOpen(false);
        // TODO: save to DB
    };

    //handle new student and add new class
    const handleNewClass = () => setShowClassModal(true);
    const handleNewStudent = () => setShowStudentModal(true);

    return (
        <div className="flex flex-col min-h-screen ">
            {/* Top Banner */}
            <header className="w-full bg-violet-700 px-6 py-4 flex justify-between items-center ">
               <div className="flex space-x-4">
                   <button onClick={handleNewAssignmentClick} className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700">
                       + New Assignment
                   </button>

                   <button onClick={handleNewClass} className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700">
                       Create Class
                   </button>

                   <button onClick={handleNewStudent} className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700">
                       Create Student
                   </button>
               </div>

                <div className="flex items-center gap-4">
                    <Bell className="w-6 h-6 text-gray-700 text-white cursor-pointer"/>
                    {/* Account Icon with dropdown */}
                    <div >
                        <VscAccount
                            className="w-6 h-6 text-white cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}
                        />

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-50">
                                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Profile
                                </button>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center text-black">
                {/* Page Content: Sidebar + Main */}
                <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
                    {/* Left Panel */}
                    <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow">
                        <div className="mb-4 ">
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
            {/* Modal Component */}
            <ClientEditorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalSave}
                initialContent={assignmentContent}
            />

            {/* Modal for Class */}
            {showClassModal && (
                <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm">
                    <div className="bg-white p-6 text-black rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Create Class</h2>
                        <input
                            type="text"
                            placeholder="Enter class name"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Teacher</label>
                            <select className="w-full border rounded px-3 py-2">
                                <option>Taylor</option>
                                <option>Jordan</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowClassModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={handleClassSubmit} className="px-4 py-2 bg-violet-700 text-white rounded">Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Student */}
            {showStudentModal && (
                <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Create Student</h2>

                        <input
                            type="text"
                            placeholder="Enter student name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Create student username"
                            value={studentUsername}
                            onChange={(e) => setStudentUsername(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Create student password"
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Class</label>
                            <select className="w-full border rounded px-3 py-2 space-x-2 line-height:1.5">
                                <option>HilsenDager6/7</option>
                                <option>Math</option>
                                <option>IT</option>
                                <option>ACC</option>
                            </select>
                        </div>

                        <br/>
                        <br/>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowStudentModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={handleStudentSubmit} className="px-4 py-2 bg-violet-700 text-white rounded">Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}