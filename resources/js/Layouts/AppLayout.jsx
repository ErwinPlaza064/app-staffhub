import { useState, useEffect, createContext, useContext } from 'react';
import { Link, usePage } from '@inertiajs/react';

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function AppLayout({ children }) {
    const { url } = usePage();
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || 
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return true; // Default to dark mode
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    const isActive = (path) => url.startsWith(path);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
                <div className="min-h-screen bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-gray-100">
                    {/* Header */}
                    <header className="sticky top-0 z-50 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 shadow-sm">
                        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-14 sm:h-16">
                                {/* Logo */}
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">StaffHub</h1>
                                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Administración y seguimiento de empleados y registro de lockers</p>
                                    </div>
                                </div>

                                {/* Navigation - Desktop */}
                                <nav className="hidden md:flex items-center gap-1 mx-4">
                                    <Link
                                        href="/empleados"
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                            isActive('/empleados')
                                                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                                        }`}
                                    >
                                        Gestión de empleados
                                    </Link>
                                    <Link
                                        href="/casilleros"
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                            isActive('/casilleros')
                                                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                                        }`}
                                    >
                                        Registro Lockers
                                    </Link>
                                    <Link
                                        href="/configuracion"
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                            isActive('/configuracion')
                                                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                                        }`}
                                    >
                                        Configuración
                                    </Link>
                                </nav>

                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors flex-shrink-0"
                                    title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                                >
                                    {darkMode ? (
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            
                            {/* Navigation - Mobile */}
                            <div className="md:hidden flex justify-center gap-2 pb-3 py-4 overflow-x-auto">
                                <Link
                                    href="/empleados"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                        isActive('/empleados')
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                                    }`}
                                >
                                    Empleados
                                </Link>
                                <Link
                                    href="/casilleros"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                        isActive('/casilleros')
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                                    }`}
                                >
                                    Lockers
                                </Link>
                                <Link
                                    href="/configuracion"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                        isActive('/configuracion')
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                                    }`}
                                >
                                    Configuración
                                </Link>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-4 py-4 sm:py-8">
                        <div className="max-w-sm mx-auto sm:max-w-none">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}
