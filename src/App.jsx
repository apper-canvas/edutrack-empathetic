import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import Students from './pages/Students';
import Department from './pages/Department';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Icon declarations
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const HomeIcon = getIcon('Home');
  const BuildingIcon = getIcon('Building');
  const GraduationCapIcon = getIcon('GraduationCap');

  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
		let redirectPath = new URLSearchParams(window.location.search).get('redirect');
		const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
				'/callback') || currentPath.includes('/error');
		if (user) {
			// User is authenticated
			if (redirectPath) {
				navigate(redirectPath);
			} else if (!isAuthPage) {
				if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
					navigate(currentPath);
				} else {
					navigate('/');
				}
			} else {
				navigate('/');
			}
			// Store user information in Redux
			dispatch(setUser(JSON.parse(JSON.stringify(user))));
		} else {
			// User is not authenticated
			if (!isAuthPage) {
				navigate(
					currentPath.includes('/signup')
					 ? `/signup?redirect=${currentPath}`
					 : currentPath.includes('/login')
					 ? `/login?redirect=${currentPath}`
					 : '/login');
			} else if (redirectPath) {
				if (
					![
						'error',
						'signup',
						'login',
						'callback'
					].some((path) => currentPath.includes(path)))
					navigate(`/login?redirect=${redirectPath}`);
				else {
					navigate(currentPath);
				}
			} else if (isAuthPage) {
				navigate(currentPath);
			} else {
				navigate('/login');
			}
			dispatch(clearUser());
		}
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        navigate('/error?message=' + encodeURIComponent(error.message || 'Authentication failed'));
      }
    });
    
    setIsInitialized(true);
  }, [dispatch, navigate]);
  
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

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success('Logged out successfully');
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed: " + error.message);
      }
    }
  };

  return (
    <AuthContext.Provider value={authMethods}>
      {!isInitialized ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">Initializing application...</span>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          {isAuthenticated && (
            <>
              {/* Header */}
              <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <GraduationCapIcon className="h-8 w-8 text-primary" />
                    <h1 className="text-xl font-bold text-primary dark:text-primary-light hidden sm:block">
                      EduTrack
                    </h1>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={authMethods.logout}
                      className="btn btn-sm btn-outline flex items-center gap-1"
                    >
                      Logout
                    </button>
                  </div>
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
                          href="/students"
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-3 px-4 py-3 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                        >
                          <GraduationCapIcon className="h-5 w-5 text-primary" />
                          <span>Students</span>
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
                      <Route path="/students" element={<Students />} />
                      <Route path="/departments" element={<Department />} />
                    </Routes>
                  </AnimatePresence>
                </main>
              </div>
    
              {/* Footer */}
              <footer className="bg-white dark:bg-surface-800 py-4 border-t border-surface-200 dark:border-surface-700">
                <div className="container mx-auto px-4 text-center text-sm text-surface-500">
                  <p>© {new Date().getFullYear()} EduTrack - Student Management System</p>
                </div>
              </footer>
            </>
          )}
    
          {/* Routes */}
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/students" element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              } />
              <Route path="/departments" element={
                <ProtectedRoute>
                  <Department />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
    
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
      )}
    </AuthContext.Provider>
  );
}

export default App;