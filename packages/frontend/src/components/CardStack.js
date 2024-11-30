import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from '../pages/ProfileCard';
import * as CredibleCupidApi from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import { colors, spacing } from '../styles/theme';
import { cardStyles, buttonStyles } from '../styles/commonStyles';

const ActionOverlay = ({ action }) => {
  if (!action) return null;

  const overlayStyles = {
    container: {
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
    text: {
      fontSize: '36px',
      fontWeight: 'bold',
      padding: `${spacing.md} ${spacing.lg}`,
      border: '4px solid',
      borderRadius: spacing.md,
      transform: 'rotate(-30deg)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      ...(action === 'like' ? {
        color: colors.green.light,
        borderColor: colors.green.light,
      } : {
        color: colors.red.light,
        borderColor: colors.red.light,
      })
    }
  };

  const text = action === 'like' ? 'LIKED' : 'PASSED';

  return (
    <motion.div
      style={overlayStyles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={overlayStyles.text}
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
  // console.log("jwtToken = ", jwtToken)
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
    // no guid or duplicate profile
    if (!guid || loadedProfiles.some(p => p.guid === guid)) return;


    userApi.queryUser(guid, (error, data) => {
      if (error) {
        console.error(error);
      } else {
        const age = calculateAge(data.birthday_ms_since_epoch);

        // Get profile picture first
        userApi.profilePicUser(guid, (error, picData, response) => {
          if (error) {
            console.error(error);
            // Still create profile without picture
            createAndSetProfile(null);
          } else {
            // Create profile with picture URL
            createAndSetProfile(response.req.url);
          }
        });

        // Helper function to create and set profile
        function createAndSetProfile(profileURL) {
          setLoadedProfiles(prev => [...prev, {
            ...((data.first_name || data.last_name) ? {
              name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim()
            } : {}),
            ...(age ? { age } : {}),
            ...(data.gender ? { gender: data.gender[0] } : {}),
            ...(data.bio ? { bio: data.bio } : {}),
            ...(data.credibilityScore ? { credibilityScore: data.credibilityScore } : {}),
            ...(data.occupation ? { occupation: data.occupation } : {}),
            ...(data.education ? { education: data.education } : {}),
            ...(data.location ? { location: data.location } : {}),
            ...(data.interests ? { interests: data.interests } : {}),
            ...(profileURL ? { imageUrl: profileURL } : {}),
            guid: guid
          }]);

          setIsLoading(false);
        }
      }
    });

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
    console.log("guid = ", loadedProfiles[0].guid)
    // If action is like, call the API
    if (action === 'like' && loadedProfiles[0]?.guid) {
      try {
        matchmakerApi.likeUser(loadedProfiles[0]?.guid, (error, data, response) => {
          if (error) {
            console.error(`Failed to like user ${loadedProfiles[0].guid}`);
          } else {
            console.log(`Liked user ${data.guid}${data.matched ? ' - Match!' : ''}`)
          }
        });
      } catch (error) {
        console.error(`Error liking user ${loadedProfiles[0].guid}`);
      }
    } else if (action === 'pass' && loadedProfiles[0]?.guid) {
      try {
        matchmakerApi.passUser(loadedProfiles[0]?.guid, (error, data, response) => {
          if (error) {
            console.error(`Failed to pass user ${loadedProfiles[0].guid}`);
          } else {
            console.log(`Passed user ${loadedProfiles[0].guid}`);
          }
        });
      } catch (error) {
        console.error(`Error passing user ${loadedProfiles[0].guid}`);
      }
    }

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

  // Component-specific styles
  const styles = {
    cardWrapper: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      willChange: 'transform',
    },
    emptyState: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: colors.white,
      borderRadius: spacing.md,
      padding: spacing.xl,
      width: '300px',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.lg,
      boxShadow: `0 2px 10px ${colors.black.opacity10}`,
      zIndex: 20,
    },
    emptyText: {
      color: colors.red.light,
      fontSize: '1.25rem',
      fontWeight: '600',
      textAlign: 'center',
      margin: 0,
    },
    resetButton: {
      ...buttonStyles.base,
      backgroundColor: colors.green.light,
      '&:hover': {
        backgroundColor: colors.green.dark,
      }
    }
  };

  if (error) {
    return (
      <div style={cardStyles.container}>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>{error}</p>
          <button
            style={styles.resetButton}
            onClick={resetCards}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.green.dark;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.green.light;
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
      <div style={cardStyles.container}>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyles.container}>
      <div style={cardStyles.content}>
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
            <div style={styles.emptyState}>
            <p style={styles.emptyText}>No more profiles to show!</p>
            <button
              style={styles.resetButton}
              onClick={resetCards}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = colors.green.dark;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = colors.green.light;
              }}
            >
              Find More Matches
            </button>
          </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CardStack;