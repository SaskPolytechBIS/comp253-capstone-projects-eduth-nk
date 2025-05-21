import React from 'react';

//Show Legend items
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

