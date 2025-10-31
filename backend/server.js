import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import cors from 'cors';

// Import local modules
import connectDB from './db.js';
import User from './models/User.js';
import Note from './models/Note.js';

// --- Configuration and Setup ---
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// Trust proxy to allow secure cookies via Vercel
app.set('trust proxy', 1);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests from our frontend
    credentials: true, // Allow cookies
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// --- Passport Strategy (Google OAuth) ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // === !! REQUIREMENT: @karunya.edu.in domain check !! ===
        const email = profile.emails[0].value;
        if (!email.endsWith('@karunya.edu.in')) {
          return done(null, false, {
            message: 'Access denied. Only @karunya.edu.in accounts are allowed.',
          });
        }

        // Find or create user
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            googleId: profile.id,
            email: email,
            name: profile.displayName,
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Passport Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// --- Custom Middleware ---
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

const isProfileComplete = (req, res, next) => {
  if (req.user && req.user.profileCompleted) {
    return next();
  }
  res.status(403).json({ message: 'Profile incomplete. Please update your profile.' });
};

// --- API Routes ---

// 1. Auth Routes
app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login-failure`, // Send them back to login
  }),
  (req, res) => {
    // Successful authentication, redirect to frontend.
    // Frontend will handle profile check.
    res.redirect(process.env.FRONTEND_URL);
  }
);

app.get('/api/auth/me', isLoggedIn, (req, res) => {
  // User is deserialized and attached to req.user
  res.json(req.user);
});

app.post('/api/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session.' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
});

// 2. Profile Route
app.post('/api/profile', isLoggedIn, async (req, res) => {
  const { name, nickname, year, department } = req.body;

  if (!name || !nickname || !year || !department) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        nickname,
        year,
        department,
        profileCompleted: true,
      },
      { new: true } // Return the updated document
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile.', error: err });
  }
});

// 3. Notes Routes
app.get('/api/notes', isLoggedIn, async (req, res) => {
  const { category } = req.query;
  let filter = {};

  // 'For You' means all categories.
  if (category && (category === 'Featured' || category === 'Events')) {
    filter.category = category;
  }

  try {
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Add pagination later if needed
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes.' });
  }
});

app.post('/api/notes', isLoggedIn, isProfileComplete, async (req, res) => {
  const { text, category } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Note text cannot be empty.' });
  }

  // === !! REQUIREMENT: 15-word limit check !! ===
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount > 15) {
    return res.status(400).json({ message: 'Note must be 15 words or less.' });
  }

  try {
    const newNote = new Note({
      text,
      category: category || 'For You', // Default category
      authorId: req.user.id,
      authorNickname: req.user.nickname, // Save nickname for easy display
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Error posting note.' });
  }
});

app.delete('/api/notes/:id', isLoggedIn, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    // === !! REQUIREMENT: User can only delete their own notes !! ===
    if (note.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this note.' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Note deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note.' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});