"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface EditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: string) => void;
    initialContent?: string;
}

const EditorModal: React.FC<EditorModalProps> = ({
                                                     isOpen,
                                                     onClose,
                                                     onSave,
                                                     initialContent = "",
                                                 }) => {
    const [content, setContent] = React.useState(initialContent);

    React.useEffect(() => {
        setContent(initialContent);
    }, [initialContent, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
                <h2 className="text-xl font-bold mb-4 text-black">New Assignment</h2>
                <div className="text-black">
                    <CKEditor
                        // @ts-ignore
                        editor={ClassicEditor}
                        data={content}
                        onChange={(event, editor) => {
                            setContent(editor.getData());
                        }}
                    />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => onSave(content)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditorModal;
