import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from '../pages/ProfileCard';
import * as CredibleCupidApi from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';

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

  errorState: {
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

  errorText: {
    color: '#ef4444',
    fontSize: '1.25rem',
    fontWeight: '600',
    textAlign: 'center',
    margin: 0,
  },

  retryButton: {
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
  }
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
  const [matchGuids, setMatchGuids] = useState([]);
  const [loadedProfiles, setLoadedProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize API clients
  const defaultClient = CredibleCupidApi.ApiClient.instance;
  const bearer = defaultClient.authentications['bearer'];
  const jwtToken = sessionStorage.getItem("jwtToken");
  console.log("jwtToken = ", jwtToken)
  InitDefaultCredibleCupidClient(jwtToken);
  bearer.accessToken = jwtToken;
  
  const matchmakerApi = new CredibleCupidApi.MatchmakerApi();
  const userApi = new CredibleCupidApi.UserApi();

   // Calculate the age based on `birthday_ms_since_epoch`
   const calculateAge = (birthdayMs) => {
    const ageDifMs = Date.now() - birthdayMs;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      matchmakerApi.findMatches((error, data) => {
        if (error) {
          setError('Failed to fetch matches');
          console.error(error);
        } else {
          const userGuids = data.user_guids || [];
          setMatchGuids(userGuids);
          // Load first two profiles initially for smooth transition
          if (userGuids.length > 0) {
            console.log("first guid match = ", userGuids[0])
            loadProfile(userGuids[0]);
            if (userGuids.length > 1) {
              loadProfile(userGuids[1]);
            }
          } else {
            setIsLoading(false);
          }
        }
      });
    } catch (err) {
      setError('Failed to fetch matches');
      console.error(err);
      setIsLoading(false);
    }
  };

  // Fetch initial matches
  useEffect(() => {
    fetchMatches();
  }, []);

  const loadProfile = async (guid) => {
    if (!guid || loadedProfiles.some(p => p.guid === guid)) return;

    try {
      userApi.queryUser(guid, (error, data) => {
        if (error) {
          console.log("errrrooooor")
          console.error(error);
        } else {
          const age = calculateAge(data.birthday_ms_since_epoch);
          
          setLoadedProfiles(prev => [...prev, {
            ...((data.first_name || data.last_name) ? {
              name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim()
            } : {}),
            ...(age ? { age } : {}),  // Only include age if it exists
            ...(data.gender ? { gender: data.gender[0] } : {}),
            ...(data.bio ? { bio: data.bio } : {}),
            ...(data.credibilityScore ? { credibilityScore: data.credibilityScore } : {}),
            ...(data.occupation ? { occupation: data.occupation } : {}),
            ...(data.education ? { education: data.education } : {}),
            ...(data.location ? { location: data.location } : {}),
            ...(data.interests ? { interests: data.interests } : {}),
            ...(data.verified !== undefined ? { verified: data.verified } : {}),
            ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
            guid: guid
          }]);
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  // Pre-load next profile when current profile changes
  useEffect(() => {
    if (loadedProfiles.length > 0 && !isLoading) {
      const currentIndex = matchGuids.findIndex(guid => guid === loadedProfiles[0].guid);
      if (currentIndex >= 0 && currentIndex < matchGuids.length - 1) {
        const nextGuid = matchGuids[currentIndex + 1];
        loadProfile(nextGuid);
      }
    }
  }, [loadedProfiles, isLoading]);

  const removeCard = async (action) => {
    if (isDragging) return;
    setIsDragging(true);
    setCurrentAction(action);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300));

    setLoadedProfiles(prev => prev.slice(1));
    setCurrentAction(null);
    setIsDragging(false);
  };

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      const action = info.offset.x > 0 ? 'like' : 'pass';
      removeCard(action);
    }
  };

  const resetCards = async () => {
    setLoadedProfiles([]);
    setMatchGuids([]);
    fetchMatches();
  };

  if (error) {
    return (
      <div style={styles.cardStackContainer}>
        <div style={styles.errorState}>
          <p style={styles.errorText}>{error}</p>
          <button
            style={styles.retryButton}
            onClick={resetCards}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#16a34a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#22c55e';
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={styles.cardStackContainer}>
        <div style={styles.emptyState}>
          <p style={styles.emptyStateText}>Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.cardStackContainer}>
      <div style={styles.cardContainer}>
        <AnimatePresence mode="wait">
          {loadedProfiles.length > 0 ? (
            <motion.div
              style={styles.cardWrapper}
              key={loadedProfiles[0].guid}
              initial={{ opacity: 1, scale: 1, x: 0 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              exit={{ 
                x: currentAction === 'like' ? 300 : -300,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3 }
              }}
            >
              <ProfileCard
                {...loadedProfiles[0]}
                onLike={() => removeCard('like')}
                onPass={() => removeCard('pass')}
              />
              <AnimatePresence>
                {currentAction && <ActionOverlay action={currentAction} />}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              style={styles.emptyState}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <p style={styles.emptyStateText}>No more profiles to show!</p>
              <button
                style={styles.resetButton}
                onClick={resetCards}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#22c55e';
                }}
              >
                Find More Matches
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CardStack;