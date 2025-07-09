import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{message}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-base font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 dark:focus:ring-offset-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-base font-medium text-white bg-rago-burgundy rounded-md hover:bg-rago-burgundy-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rago-burgundy/50"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;