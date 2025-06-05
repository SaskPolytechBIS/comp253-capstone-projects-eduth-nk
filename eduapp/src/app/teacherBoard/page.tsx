"use client";


import React, {useRef, useEffect, useState} from "react";
import { Bell } from "lucide-react"; // icon library or image
import { VscAccount } from "react-icons/vsc";
import ClientEditorModal from "@/components/ClientEditorModal";
import {redirect, useRouter} from "next/navigation";
import Cookies from "js-cookie";
import { createStudent, createClass } from '@/lib/create';
import { getStudentsFromClass, getTeacherClasses, getAllTeachers, getUnits} from "@/lib/select";
import { updateClass, updateUnit, updateAssignment, updateStudent } from "@/lib/update";
import Table from 'react-bootstrap/Table';
import {supabase} from "@/lib/supabase";
import { LegendModal, ClassModal,StudentModal,
    EditStudentModal,ClassModalEdit,ClassModalDelete, DeleteStudentModal} from '@/lib/Modals';



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
    const [studentUsername, setStudentUsername] = useState("");
    const [studentPassword, setStudentPassword] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [classTeacherId, setClassTeacherId] = useState("");

    //handle edit
    const [isStudentEditOpen, setIsStudentEditOpen] = useState(false);
    const [isClassEditOpen, setIsClassEditOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    //Delete Class
    const [isDeleteModalClassOpen, setIsDeleteModalClassOpen] = useState(false);
    const handleDelete = async () => {
        if (!selectedClassId) return;

        try {
            //Add more if needed
            console.log("Deleted class ID:", selectedClassId);

        } catch (error) {
            console.error("Failed to delete class:", error);
        }
    };

    //Delete Student
    const [isDeleteModalStudentOpen, setIsDeleteModalStudentOpen] = useState(false);
    const handleDeleteStudent = async () => {
        if (!selectedStudentId) return;

        try {
            //Add more if needed
            console.log("Deleted Student Id:", selectedStudentId);

        } catch (error) {
            console.error("Failed to delete class:", error);
        }
    };
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

    //populates the classes dropdown. WITHOUT THIS IT WILL BE STATIC.
    useEffect(() => {
        const loadClasses = async () => {
            try {
                const classResult = await getTeacherClasses(teacherId!);
                if (!Array.isArray(classResult)) {
                    alert("Error with populating classes: " + JSON.stringify(classResult));
                    return;
                }
                setClasses(classResult);
            } catch (error) {
                alert("Unexpected error: " + error);
            }
        };

        if (teacherId) {
            loadClasses();
        }
    }, [teacherId]);

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
            } catch (error) {
                alert("Unexpected error: " + error);
            }
        };

        fetchStudents();

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

    useEffect(() => {
        if (!classId) {
            return;
        }
        const loadUnits = async () => {
            try {
                const unitResult = await getUnits(classId);
                setUnits(unitResult ?? []);
            } catch (error) {
                alert("Unexpected error: " + error);
            }
        };
        loadUnits();
    }, [classId])

    //redirects to login if no teacher cookie
    if (teacherId == undefined) {
        router.push('/login')
    }

    const handleSelectChange = (event: { target: { value: any; }; }) => {
        const selectedClass = event.target.value;
        setClassId(selectedClass);
    }

    const handleClassSubmit = () => {
        console.log("Class:", className, "TeacherId:", classTeacherId);
        setClassName("");
        setShowClassModal(false);
        createClass(className, classTeacherId);
    };

    const handleStudentSubmit = () => {
        console.log("Student:", studentName, "Username:", studentUsername, "Password:", studentPassword, "Class", studentClass);
        setStudentName("");
        setStudentUsername("");
        setShowStudentModal(false);
        createStudent(studentName, studentClass, studentUsername, studentPassword);
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
        // TODO: save to DB
    };


    const handleStudentEditSubmit = () => {
        // update logic here
        updateStudent(selectedStudentId, studentName, studentClass,studentUsername, studentPassword);
        setIsStudentEditOpen(false);
    };

    const handleClassEditSubmit = () => {
        // handle update logic here
        updateClass(selectedClassId, className, classTeacherId);
        setIsClassEditOpen(false);
    };

    type ColumnType = "Basic" | "Intermediate" | "Advanced";
    // Attach files
    const [attachedFiles, setAttachedFiles] = useState<Record<number, Record<ColumnType, File[]>>>({});

    // show Dialog attach image
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Evaluation Cell Component
    const EvaluationCell = React.memo(({
                                row,
                                column,
                                attachedFiles,
                                setAttachedFiles,
                            }: {
        row: number;
        column: ColumnType;
        attachedFiles: Record<number, Record<ColumnType, File[]>>;
        setAttachedFiles: React.Dispatch<
            React.SetStateAction<Record<number, Record<ColumnType, File[]>>>
        >;
    }) => {
        console.log("EvaluationCell render")
        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleAttachClick = () => {
            console.log("go to handleAttachClick")
            fileInputRef.current?.click();
        };

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            console.log("go to handleFileChange")
            const file = e.target.files?.[0];
            if (file) {
                setAttachedFiles((prev) => ({
                    ...prev,
                    [row]: {
                        ...prev[row],
                        [column]: [...(prev[row]?.[column] || []), file],
                    },
                }));

                // Show dialog
                setIsDialogOpen(true);
            }
        };

        return (
            <td className="border p-3 text-center text-xs align-top">
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
                        onClick={() => handleAttachClick()}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                    >
                        Attach
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                    {attachedFiles[row]?.[column]?.length > 0 && (
                        <ul className="text-xs mt-1 list-disc list-inside">
                            {attachedFiles[row][column].map((f, idx) => (
                                <li key={idx}>{f.name}</li>
                            ))}
                        </ul>
                    )}
                    {/* Upload Successful Dialog */}
                    {isDialogOpen && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                            <div className="bg-white border border-gray-300 p-4 rounded shadow-lg max-w-sm text-center">
                                <h2 className="text-base font-semibold mb-2">Attach Successful</h2>
                                <button
                                    onClick={() => setIsDialogOpen(false)}
                                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </td>
        );
    });

    // Save image to DB
    const uploadFiles = async () => {
        for (const row in attachedFiles) {
            const columns = attachedFiles[parseInt(row)];
            for (const column in columns) {
                const files = columns[column as ColumnType];
                for (const file of files) {
                    const filePath = `teacher/${Date.now()}-${file.name}`;
                    const { error } = await supabase.storage
                        .from('developing')
                        .upload(filePath, file);

                    if (error) {
                        console.error(`Upload failed: ${file.name}`, error.message);
                    } else {
                        console.log(`Uploaded: ${file.name} as ${filePath}`);

                    }
                }
            }
        }
    };

    // show menu class
    const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
    const [isDropdownClassOpen, setIsDropdownClassOpen] = useState(false);
    // show menu student
    const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
    const [isDropdownStudentOpen, setIsDropdownStudentOpen] = useState(false);
    //show unit
    const [isDropdownUnitOpen, setIsDropdownUnitOpen] = useState(false);
    const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false);


    // @ts-ignore
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
                           onDelete={handleDelete}
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
                               setIsDropdownUnitOpen(false);
                           }}
                           className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700"
                       >
                           Unit
                       </button>

                       {isDropdownUnitOpen && (
                           <div className="absolute z-10 mt-2 w-44 bg-white rounded shadow-md border border-gray-200 text-black">
                               <button
                                   onClick={() => {
                                       setIsUnitMenuOpen(true);
                                       setIsDropdownUnitOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Create Unit
                               </button>
                               <button
                                   onClick={() => {
                                       setIsUnitMenuOpen(true);
                                       setIsDropdownUnitOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Edit Unit
                               </button>
                               <button
                                   onClick={() => {
                                       setIsUnitMenuOpen(true);
                                       setIsDropdownUnitOpen(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                               >
                                   Delete Unit
                               </button>

                           </div>
                       )}

                       {/* Modal Unit */}

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
                            <select className="w-full border rounded px-3 py-2" onChange={handleSelectChange} >
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
                            <select className="w-full border rounded px-3 py-2">
                                {units.map((units) => (
                                    <option key={units.UnitID} value={units.UnitID}>
                                        {units.UnitName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="w-full mb-4 bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700">
                            Show Map
                        </button>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Student</label>
                            <select className="w-full border rounded px-3 py-2">
                                {students.map((students) => (
                                    <option key={students.StudentID} value={students.StudentName}>
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
                                        />
                                        <EvaluationCell
                                            row={index}
                                            column="Intermediate"
                                            attachedFiles={attachedFiles}
                                            setAttachedFiles={setAttachedFiles}
                                        />
                                        <EvaluationCell
                                            row={index}
                                            column="Advanced"
                                            attachedFiles={attachedFiles}
                                            setAttachedFiles={setAttachedFiles}
                                        />
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <div className="text-right mt-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={uploadFiles}>
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
        </div>

    );
}