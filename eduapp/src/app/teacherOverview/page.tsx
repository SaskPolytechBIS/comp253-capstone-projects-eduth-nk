"use client";


import React, { useState } from "react";
import { Bell   } from "lucide-react"; // icon library or image
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-";
import { getStudentName } from "@/app/teacherBoard/api/route";


export default function TeacherOverview() {
    const [userName, setUserName] = useState("sample");


    const moveToTemplate = (e: React.FormEvent) => {
        e.preventDefault();


    };

    const moveToDatabaseEditing = (e: React.FormEvent) => {
        e.preventDefault();


    };

    const moveToStudent = (e: React.FormEvent) => {
        e.preventDefault();


    };

    const logOut = (e: React.FormEvent) => {
        e.preventDefault();


    };

    return (
        <>
            <div className="flex items-center justify-center">
                <header className="w-full bg-violet-700 px-6 py-4 flex justify-between items-center ">
                    <button onSubmit={logOut} className="bg-violet-800 border-1 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Log Out
                    </button>
                    <div className="flex items-center gap-4">
                        <Bell className="w-6 h-6 text-gray-700 text-white cursor-pointer"/>
                        <VscAccount className="w-6 h-6 text-gray-700 text-white cursor-pointer"/>
                    </div>
                </header>
            </div>
            <div className="flex items-center justify-center mt-10">
                <h1 className="text-4xl font-bold text-center text-black  "> Welcome to BTC Assessments </h1>
            </div>
            <div className="flex items-center justify-center mt-10 " >
                <form onSubmit={moveToStudent} className=" p-8 rounded-xl shadow-md w-full max-w-sm bg-gray-100">
                <label className="mb-1 text-sm font-medium text-black flex items-center justify-center"></label>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Student Assignment View
                    </button>
                </form>
            </div>
            <div className="flex items-center justify-center mt-10 " >
                <form onSubmit={moveToTemplate} className=" p-8 rounded-xl shadow-md w-full max-w-sm bg-gray-100">
                    <label className="mb-1 text-sm font-medium text-black flex items-center justify-center"></label>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Template Creation and Editing
                    </button>
                </form>
            </div>
            <div className="flex items-center justify-center mt-10 " >
                <form onSubmit={moveToDatabaseEditing} className=" p-8 rounded-xl shadow-md w-full max-w-sm bg-gray-100">
                    <label className="mb-1 text-sm font-medium text-black flex items-center justify-center"></label>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Database Editing
                    </button>
                </form>
            </div>
        </>
    )
};
