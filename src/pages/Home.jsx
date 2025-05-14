import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Icon declarations
const UsersIcon = getIcon('Users');
const BookOpenIcon = getIcon('BookOpen');
const ClipboardListIcon = getIcon('ClipboardList');
const TrendingUpIcon = getIcon('TrendingUp');

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  },
};

function Home() {
  const [stats, setStats] = useState({
    students: 256,
    classes: 18,
    attendance: 92,
    performance: 78
  });

  // Demo function to simulate refreshing stats
  const refreshStats = () => {
    toast.info("Refreshing dashboard data...");
    
    // Simulate loading
    setTimeout(() => {
      // Create slightly different values
      const newStats = {
        students: stats.students + Math.floor(Math.random() * 5),
        classes: stats.classes,
        attendance: Math.min(100, Math.max(80, stats.attendance + (Math.random() > 0.5 ? 1 : -1))),
        performance: Math.min(100, Math.max(70, stats.performance + (Math.random() > 0.5 ? 2 : -2)))
      };
      
      setStats(newStats);
      toast.success("Dashboard updated successfully!");
    }, 1200);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50">
            Student Dashboard
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Manage your students, classes, and academic data in one place
          </p>
        </div>
        <button 
          onClick={refreshStats}
          className="btn btn-primary"
        >
          Refresh Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div variants={itemVariants} className="card p-4 md:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Students</p>
              <h3 className="text-2xl font-bold">{stats.students}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-4 md:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Active Classes</p>
              <h3 className="text-2xl font-bold">{stats.classes}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-4 md:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ClipboardListIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Attendance Rate</p>
              <h3 className="text-2xl font-bold">{stats.attendance}%</h3>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-4 md:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUpIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Avg. Performance</p>
              <h3 className="text-2xl font-bold">{stats.performance}%</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Feature */}
      <motion.div variants={itemVariants}>
        <MainFeature />
      </motion.div>
    </motion.div>
  );
}

export default Home;