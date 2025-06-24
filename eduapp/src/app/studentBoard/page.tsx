"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { VscAccount } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { getUnits, getClassFromStudent, getTeacherName } from "@/lib/select";
import Cookies from "js-cookie";
import { LegendModal } from "@/lib/Modals";
import { supabase } from "@/lib/supabase";
import Table from "react-bootstrap/Table";

export default function StudentDashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    const studentId = Cookies.get("studentId");
    const [studentClass, setStudentClass] = useState([{ ClassID: "0", ClassName: "Error", TeacherID: "0" }]);
    const [units, setUnits] = useState([{ UnitID: "0", UnitName: "Error" }]);
    const [selectedUnit, setSelectedUnit] = useState("");
    const [assignmentData, setAssignmentData] = useState<any[]>([]);
    const [unitDescriptions, setUnitDescriptions] = useState<string[]>([]);
    const [studentName, setStudentName] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const name = Cookies.get("studentName") || "";
            setStudentName(name);
        }
    }, []);

    useEffect(() => {
        if (!studentId) {
            router.push("/login");
        }
    }, [studentId]);

    useEffect(() => {
        const fetchClass = async () => {
            const classResult = await getClassFromStudent(studentId);
            if (!Array.isArray(classResult)) {
                console.error("Error getting class: " + JSON.stringify(classResult));
                return;
            }
            setStudentClass(classResult);
        };
        fetchClass();
    }, []);

    useEffect(() => {
        if (!studentClass[0].ClassID) return;
        const fetchUnits = async () => {
            const unitsResult = await getUnits(studentClass[0].ClassID);
            if (!Array.isArray(unitsResult)) {
                console.error("Error getting units: " + JSON.stringify(unitsResult));
                return;
            }
            setUnits(unitsResult);
        };
        fetchUnits();
    }, [studentClass]);

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const unitId = e.target.value;
        setSelectedUnit(unitId);
    };

    useEffect(() => {
        const loadStudentAssignment = async () => {
            if (!selectedUnit || studentClass.length === 0) return;

            const result = await getTeacherName(studentClass[0].TeacherID);
            const teacherName = result?.[0]?.TeacherName;

            const filePath = `${teacherName}/${studentClass[0].ClassName}/${selectedUnit}/${studentId}/assignment.json`;

            const { data, error } = await supabase.storage
                .from("public/assignment")
                .download(filePath);

            if (error) {
                console.warn("Failed to load assignment:", error.message);
                setAssignmentData([]);
                return;
            }

            try {
                const text = await data.text();
                const json = JSON.parse(text);
                setAssignmentData(json.entries || []);
            } catch (e) {
                console.error("Error parsing JSON:", e);
                setAssignmentData([]);
            }
        };

        loadStudentAssignment();
    }, [selectedUnit, studentClass]);

    useEffect(() => {
        const loadUnitContent = async () => {
            if (!selectedUnit || studentClass.length === 0) return;

            const result = await getTeacherName(studentClass[0].TeacherID);
            const teacherName = result?.[0]?.TeacherName;

            const filePath = `${teacherName}/${studentClass[0].ClassName}/${selectedUnit}/unit_content.json`;

            const { data, error } = await supabase.storage
                .from("public/assignment")
                .download(filePath);

            if (error) {
                console.error("Failed to load unit content:", error.message);
                setUnitDescriptions([]);
                return;
            }

            try {
                const text = await data.text();
                const json = JSON.parse(text);
                setUnitDescriptions(json.descriptions || []);
            } catch (e) {
                console.error("Error parsing unit_content.json:", e);
                setUnitDescriptions([]);
            }
        };

        loadUnitContent();
    }, [selectedUnit, studentClass]);

    const handleLogout = () => {
        Cookies.remove("studentId");
        router.push("/login");
    };

    const legendItems = [
        { code: "✓", description: "Used when knowledge has been demonstrated individually" },
        { code: "S", description: "Silly mistake but demonstrated individually" },
        { code: "H", description: "Help from teacher or peer" },
        { code: "G", description: "Demonstrated within a group" },
        { code: "X", description: "Attempted, but incorrect" },
        { code: "N", description: "Not attempted" },
        { code: "O", description: "Observed demonstration" },
        { code: "C", description: "Demonstrated via conversation" },
    ];

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="w-full bg-violet-700 px-6 py-4 flex justify-between items-center relative">
                <div className="text-white text-lg font-semibold">Student Dashboard</div>
                <div className="flex items-center gap-4 relative">
                    <Bell className="w-6 h-6 text-white cursor-pointer" />
                    <VscAccount
                        className="w-6 h-6 text-white cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                    />
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-50">
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                        </div>
                    )}
                </div>
            </header>

            <div className="min-h-screen bg-gray-50 p-6 text-black">
                <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-6">
                    <div className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow">
                        <h2 className="text-2xl font-semibold mb-6">Hello {studentName}</h2>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Unit</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={selectedUnit}
                                onChange={handleUnitChange}
                            >
                                <option value="">Choose a unit!</option>
                                {units.map((unit) => (
                                    <option key={unit.UnitID} value={unit.UnitID}>
                                        {unit.UnitName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="w-full md:w-3/4 bg-white p-6 rounded-xl shadow">
                        <div className="flex justify-end gap-2 mb-4">
                            <button
                                onClick={() => setShowPopup(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Show Legend
                            </button>
                            <LegendModal isOpen={showPopup} onClose={() => setShowPopup(false)} items={legendItems} />
                        </div>

                        <div className="overflow-x-auto">
                            <Table className="w-full table-auto border-collapse">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left w-[40%]">Content</th>
                                    <th className="border p-2 text-center w-[20%]">Basic</th>
                                    <th className="border p-2 text-center w-[20%]">Intermediate</th>
                                    <th className="border p-2 text-center w-[20%]">Advanced</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.from({ length: 5 }).map((_, index) => {
                                    const entry = assignmentData[index] || {
                                        evaluations: {
                                            Basic: { code: "", note: "", files: [] },
                                            Intermediate: { code: "", note: "", files: [] },
                                            Advanced: { code: "", note: "", files: [] },
                                        },
                                    };
                                    const contentText = unitDescriptions[index] || "";

                                    return (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border p-2 align-top">
                                                <textarea
                                                    readOnly
                                                    value={contentText}
                                                    rows={4}
                                                    className="w-full border rounded p-2 bg-gray-100 text-sm"
                                                />
                                            </td>
                                            {["Basic", "Intermediate", "Advanced"].map((level) => (
                                                <td key={level} className="border p-2 text-center align-top text-xs">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={entry.evaluations[level]?.code || ""}
                                                        className="w-full border rounded px-2 py-1 mb-1 bg-gray-100 text-center"
                                                    />
                                                    <textarea
                                                        value={entry.evaluations[level]?.note || ""}
                                                        readOnly
                                                        rows={2}
                                                        className="w-full border rounded px-2 py-1 mb-1 bg-gray-100"
                                                        placeholder="Note..."
                                                    />
                                                    <div className="text-left">
                                                        <ul className="list-disc list-inside text-xs mt-1">
                                                            {entry.evaluations[level]?.files?.map((file: string, idx: number) => {
                                                                const parts = file.split("/");
                                                                const originalName = parts[parts.length - 1];
                                                                const fileName = originalName.replace(/^(\d+-)+/, "");

                                                                const fileUrl = `https://odrybkhmbqqpetshcupz.supabase.co/storage/v1/object/public/developing/${file}`;

                                                                return (
                                                                    <li key={idx}>
                                                                        <span
                                                                            onClick={() => setPreviewUrl(fileUrl)}
                                                                            className="text-blue-700 underline break-all cursor-pointer hover:text-blue-800"
                                                                            title="Click to preview"
                                                                        >
                                                                            {fileName}
                                                                        </span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            {previewUrl && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <div className="bg-white w-[80%] h-[80%] relative rounded-lg overflow-hidden shadow-lg">
                        <button
                            onClick={() => setPreviewUrl(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600"
                        >
                            Close
                        </button>
                        <iframe
                            src={previewUrl}
                            width="100%"
                            height="100%"
                            className="border-none"
                            allow="autoplay; encrypted-media"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>

    );
}
