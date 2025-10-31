import React from 'react';
import { motion } from 'framer-motion';

const Note = ({ note, index, currentUserId, onDelete }) => {
  // Requirement: Alternating alignment
  const alignment = index % 2 === 0 ? 'align-self-start' : 'align-self-end';

  // Animation variants
  const variants = {
    hidden: { 
      opacity: 0, 
      x: index % 2 === 0 ? -100 : 100 // Slide from left or right
    },
    visible: { 
      opacity: 1, 
      x: 0 
    },
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.div
      className={`note-card p-3 my-2 w-75 ${alignment}`}
      layout // Animates layout changes (e.g., when an item is deleted)
      variants={variants}
      initial="hidden"
      whileInView="visible" // Triggers animation on scroll
      viewport={{ once: true, amount: 0.3 }} // Trigger when 30% visible
      exit={{ opacity: 0, scale: 0.8 }} // Animate out on delete
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="note-nickname mb-0">@{note.authorNickname}</h6>
          <span className="note-meta">{note.category}</span>
        </div>
        {/* Requirement: Only show delete button if user is the author */}
        {note.authorId === currentUserId && (
          <button
            className="btn btn-sm btn-outline-danger border-0"
            onClick={() => onDelete(note._id)}
            title="Delete Blink"
          >
            {/* Using a simple 'X' icon */}
            &#x2715; 
          </button>
        )}
      </div>

      <p className="note-text my-2">{note.text}</p>
      
      <span className="note-meta d-block text-end">
        {formatDate(note.createdAt)}
      </span>
    </motion.div>
  );
};

export default Note;