// ./app/teacher-dashboard/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { VscAccount } from "react-icons/vsc";
import ClientEditorModal from "@/components/ClientEditorModal";
import { redirect, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getAllStudent, getAllClass } from "./api/route";

// Interfaces
interface Student {
    StudentID: number;
    StudentName: string;
}
interface ClassInfo {
    ClassID: number;
    ClassName: string;
}
type ColumnType = "Basic" | "Intermediate" | "Advanced";

export default function TeacherDashboard() {
    const [userName, setUserName] = useState("sample");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignmentContent, setAssignmentContent] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const router = useRouter();

    // Modals
    const [showClassModal, setShowClassModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);

    // Inputs
    const [className, setClassName] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentUsername, setStudentUsername] = useState("");
    const [studentPassword, setStudentPassword] = useState("");

    // Dropdowns
    const [students, setStudents] = useState<Student[]>([]);
    const [classInfo, setClass] = useState<ClassInfo[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

    // Legend Popup
    const [showPopup, setShowPopup] = useState(false);

    // Attach files
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedCell, setSelectedCell] = useState<{ row: number; column: ColumnType } | null>(null);
    const [attachedFiles, setAttachedFiles] = useState<Record<number, Record<ColumnType, File[]>>>({});

    // Legend
    const legendItems = [
        { code: "✓", description: "Used when knowledge has been demonstrated individually" },
        { code: "S", description: "Silly mistake" },
        { code: "H", description: "Help from teacher/peer" },
        { code: "G", description: "Within a group" },
        { code: "X", description: "Incorrect attempt" },
        { code: "N", description: "Not attempted" },
        { code: "O", description: "Observed" },
        { code: "C", description: "Conversation" },
    ];

    // Dummy data
    const dummyData = [
        {
            content: `The project's main goal is to supplement the Building Thinking Classroom framework.\nWe will create a dual-interface system that fosters collaborative learning...`,
        },
        {
            content: `This project features a database designed to store files uploaded by teachers and students,\nincluding media, voice messages, and collaborative notes...`,
        },
        {
            content: `Considerations should be made towards the functionality of the application for both students and teachers...`,
        },
    ];

    // Hooks
    useEffect(() => {
        if (!Cookies.get("teacherId")) redirect("/login");

        async function fetchInitialData() {
            const [studentsData, classesData] = await Promise.all([getAllStudent(), getAllClass()]);
            setStudents(studentsData);
            setClass(classesData);
        }
        fetchInitialData();
    }, []);

    // Logic Handlers
    const handleNewAssignmentClick = () => setIsModalOpen(true);
    const handleModalSave = (content: string) => {
        setAssignmentContent(content);
        setIsModalOpen(false);
        // TODO: save to DB
    };

    const handleLogout = () => {
        Cookies.remove("teacherId");
        router.push("/login");
    };

    const handleAttachClick = (row: number, column: ColumnType) => {
        console.log("go to handleAttachClick")
        setSelectedCell({ row, column });
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("go to handleFileChange")
        const file = e.target.files?.[0];
        if (file && selectedCell) {
            const { row, column } = selectedCell;
            setAttachedFiles((prev) => ({
                ...prev,
                [row]: {
                    ...prev[row],
                    [column]: [...(prev[row]?.[column] || []), file],
                },
            }));
        }
    };

    const handleClassSubmit = () => {
        console.log("Class:", className);
        setClassName("");
        setShowClassModal(false);
        // TODO: Save to DB
    };

    const handleStudentSubmit = () => {
        console.log("Student:", studentName, "Username:", studentUsername);
        setStudentName("");
        setStudentUsername("");
        setStudentPassword("");
        setShowStudentModal(false);
        // TODO: Save to DB
    };

    // Evaluation Cell Component
    const EvaluationCell = ({ row, column }: { row: number; column: ColumnType }) => (
        <td className="border p-3 text-center text-xs">
            <div className="mb-2">
                <select className="w-full border rounded px-2 py-1">
                    <option></option>
                    {legendItems.map((item, idx) => (
                        <option key={idx}>{item.code}</option>
                    ))}
                </select>
            </div>
            <textarea className="w-full border rounded px-2 py-1 mb-2 text-xs" placeholder="Note..." />
            <div>
                <button
                    onClick={() => handleAttachClick(row, column)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Attach Evidence
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                {attachedFiles[row]?.[column]?.length > 0 && (
                    <ul className="text-xs mt-1 list-disc list-inside">
                        {attachedFiles[row][column].map((f, idx) => (
                            <li key={idx}>{f.name}</li>
                        ))}
                    </ul>
                )}
            </div>
        </td>
    );

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="w-full bg-violet-700 px-6 py-4 flex justify-between items-center">
                <div className="flex gap-3">
                    <button onClick={handleNewAssignmentClick} className="bg-violet-800 text-white px-4 py-2 rounded hover:bg-violet-600">
                        + New Assignment
                    </button>
                    <button onClick={() => setShowClassModal(true)} className="bg-violet-800 text-white px-4 py-2 rounded hover:bg-violet-600">
                        Create Class
                    </button>
                    <button onClick={() => setShowStudentModal(true)} className="bg-violet-800 text-white px-4 py-2 rounded hover:bg-violet-600">
                        Create Student
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <Bell className="w-6 h-6 text-white" />
                    <div className="relative">
                        <VscAccount className="w-6 h-6 text-white cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-grow bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow space-y-4">
                        <div>
                            <label className="text-sm font-medium block mb-1">Class</label>
                            <select
                                className="w-full border rounded px-3 py-2 text-black"
                                value={selectedClassId ?? ""}
                                onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            >
                                <option value="">Select a class</option>
                                {classInfo.map((info) => (
                                    <option key={info.ClassID} value={info.ClassID}>
                                        {info.ClassName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium block mb-1">Unit</label>
                            <select className="w-full border rounded px-3 py-2">
                                <option>Area and Perimeter</option>
                                <option>Unit 1</option>
                                <option>Unit 2</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium block mb-1">Student</label>
                            <select
                                className="w-full border rounded px-3 py-2 text-black"
                                value={selectedStudentId ?? ""}
                                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                            >
                                <option value="">Select a student</option>
                                {students.map((s) => (
                                    <option key={s.StudentID} value={s.StudentID}>
                                        {s.StudentName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="w-full bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700">
                            Show Map
                        </button>
                    </aside>

                    {/* Table */}
                    <section className="w-full md:w-2/3 bg-white p-4 rounded-xl shadow overflow-x-auto">
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setShowPopup(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Show Legend
                            </button>
                        </div>
                        <table className="w-full table-auto border-collapse">
                            <thead>
                            <tr className="bg-gray-100 text-sm">
                                <th className="border p-2 text-left">Content</th>
                                <th className="border p-2 text-center">Basic</th>
                                <th className="border p-2 text-center">Intermediate</th>
                                <th className="border p-2 text-center">Advanced</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dummyData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border p-3 whitespace-pre-line text-sm">{row.content}</td>
                                    <EvaluationCell row={index} column="Basic" />
                                    <EvaluationCell row={index} column="Intermediate" />
                                    <EvaluationCell row={index} column="Advanced" />
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>

            {/* Assignment Modal */}
            <ClientEditorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleModalSave} initialContent={assignmentContent} />

            {/* Popup for Legend */}
            {showPopup && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-96 relative">
                        <h2 className="text-xl font-bold mb-4 text-center">Legend</h2>
                        <ul className="space-y-2 text-sm text-black">
                            {legendItems.map((item, index) => (
                                <li key={index}>
                                    <strong>{item.code}</strong>: {item.description}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowPopup(false)} className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl">
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Create Class Modal */}
            {showClassModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Create Class</h2>
                        <input
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            placeholder="Class Name"
                            className="w-full border p-2 rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowClassModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                                Cancel
                            </button>
                            <button onClick={handleClassSubmit} className="px-4 py-2 bg-violet-700 text-white rounded">
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Student Modal */}
            {showStudentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Create Student</h2>
                        <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Student Name"
                            className="w-full border p-2 rounded mb-2"
                        />
                        <input
                            type="text"
                            value={studentUsername}
                            onChange={(e) => setStudentUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full border p-2 rounded mb-2"
                        />
                        <input
                            type="password"
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full border p-2 rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowStudentModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                                Cancel
                            </button>
                            <button onClick={handleStudentSubmit} className="px-4 py-2 bg-violet-700 text-white rounded">
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
