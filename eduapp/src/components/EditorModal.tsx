'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function EditorModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [editorData, setEditorData] = useState('<p>Edit your content here...</p>');

    return (
        <>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setIsOpen(true)}
            >
                Show Legend
            </button>

            {isOpen &&
                createPortal(
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="bg-white w-[800px] max-h-[90vh] overflow-auto rounded shadow-lg border">
                            <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
                                <h2 className="text-lg font-semibold">Legend Editor</h2>
                                <button
                                    className="text-red-500 text-xl"
                                    onClick={() => setIsOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-4">
                                <CKEditor
                                    editor={ClassicEditor as unknown as typeof ClassicEditor}
                                    data={editorData}
                                    onChange={(_, editor) => {
                                        const data = editor.getData();
                                        setEditorData(data);
                                    }}
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white rounded"
                                        onClick={() => {
                                            console.log('Saved content:', editorData);
                                            setIsOpen(false);
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
