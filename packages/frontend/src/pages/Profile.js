import React, { useEffect, useState, useRef } from 'react';

import * as CredibleCupid from '../credible_cupid/src/index'
import InitDefaultCredibleCupidClient from '../client/Client';
import { Button, Box, Typography, Paper, Avatar, Chip, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { Heart, X, Star, MapPin, Verified, Briefcase, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png';

const colors = {
  green: {
    light: '#22c55e',
    dark: '#16a34a'
  },
  red: {
    light: '#ef4444'
  },
  gray: {
    light: '#f8f9fa',
    lighter: '#f3f4f6',
    border: '#D1D5DB',
    text: '#374151'
  },
  white: '#ffffff',
  black: {
    opacity10: 'rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    white: 'rgba(255, 255, 255, 0.9)'
  }
};

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

    // backgroundColor: colors.green.light,
    // color: colors.white,
    // padding: '16px 24px',
    // borderRadius: '12px',
    // border: 'none',
    // fontWeight: '600',
    // cursor: 'pointer',
    // transition: 'all 0.2s ease',
    // fontSize: '16px',
    // width: '100%',
    // marginTop: '12px',
    // boxShadow: `0 2px 8px ${colors.black.opacity10}`,
    
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

const Profile = ({
  credibilityScore = 90,
}) => {
  const [userData, setUserData] = useState(null);
  // const [userData, setUserData] = useState(null);// maybe want a temporary user data to store changes
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const [guid, setGuid] = useState('');
  const [userGuid, setUserGuid] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [tokenRefreshed, setTokenRefreshed] = useState(false); // Track if auth has been refreshed

   // For interests
   const [interests, setInterests] = useState([]); // List of interests
   const [currentInterest, setCurrentInterest] = useState(''); // Current input

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (jwtToken && !tokenRefreshed) {
      InitDefaultCredibleCupidClient(jwtToken);

      let apiInstance = new CredibleCupid.AuthApi();
      apiInstance.authRefresh((error, data, response) => {
        if (error) {
          console.error(response);
        } else {
          setUserGuid(data.user_guid);
          console.log('API called successfully. Returned data: ' + JSON.stringify(data, null, 2));
          sessionStorage.setItem("jwtToken", data.jwt);
          setTokenRefreshed(true); // Set to true so this only runs once
        }
      });
    } else if (!jwtToken) {
      console.error("JWT token not found. Redirecting to login.");
      navigate("/login");
    }


    // Dummy user data with additional fields
    const dummyData = {
      email: "example@email.com",
      first_name: "first_name",
      last_name: "last_name",
      guid: "4b148da7-562f-46f5-8fdf-d0d2fbf12272",
      bio: "Dummy bio",
      gender: "Male",
      pronouns: "He/Him",
      sexual_orientation: "Straight",
      // birthday_ms_since_epoch: 2147483647, // Example birthday in milliseconds since epoch (Jan 1, 1990)
      birthday_ms_since_epoch: 883612800000, // Example birthday in milliseconds since epoch (Jan 1, 1990)
      date_of_birth: "1990-05-18",
      height_mm: 1800, // Height in millimeters (example: 1800mm = 1.8 meters or 5'11")
      occupation: "Dummy occupation",
      education: "Dummy education",
      location: "Dummy location"
    };
    
    // Set dummy data to mimic API response
    if (!userData) setUserData(dummyData);
  }, [userData, navigate, tokenRefreshed]);

  // Calculate the age based on `birthday_ms_since_epoch`
  const calculateAge = (birthdayMs) => {
    const ageDifMs = Date.now() - birthdayMs;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleFetchProfile = (e) => {
    e.preventDefault();

    if (guid === userGuid) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }

    // InitDefaultCredibleCupidClient(null);
    const apiInstance = new CredibleCupid.UserApi();
    apiInstance.queryUser(guid, (error, data) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Successfully fetch profile")
        
        // Convert birthday_ms_since_epoch to date_of_birth (YYYY-MM-DD)
        const birthdayDate = new Date(data.birthday_ms_since_epoch);
        const formattedBirthday = birthdayDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

        // Add date_of_birth to the data object
        const updatedUserData = {
          ...data,
          date_of_birth: formattedBirthday,
        };

        // Update userData with the new data
          setUserData(updatedUserData);
      }
    });
  };

  const handleFetchOwnProfile = () => {
    setIsOwner(true);
    // setError(''); // Clear any previous errors

    const apiInstance = new CredibleCupid.UserApi();
    apiInstance.queryUser(userGuid, (error, data) => {
      if (error) {
        console.error(error);
        // setError("Failed to fetch profile.");
      } else {
        console.log("Successfully fetched profile");
        // Convert birthday_ms_since_epoch to date_of_birth (YYYY-MM-DD)
        const birthdayDate = new Date(data.birthday_ms_since_epoch);
        const formattedBirthday = birthdayDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

        // Add date_of_birth to the data object
        const updatedUserData = {
          ...data,
          date_of_birth: formattedBirthday,
        };

        // Update userData with the new data
        setUserData(updatedUserData);
      }
    });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log("handleUpdateProfile")
    
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      console.error("JWT token missing. Unable to update profile.");
      return;
    }
    
    // Set up API client instance and authenticate with JWT
    let defaultClient = CredibleCupid.ApiClient.instance;
    let bearer = defaultClient.authentications['bearer'];
    bearer.accessToken = jwtToken;
    
    let apiInstance = new CredibleCupid.UserApi();

    // Convert date_of_birth to milliseconds since epoch
    const birthdayMs = new Date(userData.date_of_birth).getTime();
    userData.birthday_ms_since_epoch = birthdayMs;
    
    // Build UserUpdateBioRequest object
    const userUpdateBioRequest = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      bio: userData.bio,
      gender: userData.gender,
      pronouns: userData.pronouns,
      sexual_orientation: userData.sexual_orientation,
      // birthday_ms_since_epoch: userData.birthday_ms_since_epoch,
      birthday_ms_since_epoch: birthdayMs,
      height_mm: userData.height_mm,
      occupation: userData.occupation,
  };
    console.log(JSON.stringify(userUpdateBioRequest)); // new CredibleCupidApi.UserUpdateBioRequest(); puts the data as an entry in a bio object
    // Make the update request
    apiInstance.updateBio(userUpdateBioRequest, (error, data, response) => {
      if (error) {
        console.error("Failed to update profile:", error);
      } else {
        console.log("Successfully updated bio");
        setUserData(data); // Update the state with new data
        setIsEditing(false); // Exit edit mode
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };



  const inputRef = useRef(null);
  const handleInterestKeyDown = (e) => {
    if (e.key === ' '|| e.key === 'Enter') {
      e.preventDefault();
      if (currentInterest.trim()) {
        setInterests([...interests, currentInterest.trim()]);
        setCurrentInterest(''); // Clear the input
      }
      console.log(interests)
    }else{
      console.log("KEY PRESSED")
    }
  };

  const handleInterestDelete = (interestToDelete) => {
    setInterests(interests.filter(interest => interest !== interestToDelete));
  };


  if (!userData) return <div>Loading...</div>;

  // const ProfileContainer = styled(Paper)({
  //   maxWidth: '600px',
  //   margin: '20px auto',
  //   padding: '20px',
  //   // borderRadius: '10px',
  // });

  const ProfileContainer = styled('div')({
    ...styles.container,
    // maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  });

  return (
    <div className="profile-page">
      <p>Profile</p>
      <br></br>
      {/* Fetching your own profile. This is just for testing. Eventually some other page could request for the profile by providing the guid*/}

      <button onClick={handleFetchOwnProfile}>{"My Profile"}</button>


      {isEditing && isOwner ? (

        // This is just a sample for updating profile. Change the text or dropdowns then click save changes
        <>
        <ProfileContainer>
          <button 
          style={styles.button}
          type="button" 
          onClick={() => setIsEditing(false)}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = colors.green.dark;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${colors.black.opacity10}`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = colors.green.light;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 2px 8px ${colors.black.opacity10}`;
          }}
          >Done Editing</button>

          
        <div style={styles.loginBox}>
          <form style={styles.form} onSubmit={handleUpdateProfile}>
            <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Email:
                  <input
                    style={{
                      ...styles.input,
                      ':focus': {
                        borderColor: colors.green.light,
                        backgroundColor: colors.white,
                      }
                    }}
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled
                  />
                </label>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                First Name:
                <input
                  style={{
                    ...styles.input,
                    ':focus': {
                      borderColor: colors.green.light,
                      backgroundColor: colors.white,
                    }
                  }}
                  type="text"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.green.light;
                    e.target.style.backgroundColor = colors.white;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.gray.border;
                    e.target.style.backgroundColor = colors.gray.lighter;
                  }}
                />
              </label>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Last Name:
                <input
                  style={{
                    ...styles.input,
                    ':focus': {
                      borderColor: colors.green.light,
                      backgroundColor: colors.white,
                    }
                  }}
                  type="text"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.green.light;
                    e.target.style.backgroundColor = colors.white;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.gray.border;
                    e.target.style.backgroundColor = colors.gray.lighter;
                  }}
                />
              </label>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Gender:
                <select
                  style={{
                    ...styles.input,
                    ':focus': {
                      borderColor: colors.green.light,
                      backgroundColor: colors.white,
                    }
                  }}
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </label>            
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Pronouns:
                <input
                  style={{
                    ...styles.input,
                    ':focus': {
                      borderColor: colors.green.light,
                      backgroundColor: colors.white,
                    }
                  }}
                  type="text"
                  name="pronouns"
                  value={userData.pronouns}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.green.light;
                    e.target.style.backgroundColor = colors.white;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.gray.border;
                    e.target.style.backgroundColor = colors.gray.lighter;
                  }}
                />
              </label>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Sexual Orientation:
                <select
                  style={{
                    ...styles.input,
                    ':focus': {
                      borderColor: colors.green.light,
                      backgroundColor: colors.white,
                    }
                  }}
                  name="sexual_orientation"
                  value={userData.sexual_orientation}
                  onChange={handleChange}
                >
                  <option value="Straight">Straight</option>
                  <option value="Gay">Gay</option>
                  <option value="Lesbian">Lesbian</option>
                  <option value="Bisexual">Bisexual</option>
                  <option value="Asexual">Asexual</option>
                  <option value="Other">Other</option>
                </select>
              </label>            
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>
                    Date of Birth:
                    <input
                        style={{
                            ...styles.input,
                            ':focus': {
                                borderColor: colors.green.light,
                                backgroundColor: colors.white,
                            }
                        }}
                        type="date"
                        name="date_of_birth"
                        value={userData.date_of_birth}
                        onChange={handleChange}
                        onFocus={(e) => {
                            e.target.style.borderColor = colors.green.light;
                            e.target.style.backgroundColor = colors.white;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = colors.gray.border;
                            e.target.style.backgroundColor = colors.gray.lighter;
                        }}
                    />
                </label>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Height (mm):
                <input
                  style={{
                    ...styles.input,
                    ':focus': {
                      borderColor: colors.green.light,
                      backgroundColor: colors.white,
                    }
                  }}
                  type="number"
                  name="height_mm"
                  value={userData.height_mm}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.green.light;
                    e.target.style.backgroundColor = colors.white;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.gray.border;
                    e.target.style.backgroundColor = colors.gray.lighter;
                  }}
                />
              </label>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Occupation:
                <input
                  style={{
                    ...styles.input,
                    ':focus': {
                      borderColor: colors.green.light,
                      backgroundColor: colors.white,
                    }
                  }}
                  type="text"
                  name="occupation"
                  value={userData.occupation}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.green.light;
                    e.target.style.backgroundColor = colors.white;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.gray.border;
                    e.target.style.backgroundColor = colors.gray.lighter;
                  }}
                />
              </label>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
              Bio:
              <textarea
                style={{
                  ...styles.input,
                  ':focus': {
                    borderColor: colors.green.light,
                    backgroundColor: colors.white,
                  }
                }}
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.green.light;
                  e.target.style.backgroundColor = colors.white;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.gray.border;
                  e.target.style.backgroundColor = colors.gray.lighter;
                }}
              />
            </label>
            </div>

            <button
            style={styles.button} 
            type="submit"
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = colors.green.dark;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.black.opacity10}`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.green.light;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.black.opacity10}`;
            }}
            >Save Changes</button>


          </form>
        </div>
        </ProfileContainer>
        <Box display="flex" flexDirection="column" alignItems="left" textAlign="left" >
          <Typography variant="h6">Interests</Typography>
          <Box display="flex" flexWrap="wrap" gap={1} my={2}>
            {interests.map((interest, index) => (
              <Chip
                key={index}
                label={interest}
                onDelete={() => handleInterestDelete(interest)}
              />
            ))}
          </Box>
            <TextField 
              // autoFocus="autoFocus"
              label="Type interest and press space"
              value={currentInterest}
              onChange={(e) => setCurrentInterest(e.target.value)}
              onKeyDown={handleInterestKeyDown}
            />
          </Box>
      </>
      ) : (
        <>
          <ProfileContainer>
              <Avatar
                alt="Profile Picture"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                sx={{
                  width: '100%',       // Change to max-width: 100%
                  maxWidth: 390,
                  height: 300,
                  marginBottom: 2,
                  marginTop: 2,
                  borderRadius: 2, // This makes the image rectangular
                }}
              />
              <div style={styles.verifiedBadge}>
                <Verified size={16} />
                <span>Verified</span>
              </div>
              {/* <div style={styles.infoSection}> */}
                <div style={styles.header}>
                  <h2 style={styles.nameAgeGender}>
                  {userData.first_name} {userData.last_name}{userData.birthday_ms_since_epoch ? `, ${calculateAge(userData.birthday_ms_since_epoch)}` : ''}{userData?.gender ? ` ${userData?.gender}` : ''} 
                    </h2>
                  <div style={styles.getScoreStyle(credibilityScore)}>
                    <Star size={16} />
                    <span>{credibilityScore}%</span>
                  </div>
                </div>
                  <p style={styles.subtitle}>{userData?.email || "Email"}</p>
                  <p style={styles.subtitle}>{userData?.gender}, {calculateAge(userData.birthday_ms_since_epoch)}, {userData?.pronouns || "Pronouns not specified"}</p>
                  {/* <p style={styles.subtitle}>Instagram: @example</p>                  */}
              {/* </div> */}
              <div style={styles.detailsContainer}>
                {userData?.occupation && (<div style={styles.detailRow}>
                  <Briefcase size={20} color={colors.darkGray} />
                  <span>{userData?.occupation}</span>
                </div>)}
                {userData?.education && (<div style={styles.detailRow}>
                  <GraduationCap size={20} color={colors.darkGray} />
                  <span>{userData?.education}</span>
                </div>)}
                {userData?.location && (<div style={styles.detailRow}>
                  <MapPin size={20} color={colors.darkGray} />
                  <span>{userData?.location}</span>
                </div>)}
              </div>
              {isOwner ? (

                  <button 
                  style={styles.button}
                  type="submit"
                  // disabled={isLoading}
                  onClick={() => setIsEditing(true)} 
                  onMouseOver={(e) => {
                    // if (!isLoading) {
                      e.currentTarget.style.backgroundColor = colors.green.dark;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${colors.black.opacity10}`;
                    // }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = colors.green.light;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 2px 8px ${colors.black.opacity10}`;
                  }}
                  >
                    Edit Profile
                  </button>
              ) : (
                <>
                </>
              )}

              <Box my={2} p={2} sx={{ backgroundColor: colors.gray.border, borderRadius: "8px", width: "100%", boxSizing: 'border-box' }}>
                <label style={styles.label}>Bio</label>
                <p style={styles.subtitle}>{userData?.bio || "No bio available"}</p>
              </Box>

              {interests.length > 0 && (
                <div style={styles.tagsContainer}>
                  {interests.map((interest, index) => (
                    <span key={index} style={styles.tag}>{interest}</span>
                  ))}
                </div>
              )}

              <Box my={2} p={2} sx={{ backgroundColor: colors.gray.border, borderRadius: "8px", width: "100%", boxSizing: 'border-box' }}>
                <label style={styles.label}>Details</label>
                <p style={styles.subtitle}>Gender: {userData?.gender}</p>
                <p style={styles.subtitle}>Sexual Orientation: {userData?.sexual_orientation}</p>
                <p style={styles.subtitle}>Height: {(userData.height_mm / 1000).toFixed(2)} meters</p>
                <p style={styles.subtitle}>Occupation: {userData?.occupation || "Occupation not specified"}</p>
              </Box>

              <Box my={2} p={2} sx={{ backgroundColor: colors.gray.border, borderRadius: "8px", width: "100%", boxSizing: 'border-box' }}>
                <label style={styles.label}>Referrals</label>
                <p style={styles.subtitle}>Person 1: I know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
                <p style={styles.subtitle}>Person 2: I know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
                <p style={styles.subtitle}>Person 3: I know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
              </Box>
          </ProfileContainer>
        </>
      )}
      <br></br>
      <br></br>
      <br></br>
      {/* Fetching profile. This is just for testing. Eventually some other page could request for the profile by providing the guid*/}
      <form onSubmit={handleFetchProfile}>
        <div>
          <label htmlFor="guid">GUID:</label>
          <input
            type="text"
            id="guid"
            value={guid}
            onChange={(e) => setGuid(e.target.value)}
            required
          />
        </div>
        <button type="submit">Fetch Profile</button>
      </form>
    </div>
  );
};
export default Profile;