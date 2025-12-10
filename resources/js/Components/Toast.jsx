import { useEffect } from 'react';
import { useToast } from '../Contexts/ToastContext';

// Icons
const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ExclamationIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const InfoIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Toast = ({ id, message, type, onClose }) => {
    const icons = {
        success: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
        error: <XCircleIcon className="w-5 h-5 text-red-400" />,
        warning: <ExclamationIcon className="w-5 h-5 text-yellow-400" />,
        info: <InfoIcon className="w-5 h-5 text-blue-400" />,
    };

    const backgrounds = {
        success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
        warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
        info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    };

    const textColors = {
        success: 'text-green-800 dark:text-green-200',
        error: 'text-red-800 dark:text-red-200',
        warning: 'text-yellow-800 dark:text-yellow-200',
        info: 'text-blue-800 dark:text-blue-200',
    };

    return (
        <div
            className={`
                flex items-center gap-3 p-4 rounded-lg border shadow-lg
                ${backgrounds[type]}
                animate-[slideIn_0.3s_ease-out]
                min-w-[300px] max-w-md
            `}
        >
            {icons[type]}
            <p className={`flex-1 text-sm font-medium ${textColors[type]}`}>
                {message}
            </p>
            <button
                onClick={() => onClose(id)}
                className={`${textColors[type]} hover:opacity-70 transition-opacity`}
            >
                <CloseIcon />
            </button>
        </div>
    );
};

export const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};

export default Toast;
