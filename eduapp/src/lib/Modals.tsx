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
                        <option>Select a teacher!</option>
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
    const handleSelectStudent = (id: string) => {
        setSelectedStudentId(id);
        const student = students.find((s) => s.id === id);
        if (student) {
            setStudentName(student.name);
            setStudentUsername(student.username);
            setStudentPassword(student.password);
            setStudentClass(student.classId);
        } else {
            setStudentName('');
            setStudentUsername('');
            setStudentPassword('');
            setStudentClass('');
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

                {/* Form Fields */}
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
                    </>
                )}

                {/* Footer Buttons */}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setSelectedStudentId("");
                            onClose();
                        }}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-violet-700 text-white rounded disabled:opacity-50"
                        disabled={!selectedStudentId}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

type Teacher = {
    TeacherID: string;
    TeacherName: string;
};

type Class = {
    ClassID: string;
    ClassName: string;

};

type ClassModalEditProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    className: string;
    setClassName: (value: string) => void;
    teacherId: string;
    setTeacherId: (value: string) => void;
    selectedClassId: string;
    setSelectedClassId: (value: string) => void;
    classes: Class[];
    teachers: Teacher[];
};

export const ClassModalEdit = ({
                                   isOpen,
                                   onClose,
                                   onSubmit,
                                   className,
                                   setClassName,
                                   teacherId,
                                   setTeacherId,
                                   selectedClassId,
                                   setSelectedClassId,
                                   classes,
                                   teachers,
                               }: ClassModalEditProps) => {
    if (!isOpen) return null;

    const handleClassSelect = (id: string) => {
        setSelectedClassId(id);
        const selectedClass = classes.find((cls) => cls.ClassID === id);
        if (selectedClass) {
            setClassName(selectedClass.ClassName);

        } else {
            setClassName("");
            setTeacherId("");
        }
    };

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Class</h2>

                {/* Class Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Select Class</label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => handleClassSelect(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Choose a class!</option>
                        {classes.map((cls) => (
                            <option key={cls.ClassID} value={cls.ClassID}>
                                {cls.ClassName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Editable Fields */}
                {selectedClassId && (
                    <>
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
                                <option value="">Select a teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.TeacherID} value={teacher.TeacherID}>
                                        {teacher.TeacherName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setSelectedClassId("");
                            onClose();
                        }}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-violet-700 text-white rounded disabled:opacity-50"
                        disabled={!selectedClassId}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

//Delete Class
type ClassModalDeleteProps = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    selectedClassId: string;
    setSelectedClassId: (value: string) => void;
    classes: Class[];
};

