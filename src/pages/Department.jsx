import { motion } from 'framer-motion';
import DepartmentFeature from '../components/DepartmentFeature';

function Department() {
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <DepartmentFeature />
    </motion.div>
  );
}

export default Department;