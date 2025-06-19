"use client";

import React, {useEffect, useRef, useState} from "react";
import { Bell } from "lucide-react";
import { VscAccount } from "react-icons/vsc";
import { redirect, useRouter } from "next/navigation";
import { getUnits, getClassFromStudent, getTeacherName } from "@/lib/select"
import Cookies from "js-cookie";
import { LegendModal } from "@/lib/Modals";
import {supabase} from "@/lib/supabase";
import Table from "react-bootstrap/Table";

export default function StudentDashboard() {
    const [userName, setUserName] = useState("sample");
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [studentClass, setStudentClass] = useState([{ClassID: "0", ClassName: "Error", TeacherID: "0"}]);
    const [teacherName, setTeacherName] = useState ([{TeacherName: "Error"}])
    const [units, setUnits] = useState ([{UnitID: "0", UnitName: "Error"}])
    const studentId = Cookies.get("studentId");

    useEffect(() => {
        if (!studentId) {
            router.push("/login");
        }
    }, [studentId]);

    useEffect(() => {
        const fetchClass = async () => {

            const classResult = await getClassFromStudent(studentId)
            if (!Array.isArray(classResult)) {
                console.error("Error with getting class: " + JSON.stringify(classResult));
                return;
            }

            setStudentClass(classResult);
        }
        fetchClass();
    }, [])

    useEffect(() => {
        const fetchUnits = async () => {
            const unitsResult = await getUnits(studentClass[0].ClassID)
            if (!Array.isArray(unitsResult)) {
                console.error("Error with getting units: " + JSON.stringify(unitsResult));
                return;
            }
            setUnits(unitsResult);
        }
        fetchUnits()
    }, [studentClass])

    useEffect(() => {
        const fetchTeacherName = async() => {
            const teacherResult = await getTeacherName(studentClass[0].TeacherID)
            if (!Array.isArray(teacherResult)) {
                console.error("Error with getting teacher name: " + JSON.stringify(teacherResult));
                return;
            }
            console.log(teacherResult)
            setTeacherName(teacherResult)
        }
        fetchTeacherName()
    }, [studentClass])

    useEffect(() => {
        if (
            studentClass[0].ClassID !== "0" &&
            teacherName.length > 0 && teacherName[0].TeacherName !== "Error" &&
            studentId
        ) {
            loadEvaluationFromJson();
        }
    }, [studentClass, teacherName, studentId]);

    const [evaluations, setEvaluations] = useState<Record<number, RowEvaluation>>({});

    const [attachedFiles, setAttachedFiles] = useState<Record<number, Record<ColumnType, File[]>>>({});

    // reset input
    const resetEvaluationUI = () => {
        // Textarea
        textAreaRefs.current.forEach(ref => {
            if (ref) ref.value = "";
        });

        // Reset evaluations
        setEvaluations({});

        // Reset attached files
        setAttachedFiles({});
    };

    const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

    type AssignmentEntry = {
        content: string;
        evaluations: {
            Basic: EvaluationData;
            Intermediate: EvaluationData;
            Advanced: EvaluationData;
        };
    };

    type EvaluationData = {
        code: string;
        note: string;
    };

    type RowEvaluation = {
        [key in ColumnType]: EvaluationData;
    };

    type ColumnType = "Basic" | "Intermediate" | "Advanced";

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

    const EvaluationCell = React.memo(({
                                           row,
                                           column,
                                           attachedFiles,
                                           setAttachedFiles,
                                           evaluations,
                                           setEvaluations
                                       }: {
        row: number;
        column: ColumnType;
        attachedFiles: Record<number, Record<ColumnType, File[]>>;
        setAttachedFiles: React.Dispatch<React.SetStateAction<Record<number, Record<ColumnType, File[]>>>>;
        evaluations: Record<number, RowEvaluation>;
        setEvaluations: React.Dispatch<React.SetStateAction<Record<number, RowEvaluation>>>;
    }) => {
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [note, setNote] = useState(evaluations[row]?.[column]?.note || "");
        const [isDialogOpen, setIsDialogOpen] = useState(false);

        useEffect(() => {
            setNote(evaluations[row]?.[column]?.note || "");
        }, [evaluations, row, column]);

        const handleAttachClick = () => {
            fileInputRef.current?.click();
        };

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setAttachedFiles(prev => ({
                    ...prev,
                    [row]: {
                        ...prev[row],
                        [column]: [...(prev[row]?.[column] || []), file]
                    }
                }));
                setIsDialogOpen(true);
            }
        };


        return (
            <td className="border p-2 text-center align-top">
                {/* File display section - if you want to show attached files */}
                    <a
                        //href={evaluations[row]?.[column]?.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mb-2 block"
                    >
                        View Attachment
                    </a>


                {/* Read-only code display */}
                <div className="w-full border rounded px-2 py-1 bg-gray-50 mb-2">
                    {evaluations[row]?.[column]?.code || "No evaluation"}
                </div>

                {/* Read-only notes display */}
                <div
                    className="w-full border rounded p-1 text-sm min-h-[4.5rem] bg-gray-50 text-left whitespace-pre-wrap"
                >
                    {evaluations[row]?.[column]?.note || "No notes"}
                </div>
            </td>
        );

    });

    const loadEvaluationFromJson = async () => {
        const unitName = "unit1";

        //const filePath = `${teacherName[0].TeacherName}/${studentClass[0].ClassName}/${unitName}/${studentId}/assignment.json`;
        const filePath = `taylor/${studentClass[0].ClassName}/${unitName}/${studentId}/assignment.json`;
        console.log("Fetching evaluation from:", filePath);

        const { data, error } = await supabase.storage
            .from("assignment")
            .download(filePath);

        if (error) {
            console.error("Supabase download error:", error.message, filePath);
            resetEvaluationUI();
            return;
        }

        try {
            const text = await data.text();
            const json = safeJsonParse<{ entries: any[] }>(text);

            if (!json || !Array.isArray(json.entries)) {
                console.warn("Invalid or missing entries in JSON.");
                return;
            }

            const entries = json.entries;

            if (!Array.isArray(textAreaRefs.current) || textAreaRefs.current.length < entries.length) {
                console.warn("Text area references are missing or insufficient.");
                return;
            }

            entries.forEach((entry, i) => {
                const textArea = textAreaRefs.current[i];
                if (textArea) {
                    textArea.value = entry.content || "";
                }
            });

            const levels: ColumnType[] = ["Basic", "Intermediate", "Advanced"];
            const loadedEvaluations: Record<number, RowEvaluation> = {};
            const loadedFiles: Record<number, Record<ColumnType, File[]>> = {};

            entries.forEach((entry, index) => {
                const evals = entry.evaluations ?? {};
                loadedEvaluations[index] = {} as RowEvaluation;
                loadedFiles[index] = {} as Record<ColumnType, File[]>;

                levels.forEach((level) => {
                    const levelData = evals[level] || {};
                    loadedEvaluations[index][level] = {
                        code: levelData.code || "",
                        note: levelData.note || ""
                    };

                    loadedFiles[index][level] = (levelData.files || []).map(
                        (name: string) => new File([], name)
                    );
                });
            });

            setEvaluations(loadedEvaluations);
            setAttachedFiles(loadedFiles);

        } catch (parseError) {
            console.error("Error parsing assignment JSON:", parseError);
        }
    };

