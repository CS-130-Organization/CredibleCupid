import React, { useState, useEffect, useRef } from 'react';
import ProfileGridCard from '../pages/ProfileGridCard';
import * as CredibleCupidApi from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import { colors, spacing } from '../styles/theme';
import { buttonStyles } from '../styles/commonStyles';
import ProfileDetailsPopup from './ProfileDetailsPopup';

const MatchesPage = () => {
  const [matchGuids, setMatchGuids] = useState([]);
  const [loadedProfiles, setLoadedProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loadedGuids, setLoadedGuids] = useState(new Set());

  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Initialize API clients
  const defaultClient = CredibleCupidApi.ApiClient.instance;
  const bearer = defaultClient.authentications['bearer'];
  const jwtToken = sessionStorage.getItem("jwtToken");
  InitDefaultCredibleCupidClient(jwtToken);
  bearer.accessToken = jwtToken;

  const matchmakerApi = new CredibleCupidApi.MatchmakerApi();
  const userApi = new CredibleCupidApi.UserApi();
  const referralApi = new CredibleCupidApi.ReferralApi();

  const calculateAge = (birthdayMs) => {
    const ageDifMs = Date.now() - birthdayMs;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const fetchReferrerData = async (referrerGuid) => {
    return new Promise((resolve, reject) => {
      userApi.queryUser(referrerGuid, (error, data) => {
        if (error) {
          console.error("Error fetching referrer data:", error);
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  const fetchReferralDetails = (referralGuid) => {
    return new Promise((resolve, reject) => {
      referralApi.getReferral(referralGuid, (error, data) => {
        if (error) {
          console.error("Error fetching referral data:", error);
          reject(error);
        } else {
          resolve(data.message);
        }
      });
    });
  };

  const fetchAllReferrals = async (referralGuids) => {
    try {
      const referralPromises = referralGuids.map((guid) => fetchReferralDetails(guid));
      const allReferrals = await Promise.all(referralPromises);
      return allReferrals;
    } catch (error) {
      console.error("Error fetching all referrals:", error);
      return [];
    }
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
          userGuids.forEach((guid) => loadProfile(guid));
        }
      });
    } catch (err) {
      setError('Failed to fetch matches');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {    
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  function convertHeightToFeetInches(heightMm) {
    if (!heightMm || isNaN(heightMm)) {
      return "Height not provided";
    }
    const totalInches = heightMm * 0.0393701;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    if (inches === 12) {
      return `${feet + 1}'0"`;
    }
    return `${feet}'${inches}"`;
  }

  const loadProfile = (guid) => {
    if (!guid || loadedProfiles.some(p => p.guid === guid)) return;

    if (!guid || loadedGuids.has(guid)) return;
    setLoadedGuids(prev => new Set([...prev, guid]));
    
    userApi.queryUser(guid, (error, data) => {
      if (error) {
        console.error(error);
      } else {
        const age = calculateAge(data.birthday_ms_since_epoch);
        const height = data.height_mm ? convertHeightToFeetInches(data.height_mm) : null;

        // First fetch referrals if they exist
        const referralsPromise = data.referrals?.length > 0 
          ? fetchAllReferrals(data.referrals)
          : Promise.resolve([]);

        // Then get the profile picture
        const profilePicPromise = new Promise((resolve) => {
          userApi.profilePicUser(guid, (error, picData, response) => {
            resolve(error ? null : response.req.url);
          });
        });

         // Wait for both promises to resolve
         Promise.all([referralsPromise, profilePicPromise])
        .then(([formattedReferrals, profileURL]) => {
          setLoadedProfiles(prev => {
            // Check if profile already exists
            if (prev.some(p => p.guid === guid)) {
              return prev;
            }
            return [...prev, {
              ...((data.first_name || data.last_name) ? {
                name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim()
              } : {}),
              ...(age && age !== "Age not provided" ? { age } : {}),
              ...(height && height !== "Height not provided" ? { height } : {}),
              ...(data.gender ? { gender: data.gender[0] } : {}),
              ...(data.bio ? { bio: data.bio } : {}),
              ...(data.credibility_score ? { credibility_score: data.credibility_score } : {}),
              ...(data.occupation ? { occupation: data.occupation } : {}),
              ...(data.sexual_orientation ? { orientation: data.sexual_orientation } : {}),
              ...(data.pronouns ? { pronouns: data.pronouns } : {}),
              ...(data.email ? { email: data.email } : {}),
              ...(profileURL ? { imageUrl: profileURL } : {}),
              ...(formattedReferrals.length > 0 ? { referrals: formattedReferrals } : {}),
              guid: guid
            }];
          });
        })
    }
  });
};

  const resetProfiles = () => {
    setLoadedProfiles([]);
    setMatchGuids([]);
    fetchMatches();
  };

  const styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: spacing.md,
      padding: spacing.lg,
      marginTop: headerHeight ? `${headerHeight + 20}px` : '100px',
    },
    emptyState: {
      textAlign: 'center',
      padding: spacing.xl,
    },
    resetButton: {
      ...buttonStyles.base,
      backgroundColor: colors.green.light,
      marginTop: spacing.md,
      '&:hover': {
        backgroundColor: colors.green.dark,
      }
    },
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      backgroundColor: colors.white,
      padding: '12px 0',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      height: 'auto',
      backgroundColor: colors.white,
    },
    headerTitle: {
      fontSize: '22px',
    },
  };
  

  if (error) {
    return (
      <div style={styles.emptyState}>
        <p>{error}</p>
        <button style={styles.resetButton} onClick={resetProfiles}>Try Again</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={styles.emptyState}>
        <p>Loading matches...</p>
      </div>
    );
  }

  const handleProfileClick = (profileId) => {
    const profile = loadedProfiles.find(p => p.guid === profileId);    
    if (!profile) return;
    setSelectedProfile(profile);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProfile(null);
  };


  return (
    <div>
      <div ref={headerRef} style={styles.header}>
        <h1 style={styles.headerTitle}>Matches</h1>
      </div>
      <div style={styles.gridContainer}>
        {loadedProfiles.length > 0 ? (
          loadedProfiles.map(profile => (
            <ProfileGridCard key={profile.guid} {...profile} onClick={() => handleProfileClick(profile.guid)}/>
          ))
        ) : (
          <div style={styles.emptyState}>
            <p>No profiles to show</p>
            <button style={styles.resetButton} onClick={resetProfiles}>Find More Matches</button>
          </div>
        )}
      </div>

      {isPopupOpen && selectedProfile && (
        <ProfileDetailsPopup {...selectedProfile} onClose={closePopup} />
      )}
      
    </div>
  );
};

export default MatchesPage;
