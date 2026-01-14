import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    description?: string;
    className?: string;
}

export const Modal = ({ isOpen, onClose, title, description, children, className }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className={twMerge(
                            "relative w-full max-w-lg transform rounded-2xl bg-white dark:bg-brand-navy border border-gray-100 dark:border-white/10 p-8 shadow-2xl overflow-hidden backdrop-blur-xl",
                            className
                        )}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-primary tracking-tight leading-none">{title}</h2>
                                {description && (
                                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 font-text font-medium">{description}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
                                aria-label="Cerrar modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
