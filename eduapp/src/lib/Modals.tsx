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
                               className,
                               setClassName
                           }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    className: string;
    setClassName: (value: string) => void;
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
                    <select className="w-full border rounded px-3 py-2">
                        <option>Taylor</option>
                        <option>Jordan</option>
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
                                 classId,
                                 setClassId,
                                 classes,
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
    classId: string;
    setClassId: (value: string) => void;
    classes: { ClassID: string; ClassName: string }[];
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
                    <select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
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

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={onSubmit} className="px-4 py-2 bg-violet-700 text-white rounded">Create</button>
                </div>
            </div>
        </div>
    );
};

