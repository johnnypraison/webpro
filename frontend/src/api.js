import axios from 'axios';

// Set this to your Vercel URL in production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Critical: This sends cookies (like the session) with every request
axios.defaults.withCredentials = true;

/**
 * Checks if a user is currently authenticated.
 * @returns {Promise<Object>} User object
 */
export const checkAuthStatus = async () => {
  const { data } = await axios.get(`${API_URL}/api/auth/me`);
  return data;
};

/**
 * Logs the user out.
 */
export const logout = async () => {
  const { data } = await axios.post(`${API_URL}/api/auth/logout`);
  return data;
};

/**
 * Updates the user's profile after first login.
 * @param {Object} profileData - { name, nickname, year, department }
 * @returns {Promise<Object>} Updated user object
 */
export const updateProfile = async (profileData) => {
  const { data } = await axios.post(`${API_URL}/api/profile`, profileData);
  return data;
};

/**
 * Fetches all notes, optionally filtered by category.
 * @param {string} category - 'For You', 'Featured', or 'Events'
 * @returns {Promise<Array>} Array of note objects
 */
export const getAllNotes = async (category) => {
  const { data } = await axios.get(`${API_URL}/api/notes`, {
    params: { category },
  });
  return data;
};

/**
 * Posts a new note.
 * @param {Object} noteData - { text, category }
 * @returns {Promise<Object>} The newly created note object
 */
export const postNewNote = async (noteData) => {
  const { data } = await axios.post(`${API_URL}/api/notes`, noteData);
  return data;
};

/**
 * Deletes a note by its ID.
 * @param {string} noteId - The _id of the note
 */
export const deleteNoteById = async (noteId) => {
  const { data } = await axios.delete(`${API_URL}/api/notes/${noteId}`);
  return data;
};