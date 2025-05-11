"use client";

import dynamic from "next/dynamic";

const ClientEditorModal = dynamic(() => import("./EditorModal"), {
    ssr: false,
});

export default ClientEditorModal;