export const ClassModalDelete = ({
                                     isOpen,
                                     onClose,
                                     onDelete,
                                     selectedClassId,
                                     setSelectedClassId,
                                     classes,
                                 }: ClassModalDeleteProps) => {
    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Delete Class</h2>

                {/* Class Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Select Class to Delete</label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Choose a class!</option>
                        {classes.map((cls) => (
                            <option key={cls.ClassID} value={cls.ClassID}>
                                {cls.ClassName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setSelectedClassId("");
                            onClose();
                        }}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                        disabled={!selectedClassId}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

//Delete student
type DeleteStudentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    selectedStudentId: string;
    setSelectedStudentId: (id: string) => void;
    students: Student[];
};

export const DeleteStudentModal = ({
                                       isOpen,
                                       onClose,
                                       onDelete,
                                       selectedStudentId,
                                       setSelectedStudentId,
                                       students,
                                   }: DeleteStudentModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Delete Student</h2>

                {/* Student Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Select Student to Delete</label>
                    <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
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

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setSelectedStudentId('');
                            onClose();
                        }}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                        disabled={!selectedStudentId}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

//Unit Modal
// Unit types
type Unit = {
    UnitID: string;
    UnitName: string;
    ClassID?: string;
};
type UnitModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    unitName: string;
    setUnitName: (value: string) => void;
    classId: string;
    setClassId: (value: string) => void;
    classes: Class[];
    content1: string;
    setDescription1: (value: string) => void;
    content2: string;
    setDescription2: (value: string) => void;
    content3: string;
    setDescription3: (value: string) => void;
    content4: string;
    setDescription4: (value: string) => void;
    content5: string;
    setDescription5: (value: string) => void;
};
// Create Unit Modal
export const UnitModal = ({
                              isOpen,
                              onClose,
                              onSubmit,
                              unitName,
                              setUnitName,
                              classId,
                              setClassId,
                              classes,
                              content1,
                              setDescription1,
                              content2,
                              setDescription2,
                              content3,
                              setDescription3,
                              content4,
                              setDescription4,
                              content5,
                              setDescription5,
                          }: UnitModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Create Unit</h2>

                <input
                    type="text"
                    placeholder="Enter unit name"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />

                {/* Class selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Select Class</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                    >
                        <option value="">Choose a class</option>
                        {classes.map((cls) => (
                            <option key={cls.ClassID} value={cls.ClassID}>
                                {cls.ClassName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Content 1</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={content1}
                        onChange={(e) => setDescription1(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Content 2</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={content2}
                        onChange={(e) => setDescription2(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Content 3</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={content3}
                        onChange={(e) => setDescription3(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Content 4</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={content4}
                        onChange={(e) => setDescription4(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Content 5</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={content5}
                        onChange={(e) => setDescription5(e.target.value)}
                    />
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

type UnitModalEditProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    unitName: string;
    setUnitName: (value: string) => void;
    selectedUnitId: string;
    setSelectedUnitId: (value: string) => void;
    classId: string;
    setClassId: (value: string) => void;
    units: Unit[];
    classes: Class[];
};

export const UnitModalEdit = ({
    isOpen,
    onClose,
    onSubmit,
    unitName,
    setUnitName,
    selectedUnitId,
    setSelectedUnitId,
    classId,
    setClassId,
    units,
    classes,
}: UnitModalEditProps) => {
    if (!isOpen) return null;

    // Fixed handleUnitSelect function
    const handleUnitSelect = (id: string) => {
        setSelectedUnitId(id);
        const selectedUnit = units.find((unit) => unit.UnitID === id);
        if (selectedUnit) {
            setUnitName(selectedUnit.UnitName);
            setClassId(selectedUnit.ClassID || '');
            // Optional: Add console.log to debug
            console.log('Selected Unit:', selectedUnit);
            console.log('Setting ClassID to:', selectedUnit.ClassID);
        } else {
            setUnitName('');
            setClassId('');
        }
    };

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Unit</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Select Unit</label>
                    <select
                        value={selectedUnitId}
                        onChange={(e) => handleUnitSelect(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Choose a unit</option>
                        {units.map((unit) => (
                            <option key={unit.UnitID} value={unit.UnitID}>
                                {unit.UnitName}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedUnitId && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter unit name"
                            value={unitName}
                            onChange={(e) => setUnitName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Select Class</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                            >
                                <option value="">Choose a class</option>
                                {classes.map((cls) => (
                                    <option key={cls.ClassID} value={cls.ClassID}>
                                        {cls.ClassName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setSelectedUnitId('');
                            setUnitName('');
                            setClassId('');
                            onClose();
                        }}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-violet-700 text-white rounded disabled:opacity-50"
                        disabled={!selectedUnitId}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

// Delete Unit Modal
type UnitModalDeleteProps = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    selectedUnitId: string;
    setSelectedUnitId: (value: string) => void;
    units: Unit[];

};

export const UnitModalDelete = ({
                                    isOpen,
                                    onClose,
                                    onDelete,
                                    selectedUnitId,
                                    setSelectedUnitId,
                                    units,
                                }: UnitModalDeleteProps) => {
    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Delete Unit</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Select Unit to Delete</label>
                    <select
                        value={selectedUnitId}
                        onChange={(e) => setSelectedUnitId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Choose a unit!</option>
                        {units.map((unit) => (
                            <option key={unit.UnitID} value={unit.UnitID}>
                                {unit.UnitName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setSelectedUnitId("");
                            onClose();
                        }}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                        disabled={!selectedUnitId}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};