import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginFailurePage = () => {
  const navigate = useNavigate();

  // This hook runs once when the page loads
  useEffect(() => {
    // Set a timer for 2 seconds (2000 milliseconds)
    const timer = setTimeout(() => {
      // After 2 seconds, navigate back to the login page
      navigate('/login');
    }, 2000);

    // This is a cleanup function to clear the timer
    // if the user navigates away early
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center text-center">
      <motion.h1
        className="display-3 fw-bold text-danger" // Use Bootstrap's red text
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        Ohoh! Wrong Email
      </motion.h1>
      
      <motion.p
        className="lead fs-4 mb-4 text-yellow" // Use our theme's yellow text
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Come on, you know the drill! Please use your KMail ID. 😉
      </motion.p>
      
      <p className="text-muted">Redirecting you to login...</p>
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoginFailurePage;