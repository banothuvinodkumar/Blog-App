import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, BookOpen, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    }, []);

    const toggleDark = () => {
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark');
        localStorage.theme = newTheme;
        setIsDark(!isDark);
    };

    return (
        <nav className="bg-[var(--color-surface)] backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/50 shadow-sm sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <BookOpen size={28} className="text-primary-600" />
                            <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">BlogApp</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button onClick={toggleDark} className="p-2 text-gray-500 hover:text-primary-600 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2 transition-colors">Home</Link>
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2 transition-colors">Dashboard</Link>
                                )}
                                <Link to="/create" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2 transition-colors">Create Post</Link>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-700 font-medium">Hi, {user.username}</span>
                                <button onClick={logout} className="ml-4 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2 transition-colors">Login</Link>
                                <Link to="/register" className="px-5 py-2 btn-gradient">Register</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={toggleDark} className="p-2 mr-2 text-gray-500 hover:text-primary-600 transition-colors rounded-full">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700 p-2 focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-gray-100 dark:border-gray-800 shadow-inner overflow-hidden bg-[var(--color-surface)] backdrop-blur-xl"
                >
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md">Home</Link>
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md">Dashboard</Link>
                                )}
                                <span className="block px-3 py-2 text-base font-medium text-gray-700 border-b border-gray-50">Hi, {user.username}</span>
                                <Link to="/create" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md">Create Post</Link>
                                <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md">Login</Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">Register</Link>
                            </>
                        )}
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;