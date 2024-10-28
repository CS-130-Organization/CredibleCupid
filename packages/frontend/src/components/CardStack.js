import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from '../pages/ProfileCard';
import sobbingProfileImage from '../assets/images/sobbing.png'
import temporaryProfileImage from '../assets/images/temp-profile.png'

const styles = {
  cardStackContainer: {
    width: '390px',
    height: '844px',
    position: 'relative',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },

  cardContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    perspective: '1000px',
  },

  cardWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    willChange: 'transform',
  },

  actionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 10,
  },

  actionText: {
    fontSize: '36px',
    fontWeight: 'bold',
    padding: '12px 24px',
    border: '4px solid',
    borderRadius: '12px',
    transform: 'rotate(-30deg)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },

  likedText: {
    color: '#22c55e',
    borderColor: '#22c55e',
  },

  passedText: {
    color: '#ef4444',
    borderColor: '#ef4444',
  },

  emptyState: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 20,
  },

  emptyStateText: {
    color: '#ef4444',
    fontSize: '1.25rem',
    fontWeight: '600',
    textAlign: 'center',
    margin: 0,
  },

  resetButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontSize: '16px',
    width: '100%',
  },
};

const ActionOverlay = ({ action }) => {
  if (!action) return null;

  const text = action === 'like' ? 'LIKED' : 'PASSED';
  const textStyle = {
    ...styles.actionText,
    ...(action === 'like' ? styles.likedText : styles.passedText),
  };

  return (
    <motion.div
      style={styles.actionOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={textStyle}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
      >
        {text}
      </motion.div>
    </motion.div>
  );
};

const CardStack = () => {
  const initialProfiles = [
    {
      name: "Sarah Johnson",
      age: 28,
      gender: "F",
      bio: "Coffee enthusiast and weekend hiker. Looking for someone to share adventures with.",
      credibilityScore: 85,
      occupation: "Software Engineer",
      education: "Master's in Computer Science",
      location: "San Francisco",
      interests: ["Photography", "Hiking", "Jazz", "Cooking"],
      verified: true,
      imageUrl: sobbingProfileImage
    },
    {
      name: "Michael Chen",
      age: 31,
      gender: "M",
      bio: "Passionate about music and trying new restaurants. Always up for an adventure!",
      credibilityScore: 92,
      occupation: "Product Manager",
      education: "MBA",
      location: "New York",
      interests: ["Food", "Travel", "Guitar", "Tennis"],
      verified: true,
    },
    {
      name: "Emma Wilson",
      age: 26,
      gender: "F",
      bio: "Art lover and yoga instructor. Seeking someone to explore galleries with.",
      credibilityScore: 78,
      occupation: "Yoga Instructor",
      education: "BFA in Fine Arts",
      location: "Los Angeles",
      interests: ["Yoga", "Art", "Museums", "Meditation"],
      verified: true,
      imageUrl: temporaryProfileImage
    }
  ];

  const [profiles, setProfiles] = useState(initialProfiles);
  const [currentAction, setCurrentAction] = useState(null);

  const removeCard = (action) => {
    setCurrentAction(action);
    setTimeout(() => {
      setProfiles(prevProfiles => prevProfiles.slice(1));
      setCurrentAction(null);
    }, 500);
  };

  return (
    <div style={styles.cardStackContainer}>
      <div style={styles.cardContainer}>
        <AnimatePresence mode="wait">
          {profiles.length > 0 && (
            <motion.div
              style={styles.cardWrapper}
              key={profiles[0].name}
              initial={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ 
                x: currentAction === 'like' ? 300 : -300,
                opacity: 0,
                scale: 0.8,
                transition: { 
                  duration: 0.3,
                }
              }}
            >
              <ProfileCard
                {...profiles[0]}
                onLike={() => removeCard('like')}
                onPass={() => removeCard('pass')}
              />
              <AnimatePresence>
                {currentAction && <ActionOverlay action={currentAction} />}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        
        {profiles.length === 0 && (
          <motion.div 
            style={styles.emptyState}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <p style={styles.emptyStateText}>No more profiles to show!</p>
            <button
              style={styles.resetButton}
              onClick={() => setProfiles(initialProfiles)}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#16a34a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#22c55e';
              }}
            >
              Reset Cards
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CardStack;