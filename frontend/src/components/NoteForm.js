import React, { useState } from 'react';

const NoteForm = ({ onPostNote }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('For You');
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > 15;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOverLimit || text.trim() === '') {
      setError('Blink must be between 1 and 15 words.');
      return;
    }

    setIsPosting(true);
    setError('');

    onPostNote({ text, category })
      .then(() => {
        // Success! Clear the form
        setText('');
        setCategory('For You');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to post blink.');
      })
      .finally(() => {
        setIsPosting(false);
      });
  };

  return (
    <div className="note-card p-3 my-3">
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control"
          rows="3"
          placeholder="What's on your mind? (15 word limit)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isPosting}
        ></textarea>
        
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex align-items-center">
            <label htmlFor="category" className="form-label me-2 mb-0">Category:</label>
            <select
              id="category"
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPosting}
            >
              <option value="For You">For You</option>
              <option value="Featured">Featured</option>
              <option value="Events">Events</option>
            </select>
          </div>
          
          <div className="d-flex align-items-center">
            <span className={`me-3 ${isOverLimit ? 'text-danger' : 'text-muted'}`}>
              {wordCount}/15
            </span>
            <button
              type="submit"
              className="btn btn-yellow btn-sm"
              disabled={isPosting || isOverLimit || text.trim() === ''}
            >
              {isPosting ? 'Blinking...' : 'Blink'}
            </button>
          </div>
        </div>
        {error && <p className="text-danger text-center small mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default NoteForm;