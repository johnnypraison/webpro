import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

const ProfilePage = ({ setAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    year: '1',
    department: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.nickname || !formData.department) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');

    api.updateProfile(formData)
      .then((updatedUser) => {
        // Update the auth state in App.js
        setAuth((prev) => ({ ...prev, user: updatedUser }));
        // Redirect to home
        navigate('/');
      })
      .catch((err) => {
        setError('Failed to update profile. Please try again.');
        console.error(err);
      });
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="col-md-6 col-lg-5">
        <h2 className="text-center text-yellow mb-4">Complete Your Profile</h2>
        <p className="text-center text-muted mb-4">
          Welcome to BlinkWall! Just a few details to get you set up.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nickname" className="form-label">Nickname (Public)</label>
            <input
              type="text"
              className="form-control"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="This will be shown on your posts"
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="year" className="form-label">Year of Study</label>
              <select
                className="form-select"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="department" className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., B.Tech CSE"
                required
              />
            </div>
          </div>
          
          {error && <p className="text-danger text-center">{error}</p>}

          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-yellow btn-lg">
              Save Profile & Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;