import React from 'react';


//Legend items
type LegendItem = {
    code: string;
    description: string;
};

type LegendModalProps = {
    isOpen: boolean;
    onClose: () => void;
    items: LegendItem[];
};

export const LegendModal: React.FC<LegendModalProps> = ({ isOpen, onClose, items }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full relative">
                <h2 className="text-xl font-bold mb-4 text-center text-black">Legend</h2>
                <ul className="space-y-2 text-sm text-black">
                    {items.map((item, index) => (
                        <li key={index}>
                            <span className="font-bold">{item.code}</span>: {item.description}
                        </li>
                    ))}
                </ul>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

//Create Class Modal
export const ClassModal = ({
                               isOpen,
                               onClose,
                               onSubmit,
                               teacherId,
                               setTeacherId,
                               className,
                               setClassName,
                               teachers
                           }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    className: string;
    setClassName: (value: string) => void;
    teacherId: string;
    setTeacherId: (value: string) => void;
    teachers: {TeacherID: any, TeacherName: any}[];
}) => {
    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
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
                    <select className="w-full border rounded px-3 py-2" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
                        {teachers.map((teachers) => (
                            <option key={teachers.TeacherID} value={teachers.TeacherID}>
                                {teachers.TeacherName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={onSubmit} className="px-4 py-2 bg-violet-700 text-white rounded">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

//Student Modal
export const StudentModal = ({
                                 isOpen,
                                 onClose,
                                 onSubmit,
                                 studentName,
                                 setStudentName,
                                 studentUsername,
                                 setStudentUsername,
                                 studentPassword,
                                 setStudentPassword,
                                 classes,
                                 studentClass,
                                 setStudentClass
                             }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    studentName: string;
    setStudentName: (value: string) => void;
    studentUsername: string;
    setStudentUsername: (value: string) => void;
    studentPassword: string;
    setStudentPassword: (value: string) => void;
    classes: { ClassID: string; ClassName: string }[];
    studentClass: string;
    setStudentClass: (value: string) => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
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
                    <select className="w-full border rounded px-3 py-2 space-x-2 line-height:1.5" value={studentClass} onChange={(e) => setStudentClass(e.target.value)}>
                        <option value="">Select a class!</option>
                        {classes.map((classes) => (
                            <option key={classes.ClassID} value={classes.ClassID}>
                                {classes.ClassName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={onSubmit} className="px-4 py-2 bg-violet-700 text-white rounded">Create</button>
                </div>
            </div>
        </div>
    );
};

//Edit Modal
// Type for student
type Student = {
    id: string;
    name: string;
    username: string;
    password: string;
    classId: string;
};

export const EditStudentModal = ({
                              isOpen,
                              onClose,
                              onSubmit,
                              students,
                              selectedStudentId,
                              setSelectedStudentId,
                              studentName,
                              setStudentName,
                              studentUsername,
                              setStudentUsername,
                              studentPassword,
                              setStudentPassword,
                              studentClass,
                              setStudentClass,
                              classes,
                          }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    students: Student[];
    selectedStudentId: string;
    setSelectedStudentId: (id: string) => void;
    studentName: string;
    setStudentName: (value: string) => void;
    studentUsername: string;
    setStudentUsername: (value: string) => void;
    studentPassword: string;
    setStudentPassword: (value: string) => void;
    studentClass: string;
    setStudentClass: (value: string) => void;
    classes: { ClassID: string; ClassName: string }[];
}) => {
    // Populate fields when a student is selected
    const handleSelectStudent = (id: string) => {
        setSelectedStudentId(id);
        const student = students.find((s) => s.id === id);
        if (student) {
            setStudentName(student.name);
            setStudentUsername(student.username);
            setStudentPassword(student.password);
            setStudentClass(student.classId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Student</h2>

                {/* Student Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Select Student</label>
                    <select
                        value={selectedStudentId}
                        onChange={(e) => handleSelectStudent(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Choose a student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Edit Form */}
                {selectedStudentId && (
                    <>
                        <input
                            type="text"
                            placeholder="Student name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={studentUsername}
                            onChange={(e) => setStudentUsername(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Password"
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Class</label>
                            <select
                                value={studentClass}
                                onChange={(e) => setStudentClass(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select a class</option>
                                {classes.map((cls) => (
                                    <option key={cls.ClassID} value={cls.ClassID}>
                                        {cls.ClassName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-2">
                            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                                Cancel
                            </button>
                            <button onClick={onSubmit} className="px-4 py-2 bg-violet-700 text-white rounded">
                                Update
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const ClassModalEdit = ({
                                   isOpen,
                                   onClose,
                                   onSubmit,
                                   teacherId,
                                   setTeacherId,
                                   className,
                                   setClassName,
                                   teachers,
                               }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    className: string;
    setClassName: (value: string) => void;
    teacherId: string;
    setTeacherId: (value: string) => void;
    teachers: { TeacherID: any; TeacherName: any }[];
}) => {
    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Class</h2>

                <input
                    type="text"
                    placeholder="Enter class name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Teacher</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                    >
                        {teachers.map((teacher) => (
                            <option key={teacher.TeacherID} value={teacher.TeacherID}>
                                {teacher.TeacherName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
