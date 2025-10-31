import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Note from './Note';

const NoteList = ({ notes, currentUserId, onDeleteNote }) => {
  if (notes.length === 0) {
    return <p className="text-center text-muted mt-5">No blinks yet. Post one!</p>;
  }

  return (
    <div className="d-flex flex-column align-items-center py-3">
      <AnimatePresence>
        {notes.map((note, index) => (
          <Note
            key={note._id}
            note={note}
            index={index}
            currentUserId={currentUserId}
            onDelete={onDeleteNote}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NoteList;