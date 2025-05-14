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

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Edit Legend</h2>
                <Editor />
            </div>
        </div>
    );
}