// Utility function for safer JSON parsing
    function safeJsonParse<T>(text: string): T | null {
        try {
            return JSON.parse(text);
        } catch (err) {
            console.error("JSON parse error:", err);
            return null;
        }
    }

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
                            <label className="block mb-1 font-medium">Unit</label>
                            <select className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Choose a unit!</option>
                                {units.map((units) => (
                                    <option key={units.UnitID} value={units.UnitID}>
                                        {units.UnitName}
                                    </option>
                                ))}
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

                        {/* Table-Like Layout with Titles */}
                        <div className="overflow-x-auto">
                            <Table className="w-full table-auto border-collapse">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">Content</th>
                                    <th className="border p-2 text-center">Basic</th>
                                    <th className="border p-2 text-center">Intermediate</th>
                                    <th className="border p-2 text-center">Advanced</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border p-3 whitespace-pre-line text-sm align-top">
                                              <textarea
                                                  ref={el => {
                                                      textAreaRefs.current[index] = el;
                                                  }}
                                                  className="w-full border rounded p-2 my-2 bg-gray-50"
                                                  rows={4}
                                                  placeholder={`assignment #${index + 1}`}
                                                  readOnly
                                              />

                                        </td>
                                        <EvaluationCell
                                            row={index}
                                            column="Basic"
                                            attachedFiles={attachedFiles}
                                            setAttachedFiles={setAttachedFiles}
                                            evaluations={evaluations}
                                            setEvaluations={setEvaluations}
                                        />
                                        <EvaluationCell
                                            row={index}
                                            column="Intermediate"
                                            attachedFiles={attachedFiles}
                                            setAttachedFiles={setAttachedFiles}
                                            evaluations={evaluations}
                                            setEvaluations={setEvaluations}
                                        />
                                        <EvaluationCell
                                            row={index}
                                            column="Advanced"
                                            attachedFiles={attachedFiles}
                                            setAttachedFiles={setAttachedFiles}
                                            evaluations={evaluations}
                                            setEvaluations={setEvaluations}
                                        />
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}