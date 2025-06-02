"use client";

import Editor from "./EditorModal";

export default function PopupModal({
                                       visible,
                                       onClose,
                                   }: {
    visible: boolean;
    onClose: () => void;
}) {
    if (!visible) return null;

    const handleSave = (content: string) => {
        console.log('Saved content:', content);
        onClose(); // close modal after saving
    };

    return (
        <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md">
                <button
                    className="close-btn absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={onClose}
                >
                    ×
                </button>
                <h2 className="text-xl font-semibold mb-4">Edit Legend</h2>
                <Editor isOpen={true} onClose={onClose} onSave={handleSave} />
            </div>
        </div>
    );
}
