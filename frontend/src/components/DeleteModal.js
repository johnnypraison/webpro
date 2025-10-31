import React from 'react';
import { motion } from 'framer-motion';

// Variants for the modal overlay (fades in)
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Variants for the modal content (pops in and shakes)
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    // This is the shake animation!
    x: [0, -10, 10, -10, 10, 0],
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 20, 
      x: { duration: 0.4 } // Shake duration
    },
  },
  exit: { opacity: 0, scale: 0.8 },
};

const DeleteModal = ({ onClose, onConfirm }) => {
  return (
    <motion.div
      className="modal-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      // Prevent clicks on the background from closing (optional)
      // onClick={(e) => e.stopPropagation()} 
    >
      <motion.div
        className="modal-content note-card" // Use note-card for glassmorphism
        variants={modalVariants}
      >
        <h3 className="text-yellow" style={{ fontSize: '2.5rem' }}>Ohoh!</h3>
        <p className="fs-5 my-3">Why do you want to delete this blink? Are you really sure?</p>
        
        <div className="d-flex justify-content-around mt-4">
          <button
            className="btn btn-yellow-outline btn-lg"
            onClick={onClose}
          >
            No, keep it!
          </button>
          <button
            className="btn btn-danger btn-lg" // Bootstrap's red button
            onClick={onConfirm}
          >
            Yes, delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteModal;