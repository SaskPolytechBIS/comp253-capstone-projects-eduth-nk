"use client";


import React, {useRef, useEffect, useState} from "react";
import { Bell } from "lucide-react"; // icon library or image
import { VscAccount } from "react-icons/vsc";
import ClientEditorModal from "@/components/ClientEditorModal";
import {redirect, useRouter} from "next/navigation";
import Cookies from "js-cookie";
import { createStudent, createClass, createUnit } from '@/lib/create';
import { getStudentsFromClass, getTeacherClasses, getAllTeachers, getUnits} from "@/lib/select";
import { updateClass, updateUnit, updateAssignment, updateStudent } from "@/lib/update";
import { deleteClass, deleteStudent, deleteUnit } from "@/lib/delete";
import Table from 'react-bootstrap/Table';
import {supabase} from "@/lib/supabase";
import {
    LegendModal, ClassModal, StudentModal, UnitModal,
    EditStudentModal, ClassModalEdit, ClassModalDelete, DeleteStudentModal, UnitModalEdit, UnitModalDelete
} from '@/lib/Modals';



export default function TeacherDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignmentContent, setAssignmentContent] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const teacherId = Cookies.get('teacherId')

    //handle pop-up modal for add class and student
    const [showClassModal, setShowClassModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [className, setClassName] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [studentUsername, setStudentUsername] = useState("");
    const [studentPassword, setStudentPassword] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [classTeacherId, setClassTeacherId] = useState("");
    const [jsonUnitId, setJsonUnitId] = useState("");

    //handle edit
    const [isStudentEditOpen, setIsStudentEditOpen] = useState(false);

    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    //Delete Class
    const [isDeleteModalClassOpen, setIsDeleteModalClassOpen] = useState(false);
    //Delete Student
    const [isDeleteModalStudentOpen, setIsDeleteModalStudentOpen] = useState(false);

    //show pop up for legend
    const [showPopup, setShowPopup] = useState(false);

    // Show legendItems
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

    //populations
    const [classId, setClassId] = useState("");
    const [classes, setClasses] = useState([{ClassID: "0", ClassName: "Error"}]);
    const [students, setStudents] = useState([{StudentID: "0", StudentName: "Empty"}]);
    const [teachers, setTeachers] = useState([{TeacherID: "0", TeacherName: "Error"}]);
    const [units, setUnits] = useState([{UnitID: "0", UnitName: "Empty"}])

    //redirects to login if no teacher cookie
    if (teacherId == undefined) {
        router.push('/login')
    }

    //populates the classes dropdown. WITHOUT THIS IT WILL BE STATIC.
    useEffect(() => {
        if (teacherId) {
            loadClasses();
        }
    }, [teacherId]);

    const loadClasses = async () => {
        try {
            const classResult = await getTeacherClasses(teacherId!);
            if (!Array.isArray(classResult)) {
                console.log("Error with populating classes: " + JSON.stringify(classResult));
                return;
            }
            setClasses(classResult);
        } catch (error) {
            console.log("Unexpected error: " + error);
        }
    };

    //update students useEffect. WILL BE STATIC WITHOUT
    useEffect(() => {
        if (!classId) return;

        let isCurrent = true;

        const fetchStudents = async () => {
            try {
                const studentsResult = await getStudentsFromClass(classId);
                if (!isCurrent) return;

                if (!Array.isArray(studentsResult)) {
                    alert("Error with populating classes: " + JSON.stringify(studentsResult));
                    return;
                }

                if (studentsResult.length === 0) {
                    alert("No students applicable.");
                    console.log("No students.");
                    return;
                }

                setStudents(studentsResult);

                const [firstStudent] = studentsResult;
                if (firstStudent?.StudentName && firstStudent?.StudentID) {
                    setStudentName(firstStudent.StudentName);
                    setStudentId(firstStudent.StudentID);
                    await loadEvaluationFromJson();
                } else {
                    console.warn("First student record is missing required fields.");
                }
            } catch (error) {
                alert("Unexpected error: " + error);
            }
        };

        fetchStudents();

        return () => {
            isCurrent = false;
        }

    }, [classId]);

    //update teachers. WILL BE STATIC OTHERWISE
    useEffect(() => {
        const loadTeachers = async () => {
            try {
                const teacherResult = await getAllTeachers();
                setTeachers(teacherResult ?? []);
            } catch (error) {
                alert("Unexpected error: " + error);
            }
        };
        loadTeachers();
    }, []);

    //get units
    useEffect(() => {
        if (!classId) {
            return;
        }
        fetchUnits()
    }, [classId])

    async function fetchUnits() {
        try {
            const unitResult = await getUnits(classId);
            setUnits(unitResult ?? []);
        } catch (error) {
            alert("Unexpected error: " + error);
        }
    }

    useEffect(() => {
        // Initialize 5 row
        const initialEvaluations: Record<number, RowEvaluation> = {};
        for (let i = 0; i < 5; i++) {
            initialEvaluations[i] = {
                Basic: { code: "", note: "" },
                Intermediate: { code: "", note: "" },
                Advanced: { code: "", note: "" }
            };
        }
        setEvaluations(initialEvaluations);
    }, []);

    useEffect(() => {
        if (studentId && jsonUnitId) {
            loadEvaluationFromJson();
            loadUnitContent();
        }
    }, [studentId, jsonUnitId]);

    useEffect(() => {
        // when change classId → reset content (clear textarea)
        textAreaRefs.current.forEach(ref => {
            if (ref) ref.value = "";
        });

        setJsonUnitId("");
        setEvaluations({});
        setAttachedFiles({});
    }, [classId]);

    //handle create UNITs
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [unitName, setUnitName] = useState('');
    const [isEditUnitOpen, setIsEditUnitOpen] = useState(false);
    const [isDeleteUnitOpen, setIsDeleteUnitOpen] = useState(false);
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [description1, setDescription1] = useState('');
    const [description2, setDescription2] = useState('');
    const [description3, setDescription3] = useState('');
    const [description4, setDescription4] = useState('');
    const [description5, setDescription5] = useState('');


    const handleCreateUnit = async () => {
        if (!unitName.trim()) {
            alert("Please enter a unit name");
            return;
        }

        if (!classId) {
            alert("Please select a class");
            return;
        }

        try {
            // Get students for the selected class
            const studentsResult = await getStudentsFromClass(classId);
            const selectedClass = classes.find(c => String(c.ClassID) === String(classId))
            if (!selectedClass) throw new Error("Selected class not found");
            setClassName(selectedClass.ClassName);

            // 1. Create Unit in DB
            const newUnitId = await createUnit(
                classId,
                unitName,
                studentsResult,
                selectedClass.ClassName,
                description1 || '',
                description2 || '',
                description3 || '',
                description4 || '',
                description5 || ''
            );

            if (!newUnitId) {
                alert("Failed to create unit");
                return;
            }

            // 2. Save content to Supabase Storage
            const contentData = {
                unitId: newUnitId,
                unitName,
                descriptions: [
                    description1,
                    description2,
                    description3,
                    description4,
                    description5
                ]
            };

            const contentBlob = new Blob(
                [JSON.stringify(contentData, null, 2)],
                { type: "application/json" }
            );

            const teacherName = Cookies.get("teacherName");
            const contentPath = `${teacherName}/${selectedClass.ClassName}/${newUnitId}/unit_content.json`;

            const { error: contentError } = await supabase.storage
                .from('assignment')
                .upload(contentPath, contentBlob, { upsert: true });

            if (contentError) {
                console.error("Failed to upload unit content JSON:", contentError.message);
                alert("Unit created but failed to save content.");
                return;
            }

            console.log("✅ Uploaded unit_content.json");

            // 3. Reset form
            setUnitName('');
            setDescription1('');
            setDescription2('');
            setDescription3('');
            setDescription4('');
            setDescription5('');

            // 4. Close modal
            setIsUnitModalOpen(false);

            // 5. Refresh units and select the new unit
            const unitResult = await getUnits(classId);
            setUnits(unitResult ?? []);

            // 6. Set new unit ID to display content - moved this after units refresh
            setJsonUnitId(newUnitId);

            // 7. Load the unit content immediately
            await loadUnitContent();

        } catch (error) {
            console.error("Error creating unit:", error);
            alert(`Failed to create unit: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };


    const loadUnitContent = async () => {
        if (!jsonUnitId || !className) return;

        const teacherName = Cookies.get("teacherName");
        const contentPath = `${teacherName}/${className}/${jsonUnitId}/unit_content.json`;

        const { data, error } = await supabase.storage
            .from("assignment")
            .download(contentPath);

        if (error) {
            console.error("Failed to load unit content:", error.message);
            // If file not exits, clear textarea content
            textAreaRefs.current.forEach((ref) => {
                if (ref) ref.value = "";
            });
            return;
        }

        try {
            const text = await data.text();
            const json = JSON.parse(text);

            const descriptions = json.descriptions || [];

            // textAreaRefs.current.forEach(ref => {
            //     if (ref) ref.value = "";
            // });

            descriptions.forEach((desc: string, i: number) => {
                const textArea = textAreaRefs.current[i];
                if (textArea) {
                    textArea.value = desc;
                }
            });
        } catch (err) {
            console.error("Failed to parse unit content JSON:", err);
        }
    };



    const handleEditUnitSubmit = async () => {
        console.log("Editing unit:", selectedUnitId, unitName);
        // call API
        await updateUnit(selectedUnitId, unitName, classId)
        setIsEditUnitOpen(false);
        setSelectedUnitId('');
        setUnitName('');
    };

    const handleDeleteUnit = async () => {
        console.log("Deleting unit:", selectedUnitId);
        // call API
        await deleteUnit(selectedUnitId)
        setIsDeleteUnitOpen(false);
        setSelectedUnitId('');
        fetchUnits();
    };


    // reset input
    const resetEvaluationUI = () => {
        // Textarea
        //textAreaRefs.current.forEach(ref => {
        //    if (ref) ref.value = "";
        //});
//
        // Reset evaluations
        setEvaluations({});

        // Reset attached files
        setAttachedFiles({});
    };

    // when change dropdown list class
    const handleSelectClassChange = (event: { target: { value: any; }; }) => {
        const selectedClassId = event.target.value;
        console.log("Selected class ID:", selectedClassId);
        console.log("Available classes:", classes);
        console.log("Matching class:", classes.find(c => String(c.ClassID) === String(selectedClassId)));

        setClassId(selectedClassId);

        const selectedClass = classes.find(c => String(c.ClassID) === String(selectedClassId));
        if (selectedClass) {
            setClassName(selectedClass.ClassName);
        }
    }


    const handleClassSubmit = async () => {
        console.log("Class:", className, "TeacherId:", classTeacherId);
        setClassName("");
        setShowClassModal(false);
        await createClass(className, classTeacherId)
        await loadClasses();

    };

    const handleStudentSubmit = async () => {
        console.log("Student:", studentName, "Username:", studentUsername, "Password:", studentPassword, "Class", studentClass);
        setStudentName("");
        setStudentUsername("");
        setStudentPassword("")
        setShowStudentModal(false);
        await createStudent(studentName, studentClass, studentUsername, studentPassword);
    };

    // Handle logout
    const handleLogout = () => {
        Cookies.remove("teacherId");
        redirect("/login");// Redirect to login
    };

    const handleModalSave = (content: string) => {
        console.log("Assignment Content:", content);
        setAssignmentContent(content);
        setIsModalOpen(false);

    };

    const handleStudentEditSubmit = () => {
        // update logic here
        updateStudent(selectedStudentId, studentName, studentClass,studentUsername, studentPassword);
        setIsStudentEditOpen(false);
    };

    const handleClassEditSubmit = () => {
        // handle update logic here
        updateClass(selectedClassId, className, classTeacherId);
        // Reset all states
        setSelectedClassId("");
        setClassName("");
        setClassTeacherId("");

        setIsClassMenuOpen(false);
    };

    const handleDeleteClass = async () => {
        if (!selectedClassId) return;
        deleteClass(selectedClassId);
        setIsDeleteModalClassOpen(false);
    };

    const handleDeleteStudent = async () => {
        if (!selectedStudentId) return;
        deleteStudent(selectedStudentId);
        // Reset the selection
        setSelectedStudentId("");
        // Close the modal
        setIsDeleteModalStudentOpen(false);
    };

    type ColumnType = "Basic" | "Intermediate" | "Advanced";
    // Attach files
    const [attachedFiles, setAttachedFiles] = useState<Record<number, Record<ColumnType, File[]>>>({});

    // show Dialog update successful
    const [isUploadSuccessDialogOpen, setIsUploadSuccessDialogOpen] = useState(false);

    type EvaluationData = {
        code: string;
        note: string;
    };

    type RowEvaluation = {
        [key in ColumnType]: EvaluationData;
    };

    const [evaluations, setEvaluations] = useState<Record<number, RowEvaluation>>({});

    // Evaluation Cell Component
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
            // Sync with external evaluations if changed outside
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
                setIsDialogOpen(true); // Show success dialog
            }
        };

        const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const code = e.target.value;
            setEvaluations(prev => ({
                ...prev,
                [row]: {
                    ...prev[row],
                    [column]: {
                        ...(prev[row]?.[column] || { code: "", note: "" }),
                        code
                    }
                }
            }));
        };

        const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNote(e.target.value);
        };

        const handleNoteBlur = () => {
            setEvaluations(prev => ({
                ...prev,
                [row]: {
                    ...prev[row],
                    [column]: {
                        ...(prev[row]?.[column] || { code: "", note: "" }),
                        note
                    }
                }
            }));
        };

        return (
            <td className="border p-3 text-center text-xs align-top relative">
                <div className="mb-2">
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={evaluations[row]?.[column]?.code || ""}
                        onChange={handleCodeChange}
                    >
                        <option value=""></option>
                        {legendItems.map((item, idx) => (
                            <option key={idx} value={item.code}>{item.code}</option>
                        ))}
                    </select>
                </div>

                <textarea
                    className="w-full border rounded px-2 py-1 mb-2 text-xs"
                    placeholder="Note..."
                    value={note}
                    onChange={handleNoteChange}
                    onBlur={handleNoteBlur}
                />

                <div>
                    <button
                        onClick={handleAttachClick}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                    >
                        Attach
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                    {attachedFiles[row]?.[column]?.length > 0 && (
                        <ul className="text-xs mt-1 list-disc list-inside">
                            {attachedFiles[row]?.[column]?.map((f: any, idx: number) => {
                                const fileName = (f.name).replace(/^(\d+-)+/, "");
                                const filePath = f.fullPath || f.path || "";
                                const url = `https://teihpfddelngadtkdtaz.supabase.co/storage/v1/object/public/developing/${filePath}`;

                                return (
                                    <li key={idx}>
                                        <span
                                            onClick={() => setPreviewUrl(url)}
                                            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                                            title="Click to view"
                                        >
                                            {fileName}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Upload Success Dialog */}
                {isDialogOpen && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-300 p-4 rounded shadow-lg text-center">
                        <h2 className="text-sm font-semibold mb-2">Attach Successful</h2>
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="px-4 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                            OK
                        </button>
                    </div>
                )}
            </td>
        );
    });

    type AttachedFile = File | { name: string; fullPath: string };
    // Save image to DB
    const uploadFiles = async (
        attachedFiles: Record<number, Record<ColumnType, AttachedFile[]>>
    ): Promise<Record<number, Record<ColumnType, string[]>>> => {

        const uploadedPaths: Record<number, Record<ColumnType, string[]>> = {};

        for (const rowStr in attachedFiles) {
            const row = parseInt(rowStr);
            const columns = attachedFiles[row];

            // create 3 rows for each evaluation
            uploadedPaths[row] = {
                Basic: [],
                Intermediate: [],
                Advanced: [],
            };

            for (const column in columns) {
                const colKey = column as ColumnType;
                const files = columns[colKey];

                for (const file of files) {
                    if (file instanceof File) {
                        // if new attach file
                        const filePath = `teacher/${Date.now()}-${file.name}`;

                        const { error } = await supabase.storage
                            .from("developing")
                            .upload(filePath, file, { upsert: true });

                        if (error) {
                            console.error(` Upload failed: ${file.name}`, error.message);
                        } else {
                            console.log(`Uploaded: ${file.name} → ${filePath}`);
                            uploadedPaths[row][colKey].push(filePath);
                        }
                    } else if ("fullPath" in file && typeof file.fullPath === "string") {
                        // if attached file
                        uploadedPaths[row][colKey].push(file.fullPath);
                    } else {
                        console.warn("Unknown file type", file);
                    }
                }
            }
        }

        return uploadedPaths;
    };


    // show menu class
    const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
    const [isDropdownClassOpen, setIsDropdownClassOpen] = useState(false);
    // show menu student
    const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
    const [isDropdownStudentOpen, setIsDropdownStudentOpen] = useState(false);
    //show unit
    const [isDropdownUnitOpen, setIsDropdownUnitOpen] = useState(false);


    // collect data in textarea
    const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

    type AssignmentEntry = {
        //content: string;
        evaluations: {
            Basic: EvaluationData;
            Intermediate: EvaluationData;
            Advanced: EvaluationData;
        };
    };

    const gatherEvaluationData = (uploadedPaths: Record<number, Record<ColumnType, string[]>>): any => {
        const levels: ColumnType[] = ["Basic", "Intermediate", "Advanced"];

        const entries: AssignmentEntry[] = Array.from({ length: 5 }, (_, index) => {
            //const content = textAreaRefs.current[index]?.value || "";
            const rowEval = evaluations[index] || {};

            const evaluationsByLevel = levels.reduce((acc, level) => {
                const evalData = rowEval[level] || { code: "", note: "" };
                const files = uploadedPaths?.[index]?.[level] || [];

                acc[level] = {
                    code: evalData.code || "",
                    note: evalData.note || "",
                    files
                };

                return acc;
            }, {} as Record<ColumnType, { code: string; note: string; files: string[] }>);

            return {
                //content,
                evaluations: evaluationsByLevel,
            };
        });

        return {
            teacherId: Cookies.get("teacherId") || "",
            classId: classId || "",
            timestamp: new Date().toISOString(),
            entries,
        };
    };

    // Save to Json file
    const uploadJsonFile = async () => {
        // debug

        const uploadedPaths = await uploadFiles(attachedFiles);

        const mapData = gatherEvaluationData(uploadedPaths);

        const filePath = `${Cookies.get("teacherName")}/${className}/${jsonUnitId}/${studentId}/assignment.json`;
        const contentPath = `${Cookies.get("teacherName")}/${className}/${jsonUnitId}/unit_content.json`;

        console.log(filePath);
        const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: "application/json" });

        const { error } = await supabase.storage
            .from('assignment')
            .upload(filePath, blob, { upsert: true });

        if (error) {
            console.error("Failed to upload JSON:", error.message);
        } else {
            console.log("Uploaded map.json successfully!");
        }

        // Update Content Json File
        const contentDescriptions: string[] = textAreaRefs.current.map((ref) =>
            ref?.value?.trim() || ""
        );

        const contentData = {
            unitId: jsonUnitId,
            unitName,
            descriptions: contentDescriptions,
        };

        const contentBlob = new Blob([JSON.stringify(contentData, null, 2)], {
            type: "application/json",
        });

        const { error: contentError } = await supabase.storage
            .from("assignment")
            .upload(contentPath, contentBlob, { upsert: true });

        if (contentError) {
            console.error("Failed to update unit_content.json:", contentError.message);
        } else {
            console.log("Updated unit_content.json with new content");
        }

        setIsUploadSuccessDialogOpen(true);
    };

    const loadEvaluationFromJson = async () => {

        console.log(studentId, jsonUnitId)

        if (!studentId || Number(studentId) <= 1) {
            console.warn("Invalid or missing student ID. Skipping evaluation load.");
            return;
        }

        if (!jsonUnitId || Number(jsonUnitId) <= 1 ) {
            console.warn("Invalid or missing unit ID. Skipping evaluation load.");
            return;
        }

        const teacherName = Cookies.get("teacherName");

        const filePath = `${teacherName}/${className}/${jsonUnitId}/${studentId}/assignment.json`;
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

            // if (!Array.isArray(textAreaRefs.current) || textAreaRefs.current.length < entries.length) {
            //     console.warn("Text area references are missing or insufficient.");
            //     return;
            // }
            //
            // entries.forEach((entry, i) => {
            //     const textArea = textAreaRefs.current[i];
            //     if (textArea) {
            //         textArea.value = entry.content || "";
            //     }
            // });

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

                    loadedFiles[index][level] = (levelData.files || []).map((path: string) => {
                        // Extract file name for display
                        const parts = path.split("/");
                        const fileName = parts[parts.length - 1];

                        return {
                            name: fileName,
                            fullPath: path
                        } as any;
                    });
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

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    return (
        <div className="flex flex-col min-h-screen ">
            {/* Top Banner */}
            <header className="w-full bg-violet-700 px-6 py-4 flex justify-between items-center ">
               <div className="flex space-x-4">

                   <div className="relative inline-block text-left">
                       <button
                           onClick={() => {
                               setIsDropdownClassOpen((prev) => !prev);
                               setIsDropdownStudentOpen(false);
                           }}
                           className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700"
                       >
                           Class
                       </button>

                       {isDropdownClassOpen && (
                           <div className="absolute z-10 mt-2 w-40 bg-white rounded shadow-md border border-gray-200 text-black">
                               <button
                                   onClick={() => {
                                       setShowClassModal(true);
                                       setIsDropdownClassOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Create Class
                               </button>
                               <button
                                   onClick={() => {
                                       setIsClassMenuOpen(true);
                                       setIsDropdownClassOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Edit Class
                               </button>
                               <button
                                   onClick={() => {
                                       setIsDeleteModalClassOpen(true);
                                       setIsDropdownClassOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Delete Class
                               </button>
                           </div>
                       )}

                       {/* Modals */}
                       <ClassModal
                           isOpen={showClassModal}
                           onClose={() => setShowClassModal(false)}
                           onSubmit={handleClassSubmit}
                           className={className}
                           setClassName={setClassName}
                           teachers={teachers}
                           teacherId={classTeacherId}
                           setTeacherId={setClassTeacherId}
                       />

                       <ClassModalEdit
                           isOpen={isClassMenuOpen}
                           onClose={() => setIsClassMenuOpen(false)}
                           onSubmit={handleClassEditSubmit}
                           className={className}
                           setClassName={setClassName}
                           teacherId={classTeacherId}
                           setTeacherId={setClassTeacherId}
                           selectedClassId={selectedClassId}
                           setSelectedClassId={setSelectedClassId}
                           classes={classes}
                           teachers={teachers}
                       />

                       <ClassModalDelete
                           isOpen={isDeleteModalClassOpen}
                           onClose={() => setIsDeleteModalClassOpen(false)}
                           onDelete={handleDeleteClass}
                           selectedClassId={selectedClassId}
                           setSelectedClassId={setSelectedClassId}
                           classes={classes}
                       />

                   </div>
                   <div className="relative inline-block text-left">
                       <button
                           onClick={() => {
                               setIsDropdownStudentOpen((prev) => !prev);
                               setIsDropdownClassOpen(false);
                           }}
                           className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700"
                       >
                           Student
                       </button>

                       {isDropdownStudentOpen && (
                           <div className="absolute z-10 mt-2 w-44 bg-white rounded shadow-md border border-gray-200 text-black">
                               <button
                                   onClick={() => {
                                       setIsStudentMenuOpen(true);
                                       setIsDropdownStudentOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Create Student
                               </button>
                               <button
                                   onClick={() => {
                                       setIsStudentEditOpen(true); // open EditStudentModal
                                       setIsDropdownStudentOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Edit Student
                               </button>
                               <button
                                   onClick={() => {
                                       setIsDeleteModalStudentOpen(true);
                                       setIsDropdownStudentOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Delete Student
                               </button>

                           </div>
                       )}

                       {/* Modal create student */}
                       <StudentModal
                           isOpen={isStudentMenuOpen}
                           onClose={() => setIsStudentMenuOpen(false)}
                           onSubmit={handleStudentSubmit}
                           studentName={studentName}
                           setStudentName={setStudentName}
                           studentUsername={studentUsername}
                           setStudentUsername={setStudentUsername}
                           studentPassword={studentPassword}
                           setStudentPassword={setStudentPassword}
                           classes={classes}
                           setStudentClass={setStudentClass}
                           studentClass={studentClass}
                       />

                       {/* Modal edit student */}
                       <EditStudentModal
                           isOpen={isStudentEditOpen}
                           onClose={() => setIsStudentEditOpen(false)}
                           onSubmit={handleStudentEditSubmit}
                           students={students.map((s) => ({
                               id: s.StudentID,
                               name: s.StudentName,
                               username: s.StudentName,
                               password: "",
                               classId: "",
                           }))}
                           selectedStudentId={selectedStudentId}
                           setSelectedStudentId={setSelectedStudentId}
                           studentName={studentName}
                           setStudentName={setStudentName}
                           studentUsername={studentUsername}
                           setStudentUsername={setStudentUsername}
                           studentPassword={studentPassword}
                           setStudentPassword={setStudentPassword}
                           studentClass={studentClass}
                           setStudentClass={setStudentClass}
                           classes={classes}
                       />

                       {/* Modal Delete student */}
                       <DeleteStudentModal
                           isOpen={isDeleteModalStudentOpen}
                           onClose={() => setIsDeleteModalStudentOpen(false)}
                           onDelete={handleDeleteStudent}
                           selectedStudentId={selectedStudentId}
                           setSelectedStudentId={setSelectedStudentId}
                           students={students.map((s) => ({
                               id: s.StudentID,
                               name: s.StudentName,
                               username: s.StudentName,
                               password: "",
                               classId: "",
                           }))}
                       />
                   </div>


                   <div className="relative inline-block text-left">
                       <button
                           onClick={() => {
                               setIsDropdownUnitOpen((prev) => !prev);
                               setIsDropdownClassOpen(false);
                               setIsDropdownStudentOpen(false);
                           }}
                           className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700"
                       >
                           Unit
                       </button>

                       {isDropdownUnitOpen && (
                           <div className="absolute z-10 mt-2 w-44 bg-white rounded shadow-md border border-gray-200 text-black">
                               <button
                                   onClick={() => {
                                       setIsUnitModalOpen(true);
                                       setIsDropdownUnitOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Create Unit
                               </button>
                               <button
                                   onClick={() => {
                                       setIsEditUnitOpen(true);
                                       setIsDropdownUnitOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Edit Unit
                               </button>
                               <button
                                   onClick={() => {
                                       setIsDeleteUnitOpen(true);
                                       setIsDropdownUnitOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Delete Unit
                               </button>
                           </div>
                       )}

                       {/* Modal Create */}
                       <UnitModal
                           isOpen={isUnitModalOpen}
                           onClose={() => setIsUnitModalOpen(false)}
                           onSubmit={handleCreateUnit}
                           unitName={unitName}
                           setUnitName={setUnitName}
                           classId={classId}
                           setClassId={setClassId}
                           classes={classes}
                           content1={description1}
                           setDescription1={setDescription1}
                           content2={description2}
                           setDescription2={setDescription2}
                           content3={description3}
                           setDescription3={setDescription3}
                           content4={description4}
                           setDescription4={setDescription4}
                           content5={description5}
                           setDescription5={setDescription5}
                       />

                       <UnitModalEdit
                           isOpen={isEditUnitOpen}
                           onClose={() => {
                               setIsEditUnitOpen(false);
                               setSelectedUnitId('');
                               setUnitName('');
                               setClassId('');
                           }}
                           onSubmit={handleEditUnitSubmit}
                           selectedUnitId={selectedUnitId}
                           setSelectedUnitId={setSelectedUnitId}
                           unitName={unitName}
                           setUnitName={setUnitName}
                           classId={classId}
                           setClassId={setClassId}
                           units={units}
                           classes={classes}
                       />

                       {/* Modal Delete */}
                       <UnitModalDelete
                           isOpen={isDeleteUnitOpen}
                           onClose={() => {
                               setIsDeleteUnitOpen(false);
                               setSelectedUnitId('');
                           }}
                           onDelete={handleDeleteUnit}
                           selectedUnitId={selectedUnitId}
                           setSelectedUnitId={setSelectedUnitId}
                           units={units}

                       />
                   </div>
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
                                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-default" disabled>
                                    Welcome, {Cookies.get("teacherName")}
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
                            {/*
                            Populates class list with classes
                            */}
                            <select className="w-full border rounded px-3 py-2" onChange={handleSelectClassChange} >
                                <option value={0}>Choose a class!</option>
                                {classes.map((classes) => (
                                    <option key={classes.ClassID} value={classes.ClassID}>
                                        {classes.ClassName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Unit</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={jsonUnitId}
                                onChange={(e) => {
                                    setJsonUnitId(e.target.value)
                                }}
                            >
                                <option value="" disabled>Please select</option>
                                {units.map((unit) => (
                                    <option key={unit.UnitID} value={unit.UnitID}>
                                        {unit.UnitName}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <button className="w-full mb-4 bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700">
                            Show Map
                        </button>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Student</label>
                            <select className="w-full border rounded px-3 py-2"
                                    onChange={(e) => {
                                        setStudentId(e.target.value);}}
                            >
                                {students.map((students) => (
                                    <option key={students.StudentID} value={students.StudentID}>
                                        {students.StudentName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="w-full bg-purple-600 text-white rounded px-3 py-2 hover:bg-purple-700">
                            Show Map
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-2/3 bg-white p-4 rounded-xl shadow overflow-x-auto">
                        {/* Top Buttons */}
                        <div className="flex justify-end gap-2 mb-4">
                            <button
                                onClick={() => setShowPopup(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Show Legend
                            </button>

                            <LegendModal
                                isOpen={showPopup}
                                onClose={() => setShowPopup(false)}
                                items={legendItems}
                            />
                        </div>
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
                                                  className="w-full border rounded p-2 my-2 "
                                                  rows={4}
                                                  placeholder={`Click to create assignment #${index + 1}`}
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

                        <div className="text-right mt-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={async () => {
                                        await uploadJsonFile();
                                        // show dialog
                                        setIsUploadSuccessDialogOpen(true);
                                        location.reload();
                                    }}
                            >
                                Update Map
                            </button>
                        </div>

                    </div>
                </div>

            </div>
            {isUploadSuccessDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm text-centern text-black">
                        <h2 className="text-base font-semibold mb-2 text-black">Update Successful</h2>
                        <p className="mb-4 text-sm text-black">Your evaluation data has been saved successfully.</p>
                        <button
                            onClick={() => setIsUploadSuccessDialogOpen(false)}
                            className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
            {previewUrl && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <div className="bg-white w-[80%] h-[80%] relative rounded-lg overflow-hidden shadow-lg">
                        <button
                            onClick={() => setPreviewUrl(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded px-3 py-1"
                        >
                            Close
                        </button>
                        <iframe
                            src={previewUrl}
                            width="100%"
                            height="100%"
                            className="border-none"
                        ></iframe>
                    </div>
                </div>
            )}
            {/* Modal Component */}
            <ClientEditorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalSave}
                initialContent={assignmentContent}
            />
        </div>

    );
}