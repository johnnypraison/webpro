import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import Navbar from '../components/Navbar';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';
import SkeletonNote from '../components/SkeletonNote';
import { motion, AnimatePresence } from 'framer-motion'; // NEW: Import AnimatePresence
import DeleteModal from '../components/DeleteModal'; // NEW: Import the modal

const HomePage = ({ auth, setAuth }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('For You');
  const [error, setError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null); // NEW: State for delete modal

  // Fetch notes when category changes
  useEffect(() => {
    setIsLoading(true);
    api.getAllNotes(activeCategory)
      .then((data) => {
        setNotes(data);
        setError('');
      })
      .catch((err) => {
        console.error('Failed to fetch notes:', err);
        setError('Failed to load blinks. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeCategory]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    api.logout()
      .then(() => {
        setTimeout(() => {
          setAuth({ user: null, isLoading: false });
        }, 2000);
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        setIsLoggingOut(false);
        alert("Logout failed. Please try again.");
      });
  };

  const handlePostNote = useCallback((newNoteData) => {
    return api.postNewNote(newNoteData)
      .then((createdNote) => {
        if (
          activeCategory === 'For You' ||
          activeCategory === createdNote.category
        ) {
          setNotes((prevNotes) => [createdNote, ...prevNotes]);
        }
      });
  }, [activeCategory]); 

  // NEW: This function *opens* the modal
  const requestDeleteNote = (noteId) => {
    setNoteToDelete(noteId);
  };

  // NEW: This function *closes* the modal
  const cancelDeleteNote = () => {
    setNoteToDelete(null);
  };

  // NEW: This function runs when "Yes, delete" is clicked
  const confirmDeleteNote = () => {
    if (noteToDelete) {
      api.deleteNoteById(noteToDelete)
        .then(() => {
          // Animate the note out
          setNotes((prevNotes) => prevNotes.filter((n) => n._id !== noteToDelete));
          setNoteToDelete(null); // Close modal
        })
        .catch((err) => {
          console.error('Failed to delete note:', err);
          alert('Failed to delete blink. Please try again.');
          setNoteToDelete(null); // Close modal even on failure
        });
    }
  };

  // This is the logout screen
  if (isLoggingOut) {
    return (
      <div className="container vh-100 d-flex flex-column justify-content-center align-items: center text-center">
        <motion.h1
          className="display-3 fw-bold text-yellow"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          Logged Out
        </motion.h1>
        <motion.p
          className="lead fs-4 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          See you again soon!
        </motion.p>
        <div className="spinner-border text-yellow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // This is the original page content
  return (
    <div>
      {/* NEW: AnimatePresence wraps the modal so it can animate in/out */}
      <AnimatePresence>
        {noteToDelete && (
          <DeleteModal
            onClose={cancelDeleteNote}
            onConfirm={confirmDeleteNote}
          />
        )}
      </AnimatePresence>

      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onLogout={handleLogout}
      />
      
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-10 col-sm-12">
            <div className="scrollable-feed px-2">
              <NoteForm onPostNote={handlePostNote} />
              
              {error && <p className="text-danger text-center mt-3">{error}</p>}
              
              {isLoading ? (
                <>
                  <SkeletonNote />
                  <SkeletonNote />
                  <SkeletonNote />
                </>
              ) : (
                <NoteList
                  notes={notes}
                  currentUserId={auth.user._id}
                  onDeleteNote={requestDeleteNote} // NEW: Pass the new function
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;