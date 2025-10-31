import React from 'react';
import { motion } from 'framer-motion';

// Use the API_URL from api.js or .env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LoginPage = () => {
  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center text-center">
      <motion.h1
        className="display-1 fw-bold text-yellow"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        BlinkWall
      </motion.h1>
      
      <motion.p
        className="lead fs-4 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Stories with a Human touch!
      </motion.p>
      
      <motion.a
        href={`${API_URL}/api/auth/google`}
        className="btn btn-yellow btn-lg px-5 py-2 pulse"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
      >
        Get started
      </motion.a>
      
      <p className="text-muted mt-4">
        Sign in with your @karunya.edu.in account
      </p>
    </div>
  );
};

export default LoginPage;