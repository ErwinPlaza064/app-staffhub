const Input = ({ 
    label, 
    name, 
    value, 
    onChange, 
    error, 
    type = 'text', 
    placeholder = '', 
    required = false,
    className = '',
    ...props 
}) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
                    w-full px-4 py-2 rounded-xl border transition-all
                    ${error 
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-dark-600 focus:ring-primary-500'
                    }
                    bg-gray-50 dark:bg-dark-900 
                    text-gray-900 dark:text-white 
                    placeholder-gray-400
                    focus:ring-2 focus:border-transparent
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
