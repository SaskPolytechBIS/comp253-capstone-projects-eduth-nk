"use client";


import React, {useRef, useEffect, useState} from "react";
import { Bell } from "lucide-react"; // icon library or image
import { VscAccount } from "react-icons/vsc";
import ClientEditorModal from "@/components/ClientEditorModal";
import {redirect, useRouter} from "next/navigation";
import Cookies from "js-cookie";
import { createStudent, createClass } from '@/lib/create';
import { getStudentsFromClass, getTeacherClasses, getAllTeachers} from "@/lib/select";
import Table from 'react-bootstrap/Table';
import { LegendModal, ClassModal,StudentModal,EditModal} from '@/lib/Modals';



export default function TeacherDashboard() {
    const [userName, setUserName] = useState("sample");
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

    //show pop up for legend
    const [showPopup, setShowPopup] = useState(false);

    //handle edit
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');


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
    const [students, setStudents] = useState([{StudentID: "0", StudentName: "Error"}]);
    const [teachers, setTeachers] = useState([{TeacherID: "0", TeacherName: "Error"}]);

    //populates the dropdown menu. WITHOUT THIS IT WILL BE STATIC.
    useEffect(() => {
        const loadClasses = async () => {
            try {
                const classResult = await getTeacherClasses(teacherId);

                if (!Array.isArray(classResult)) {
                    alert("Error with populating classes: " + JSON.stringify(classResult));
                    return;
                }

                if (classResult.length === 0) {
                    alert("No classes applicable.");
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
    });

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

    useEffect(() => {
        const loadTeachers = async () => {
            try {
                const teacherResult = await getAllTeachers();

                if (!Array.isArray(teacherResult)) {
                    alert("Error with populating teachers: " + JSON.stringify(teacherResult));
                    return;
                }

                if (teacherResult.length === 0) {
                    alert("No teachers.");
                    return;
                }

                setTeachers(teacherResult);
            } catch (error) {
                alert("Unexpected error: " + error);
            }
        };
            loadTeachers();
    }, []);

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

    //handle new student and add class & edit
    const handleNewClass = () => setShowClassModal(true);
    const handleNewStudent = () => setShowStudentModal(true);
    const handleEdit = () => {
        setIsEditOpen(true);
    };

    //handle files upload
    const uploadEvidence = ()=>{
        console.log("Evidence Upload");

    }
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('Selected file:', file.name);

        }
    };

    return (
        <div className="flex flex-col min-h-screen ">
            {/* Top Banner */}
            <header className="w-full bg-violet-700 px-6 py-4 flex justify-between items-center ">
               <div className="flex space-x-4">
                   <button onClick={handleNewAssignmentClick} className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700">
                       + New Assignment
                   </button>
                    <div>
                        <button onClick={handleNewClass} className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Create Class
                        </button>
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
                    </div>
                    <div>
                       <button onClick={handleNewStudent} className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700">
                           Create Student
                       </button>

                        <StudentModal
                            isOpen={showStudentModal}
                            onClose={() => setShowStudentModal(false)}
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
                    </div>
                       <button onClick={handleEdit} className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700">
                           Edit
                       </button>

                   <EditModal
                       isOpen={isEditOpen}
                       onClose={() => setIsEditOpen(false)}
                       onSubmit={handleEdit}
                       students={students.map((s) => ({
                           id: s.StudentID,
                           name: s.StudentName,

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
                   <div>

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
                            {/*
                            Populates class list with classes
                            */}
                            <select className="w-full border rounded px-3 py-2" onChange={handleSelectChange} >
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
                            <tr className="hover:bg-gray-50">
                                <td className="border p-3 text-sm">
                                    The project's main goal is to supplement the Building Thinking Classroom framework.
                                    We will create a dual-interface system that fosters collaborative learning by enabling teachers
                                    and students to have a conversation about their assessments and allow the parents to view the progress
                                    of their child through the application at home.
                                </td>
                                <td className="border p-3 text-center text-xs ">
                                    <div className="mb-4 text-black text-sm font-medium">
                                        <select className="w-full border rounded px-3 py-2">
                                            <option></option>
                                            <option>&#10003;.</option>
                                            <option>&#83;</option>
                                            <option>&#72;</option>
                                            <option>&#71;</option>
                                            <option>&#88;</option>
                                            <option>&#78;</option>
                                            <option>&#10003;</option>
                                            <option>&#111;</option>
                                            <option>&#99;</option>
                                        </select>
                                    </div>
                                    <div>
                                        <textarea className="w-full border rounded px-3 py-2"></textarea>
                                    </div>
                                    <div>
                                        <button onClick={handleButtonClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Attach Evidence</button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </td>
                                <td className="border p-3 text-center text-xs ">
                                    <div className="mb-4 text-black text-sm font-medium">
                                        <select className="w-full border rounded px-3 py-2">
                                            <option></option>
                                            <option>&#10003;.</option>
                                            <option>&#83;</option>
                                            <option>&#72;</option>
                                            <option>&#71;</option>
                                            <option>&#88;</option>
                                            <option>&#78;</option>
                                            <option>&#10003;</option>
                                            <option>&#111;</option>
                                            <option>&#99;</option>
                                        </select>
                                    </div>
                                    <div>
                                        <textarea className="w-full border rounded px-3 py-2"></textarea>
                                    </div>
                                    <div>
                                        <button onClick={handleButtonClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Attach Evidence</button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </td>
                                <td className="border p-3 text-center text-xs ">
                                    <div className="mb-4 text-black text-sm font-medium">
                                        <select className="w-full border rounded px-3 py-2">
                                            <option></option>
                                            <option>&#10003;.</option>
                                            <option>&#83;</option>
                                            <option>&#72;</option>
                                            <option>&#71;</option>
                                            <option>&#88;</option>
                                            <option>&#78;</option>
                                            <option>&#10003;</option>
                                            <option>&#111;</option>
                                            <option>&#99;</option>
                                        </select>
                                    </div>
                                    <div>
                                        <textarea className="w-full border rounded px-3 py-2"></textarea>
                                    </div>
                                    <div>
                                        <button onClick={handleButtonClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Attach Evidence</button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </td>

                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="border p-3 text-sm">
                                    This project features a database designed to store files uploaded by teachers and students,
                                    including media, voice messages, and collaborative notes. It will also include log-in functionality
                                    and be hosted through a web application.
                                    It will include a database that holds the information for login and the paths to the files for assignments.:
                                </td>
                                <td className="border p-3 text-center text-xs ">
                                    <div className="mb-4 text-black text-sm font-medium">
                                        <select className="w-full border rounded px-3 py-2">
                                            <option></option>
                                            <option>&#10003;.</option>
                                            <option>&#83;</option>
                                            <option>&#72;</option>
                                            <option>&#71;</option>
                                            <option>&#88;</option>
                                            <option>&#78;</option>
                                            <option>&#10003;</option>
                                            <option>&#111;</option>
                                            <option>&#99;</option>
                                        </select>
                                    </div>
                                    <div>
                                        <textarea className="w-full border rounded px-3 py-2"></textarea>
                                    </div>
                                    <div>
                                        <button onClick={handleButtonClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Attach Evidence</button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </td>
                                <td className="border p-3 text-center text-xs ">
                                    <div className="mb-4 text-black text-sm font-medium">
                                        <select className="w-full border rounded px-3 py-2">
                                            <option></option>
                                            <option>&#10003;.</option>
                                            <option>&#83;</option>
                                            <option>&#72;</option>
                                            <option>&#71;</option>
                                            <option>&#88;</option>
                                            <option>&#78;</option>
                                            <option>&#10003;</option>
                                            <option>&#111;</option>
                                            <option>&#99;</option>
                                        </select>
                                    </div>
                                    <div>
                                        <textarea className="w-full border rounded px-3 py-2"></textarea>
                                    </div>
                                    <div>
                                        <button onClick={handleButtonClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Attach Evidence</button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </td>
                                <td className="border p-3 text-center text-xs ">
                                    <div className="mb-4 text-black text-sm font-medium">
                                        <select className="w-full border rounded px-3 py-2">
                                            <option></option>
                                            <option>&#10003;.</option>
                                            <option>&#83;</option>
                                            <option>&#72;</option>
                                            <option>&#71;</option>
                                            <option>&#88;</option>
                                            <option>&#78;</option>
                                            <option>&#10003;</option>
                                            <option>&#111;</option>
                                            <option>&#99;</option>
                                        </select>
                                    </div>
                                    <div>
                                        <textarea className="w-full border rounded px-3 py-2"></textarea>
                                    </div>
                                    <div>
                                        <button onClick={handleButtonClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Attach Evidence</button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </td>

                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="border p-3 text-sm">
                                    Considerations should be made towards the functionality of the application for both students and teachers,
                                    the ability to keep media applicable, accessible, and implementable for both sides, and the ability to log in regardless of where they are.
                                    This is the basis of the framework that we have been requested, and any changes should keep this framework the same.
                                    Questions we can ask ourselves include:
                                </td>
                                <td className="border p-3 text-center text-xs ">
                                    <div className="mb-4 text-black text-sm font-medium">
                                        <select className="w-full border rounded px-3 py-2">
                                            <option></option>
                                            <option>&#10003;.</option>
                                            <option>&#83;</option>
                                            <option>&#72;</option>
                                            <option>&#71;</option>
                                            <option>&#88;</option>
                                            <option>&#78;</option>
                                            <option>&#10003;</option>
                                            <option>&#111;</option>
                                            <option>&#99;</option>
                                        </select>
                                    </div>
                                    <div>
                                        <textarea className="w-full border rounded px-3 py-2"></textarea>
                                    </div>
                                    <div>
                                        <button onClick={handleButtonClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Attach Evidence</button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </td>
                                <td className="border p-3 text-center text-xs ">
                                    <div className="mb-4 text-black text-sm font-medium">
                                        <select className="w-full border rounded px-3 py-2">
                                            <option></option>
                                            <option>&#10003;.</option>
                                            <option>&#83;</option>
                                            <option>&#72;</option>
                                            <option>&#71;</option>
                                            <option>&#88;</option>
                                            <option>&#78;</option>
                                            <option>&#10003;</option>
                                            <option>&#111;</option>
                                            <option>&#99;</option>
                                        </select>
                                    </div>
                                    <div>
                                        <textarea className="w-full border rounded px-3 py-2"></textarea>
                                    </div>
                                    <div>
                                        <button onClick={handleButtonClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Attach Evidence</button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>

                                </td>
                                <td className="border p-3 text-center text-xs ">
                                    <div className="mb-4 text-black text-sm font-medium">
                                        <select className="w-full border rounded px-3 py-2">
                                            <option></option>
                                            <option>&#10003;.</option>
                                            <option>&#83;</option>
                                            <option>&#72;</option>
                                            <option>&#71;</option>
                                            <option>&#88;</option>
                                            <option>&#78;</option>
                                            <option>&#10003;</option>
                                            <option>&#111;</option>
                                            <option>&#99;</option>
                                        </select>
                                    </div>
                                    <div>
                                        <textarea className="w-full border rounded px-3 py-2"></textarea>
                                    </div>
                                    <div>
                                        <button onClick={handleButtonClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Attach Evidence</button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </Table>

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
        </div>

    );
}