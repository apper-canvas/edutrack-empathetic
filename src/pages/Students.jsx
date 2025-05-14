import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';

function Students() {
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
      <MainFeature />
    </motion.div>
  );
}

export default Students;