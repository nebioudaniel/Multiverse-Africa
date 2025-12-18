// src/app/[locale]/register/TermsDialog.tsx (Updated File)
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// The content now only accepts the English string
interface TermsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    content: {
        english: string;
    };
    // The locale prop is no longer needed since we only display English
    // locale: string; 
}

const TermsDialog: React.FC<TermsDialogProps> = ({ isOpen, onClose, content }) => {
    
    // Hardcode to English content and title
    const currentContent = content.english;
    const currentTitle = "Website Registration Agreement";

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-4xl max-h-[95vh] bg-white dark:bg-zinc-800 rounded-lg shadow-2xl flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-800 z-10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            {currentTitle}
                        </h2>
                        {/* The language toggle button is removed */}
                        <div className="flex items-center space-x-3">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-100 dark:bg-zinc-700 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                                aria-label="Close"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 overflow-y-auto max-h-[75vh] whitespace-pre-line text-gray-700 dark:text-gray-300">
                        <div dangerouslySetInnerHTML={{ __html: currentContent }} />
                    </div>

                    {/* Footer / Accept Button - Optional, but good UX */}
                    <div className="p-4 border-t border-gray-200 dark:border-zinc-700 sticky bottom-0 bg-white dark:bg-zinc-800 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                            Close & Return to Registration
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TermsDialog;