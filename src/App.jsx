import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import Department from './pages/Department';
import NotFound from './pages/NotFound';

function App() {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Icon declarations
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const HomeIcon = getIcon('Home');
  const BuildingIcon = getIcon('Building');
  const GraduationCapIcon = getIcon('GraduationCap');

  // Effect to apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.info(`${!darkMode ? 'Dark' : 'Light'} mode activated`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      theme: !darkMode ? 'dark' : 'light'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCapIcon className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-primary dark:text-primary-light hidden sm:block">
              EduTrack
            </h1>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-all"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? 'dark' : 'light'}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-surface-600" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 md:min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <motion.a 
                  href="/"
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 px-4 py-3 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <HomeIcon className="h-5 w-5 text-primary" />
                  <span>Dashboard</span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="/departments"
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 px-4 py-3 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <BuildingIcon className="h-5 w-5 text-primary" />
                  <span>Departments</span>
                </motion.a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-grow p-4 md:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/departments" element={<Department />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-surface-800 py-4 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 text-center text-sm text-surface-500">
          <p>© {new Date().getFullYear()} EduTrack - Student Management System</p>
        </div>
      </footer>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
        className="!z-50"
      />
    </div>
  );
}

export default App;