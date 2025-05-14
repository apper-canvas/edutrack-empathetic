import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icon declarations
const HomeIcon = getIcon('Home');
const AlertTriangleIcon = getIcon('AlertTriangle');

function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ 
            scale: 1,
            rotate: [0, -5, 5, -5, 0],
            transition: {
              rotate: {
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 3
              }
            }
          }}
          className="inline-block text-primary-light"
        >
          <AlertTriangleIcon className="h-24 w-24 md:h-32 md:w-32" />
        </motion.div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-surface-800 dark:text-surface-200 mb-4">
        404
      </h1>
      
      <div className="card p-6 md:p-8 max-w-lg mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" className="btn btn-primary inline-flex items-center justify-center">
          <HomeIcon className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="text-surface-500 dark:text-surface-400 text-sm">
        <p>If you believe this is an error, please contact support.</p>
      </div>
    </motion.div>
  );
}

export default NotFound;