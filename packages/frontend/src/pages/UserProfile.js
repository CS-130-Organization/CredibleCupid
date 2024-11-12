import * as CredibleCupid from '../credible_cupid/src/index'
import InitDefaultCredibleCupidClient from '../client/Client';

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Instagram, User, Star, MapPin, Verified, Briefcase, GraduationCap, Ruler } from 'lucide-react';
import { colors, spacing } from '../styles/theme';
import { 
  imageStyles,
  inputStyles,
} from '../styles/commonStyles';


const styles = {
  container: {
    width: '390px',
    // height: '844px',
    position: 'relative',
    background: `linear-gradient(145deg, ${colors.gray.lighter} 0%, ${colors.white} 100%)`,
    display: 'flex',
    alignItems: 'flex-start', 
    justifyContent: 'center',
    overflow: 'hidden', 
  },
  loginBox: {
    backgroundColor: colors.white,
    borderRadius: '0', 
    padding: '40px 20px', 
    width: '390px', 
    minHeight: '844px', 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
    boxShadow: 'none', 
  },
  logoContainer: {
    width: '100%',
    height: '320px',
    backgroundColor: colors.gray.lighter,
    borderRadius: '0', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    overflow: 'hidden',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: colors.gray.text,
    margin: '0 0 8px 0',
    textAlign: 'flex-start',
  },
  subtitle: {
    fontSize: '16px',
    color: colors.gray.text,
    opacity: 0.8,
    margin: '0',
    textAlign: 'left',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    alignItems: 'flex-start', 
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.gray.text,
    textAlign: 'left',
    alignSelf: 'flex-start', 
    marginBottom: '4px', 
    
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: `1px solid ${colors.gray.border}`,
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    backgroundColor: colors.gray.lighter,
  },
  button: {
    backgroundColor: colors.green.light,
    color: colors.white,
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '16px',
    width: '100%',
    marginTop: '12px',
    boxShadow: `0 2px 8px ${colors.black.opacity10}`,
  },
  verifiedBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: `${colors.white}e6`,
    padding: '6px 12px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: colors.blue,
  },
  infoSection: {
    padding: '16px',
    flex: 1,
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  nameAgeGender: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  getScoreStyle: (score) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: score >= 75 ? colors.lightGreen : score >= 25 ? colors.orange : colors.lightRed,
    color: score >= 75 ? colors.green : score >= 25 ? colors.darkOrange : colors.red,
  }),
  bio: {
    fontSize: '16px',
    color: colors.darkGray,
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  detailsContainer: {
    marginBottom: '16px',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '16px',
    color: colors.darkGray,
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  placeholderImage: {
    backgroundColor: colors.lightGray,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.darkGray,
    fontSize: '16px',
  }
};

function UserProfile({
    credibilityScore = 90,
    }) {
  const { guid } = useParams(); // Retrieve GUID from route parameters
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [tokenRefreshed, setTokenRefreshed] = useState(false); // Track if auth has been refreshed



  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtToken");

    const fetchProfile = (guid) => {
    //   setIsOwner(true);

      const apiInstance = new CredibleCupid.UserApi();
      apiInstance.queryUser(guid, (error, data) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Successfully fetched profile");

          const birthdayDate = new Date(data.birthday_ms_since_epoch);
          const formattedBirthday = birthdayDate instanceof Date && !isNaN(birthdayDate)
            ? birthdayDate.toISOString().split('T')[0]
            : "";

          const heightFeet = data.height_mm ? Math.floor(data.height_mm / 25.4 / 12) : 0;
          const heightInches = data.height_mm ? Math.round((data.height_mm / 25.4) % 12) : 0;
            

          const updatedUserData = { ...data, date_of_birth: formattedBirthday, height_ft: heightFeet, height_in: heightInches };
          setUserData(updatedUserData);



          apiInstance.profilePicUser(guid, (error, data, response) => {
            if (error) {
              console.error("Error fetching profile picture:", error);
            } else {
              // Assuming response contains the URL to the profile picture
              setProfilePicUrl(response.req.url); // Update the state with the new profile picture URL

              console.log("Profile picture fetched successfully " + JSON.stringify(response.req.url, null, 2));
            }
          });
        }
      });
    };

    if (jwtToken && !tokenRefreshed) {
      InitDefaultCredibleCupidClient(jwtToken);

      let apiInstance = new CredibleCupid.AuthApi();
      apiInstance.authRefresh((error, data, response) => {
        if (error) {
          console.error(response);
        } else {
          console.log('API called successfully. Returned data: ' + JSON.stringify(data, null, 2));
          sessionStorage.setItem("jwtToken", data.jwt);
          setTokenRefreshed(true);
          fetchProfile(guid); 
        }
      });
    } else if (!jwtToken) {
      console.error("JWT token not found. Redirecting to login.");
      navigate("/login");
    }

  }, [tokenRefreshed, navigate, guid]);

  // Calculate the age based on `birthday_ms_since_epoch`
  const calculateAge = (birthdayMs) => {
    if (!birthdayMs || isNaN(birthdayMs)) {
      return "Age not provided"; // or return a fallback value if preferred
    }
    const ageDifMs = Date.now() - birthdayMs;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleBackClick = () => {
    navigate(-1);  // Go back to the previous page
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <>
        <motion.div style={{
        width: '390px',
        // height: '844px',
        backgroundColor: colors.white,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        >
             {/* Back Button */}
        <button
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            position: 'absolute',
            top: '20px',
            left: '20px',
            cursor: 'pointer',
            fontSize: '24px',
            color: colors.gray.text,
            zIndex: 1, // Ensures it appears above the image
          }}
          onClick={handleBackClick}
        >
          <ArrowLeft size={24} />
        </button>
            {/* Profile Image Section */}

            <motion.div style={{
              // width: '300px', // Smaller logo
              // height: '300px',
              width: '100%',
              height: '300px', // Adjust height as needed
              position: 'relative', // Needed for absolute positioning within this div
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // marginTop: '60px' // Push down from top
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            >
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt={`${userData.first_name}'s profile`}
                  // style={imageStyles.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    // objectFit: 'contain',
                    objectFit: 'cover', // Adjusts how image scales
                    opacity: 0.9,
                    borderRadius: 0
                  }}
                  />
              ) : (
                <img
                //   src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  src={imageStyles.placeholder}  
                  alt={`${userData.first_name}'s profile`}
                  // style={imageStyles.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    // objectFit: 'contain',
                    objectFit: 'cover', // Adjusts how image scales
                    opacity: 0.9,
                    borderRadius: 10
                  }}
                  />
              )}
              {
                <motion.div style={{
                  position: 'absolute',
                  top: '10px', // Adjusts distance from top of image
                  right: '10px', // Adjusts distance from left of image
                //   backgroundColor: colors.primary, // Set background color to make it stand out
                  color: colors.white,
                  padding: '4px 8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Verified size={16} />
                  <span>Verified</span>
                </motion.div>
              }

            </motion.div>

            {/* Content Container */}
            <motion.div style={{
              // width: '100%',
              // padding: '0 spacing.xl',
              // maxWidth: '350px', // Constrain width of form
              // marginTop: spacing.xl
              marginTop: '-30px', // Negative margin to overlap the bottom of the image
              backgroundColor: colors.white,
              width: '98%',
              padding: '16px',
              boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.2)', // Optional: shadow to make it appear elevated
              borderRadius: '64px',
              position: 'relative',
              zIndex: 1, // Ensures it appears above the image
            }}
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div style={{
                width: '90%',
                // padding: '0 spacing.xl',
                padding: '20px',
                maxWidth: '300px', // Constrain width of form
                // marginTop: spacing.xl
                marginTop: '5px', 
                marginBottom: '10px', 
                marginLeft: '10px', 
                marginRight: '10px', 
                // margin: '10px', 
              }}>
                {/* Header Section */}
                <div style={{
                  textAlign: 'left',
                  marginBottom: spacing.xl
                }}>
                  <motion.div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: spacing.md
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <div>
                          <h1 style={{
                            fontSize: '30px',
                            fontWeight: '600',
                            color: colors.gray.text,
                            margin: `0 0 ${spacing.xs} 0`
                          }}>
                          {userData.first_name} {userData.last_name}
                          </h1>

                          {userData?.gender && userData?.birthday_ms_since_epoch && (<div style={{
                            fontSize: '16px',
                            color: colors.gray.text,
                            opacity: 0.7,
                            margin: 0
                          }}>
                            <User size={20} color={colors.darkGray} />
                            <span>{userData?.gender ? ` ${userData?.gender}` : ''}, {userData.birthday_ms_since_epoch ? ` ${calculateAge(userData.birthday_ms_since_epoch)}` : ', Age not provided'}, {userData?.pronouns ? ` ${userData?.pronouns}` : ''} </span>
                          </div>)}
                          {userData?.email && (<div style={{
                            fontSize: '16px',
                            color: colors.gray.text,
                            opacity: 0.7,
                            margin: 0
                          }}>
                            <Instagram size={20} color={colors.darkGray} />
                            <span> {userData?.email}</span>
                          </div>)}
                          {userData?.location && (<div style={{
                            fontSize: '16px',
                            color: colors.gray.text,
                            opacity: 0.7,
                            margin: 0
                          }}>
                            <MapPin size={20} color={colors.darkGray} />
                            <span> {userData?.location}</span>
                          </div>)}
                      </div>


                        <motion.div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: spacing.xs,
                            padding: `${spacing.xs} ${spacing.md}`,
                            borderRadius: spacing.md,
                            fontSize: '14px',
                            fontWeight: '500',
                            backgroundColor: credibilityScore >= 75 ? '#dcfce7' : credibilityScore >= 25 ? colors.orange.light : '#fee2e2',
                            color: credibilityScore >= 75 ? colors.green.dark : credibilityScore >= 25 ? colors.orange.dark : colors.red.dark
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <Star size={16} />
                            <span>{credibilityScore}%</span>
                        </motion.div>                  
                    </motion.div>
                </div>

                {/* Info Section */}
                <motion.div 
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.lg
                  }}
                  // onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {/* Bio */}
                  <div style={inputStyles.container}>
                    <label style={inputStyles.label}>
                      About Me
                    </label>
                    <div>
                    <p style={styles.subtitle}>{userData?.bio || "No bio available"}</p>
                    </div>
                    {userData?.height_mm && (<div style={{
                      fontSize: '16px',
                      color: colors.gray.text,
                      opacity: 0.7,
                      margin: 0
                    }}>
                      <Ruler size={20} color={colors.darkGray} />
                      <span> {Math.floor(userData.height_mm / 25.4 / 12)}' {Math.round((userData.height_mm / 25.4) % 12)}</span>
                    </div>)}
                    {userData?.occupation && (<div style={{
                      fontSize: '16px',
                      color: colors.gray.text,
                      opacity: 0.7,
                      margin: 0
                    }}>
                      <Briefcase size={20} color={colors.darkGray} />
                      <span> {userData?.occupation}</span>
                    </div>)}
                    {userData?.education && (<div style={{
                      fontSize: '16px',
                      color: colors.gray.text,
                      opacity: 0.7,
                      margin: 0
                    }}>
                      <GraduationCap size={20} color={colors.darkGray} />
                      <span> {userData?.education}</span>
                    </div>)}
                  </div>

                    {/* Referrals */}
                    <motion.div  style={inputStyles.container}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 1.0, duration: 0.5 }}>
                        <label style={inputStyles.label}>
                        Referrals
                        </label>
                        <div>
                        <p style={styles.subtitle}>Person 1: I know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
                        <p style={styles.subtitle}>Person 2: I know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
                        <p style={styles.subtitle}>Person 3: I know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
                        </div>
                    </motion.div>
                  </motion.div>
                </div>
            </motion.div>
          </motion.div>
        </>
        <br></br>
        <br></br>
        <br></br>
    </div>
  );
}

export default UserProfile;