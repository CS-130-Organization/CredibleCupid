import React, { useEffect, useState, useRef } from 'react';

import * as CredibleCupid from '../credible_cupid/src/index'
import InitDefaultCredibleCupidClient from '../client/Client';
// import { Button, Box, Typography, Paper, Avatar, Chip, TextField } from '@mui/material';
// import styled from '@emotion/styled';
import { Instagram, User, Star, MapPin, Verified, Briefcase, GraduationCap, Ruler } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
// import logo from '../assets/images/logo.png';
import { colors, spacing } from '../styles/theme';
import { 
  inputStyles,
  badgeStyles, 
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

const Profile = ({
  credibilityScore = 90,
}) => {
  const [userData, setUserData] = useState(null);
  // const [userData, setUserData] = useState(null);// maybe want a temporary user data to store changes
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const [guid, setGuid] = useState('');
  const [userGuid, setUserGuid] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // user uploads when pressing save or on every change?

  const [isOwner, setIsOwner] = useState(false);
  const [tokenRefreshed, setTokenRefreshed] = useState(false); // Track if auth has been refreshed

  // const [heightFeet, setHeightFeet] = useState(userData?.height_mm ? Math.floor(userData.height_mm / 25.4 / 12) : 0);
  // const [heightInches, setHeightInches] = useState(userData?.height_mm ? Math.round((userData.height_mm / 25.4) % 12) : 0);
  

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtToken");

    const fetchProfile = (guid) => {
      setIsOwner(true);

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
          setUserGuid(data.user_guid);
          console.log('API called successfully. Returned data: ' + JSON.stringify(data, null, 2));
          sessionStorage.setItem("jwtToken", data.jwt);
          setTokenRefreshed(true); // Set to true so this only runs once
          fetchProfile(data.user_guid); // Call fetchProfile directly
        }
      });
    } else if (!jwtToken) {
      console.error("JWT token not found. Redirecting to login.");
      navigate("/login");
    }


    // Dummy user data with additional fields
    // const dummyData = {
    //   email: "example@email.com",
    //   first_name: "first_name",
    //   last_name: "last_name",
    //   guid: "4b148da7-562f-46f5-8fdf-d0d2fbf12272",
    //   bio: "Dummy bio",
    //   gender: "Male",
    //   pronouns: "He/Him",
    //   sexual_orientation: "Straight",
    //   // birthday_ms_since_epoch: 2147483647, // Example birthday in milliseconds since epoch (Jan 1, 1990)
    //   birthday_ms_since_epoch: 883612800000, // Example birthday in milliseconds since epoch (Jan 1, 1990)
    //   date_of_birth: "1990-05-18",
    //   height_mm: 1800, // Height in millimeters (example: 1800mm = 1.8 meters or 5'11")
    //   occupation: "Dummy occupation",
    //   education: "Dummy education",
    //   location: "Dummy location",
    //   verified: true,
    //   // verified: True,
    // };
    
    // Set dummy data to mimic API response
    // if (!userData) setUserData(dummyData);
  }, [tokenRefreshed, navigate]);

  // Calculate the age based on `birthday_ms_since_epoch`
  const calculateAge = (birthdayMs) => {
    if (!birthdayMs || isNaN(birthdayMs)) {
      return "Age not provided"; // or return a fallback value if preferred
    }
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

        const heightFeet = data.height_mm ? Math.floor(data.height_mm / 25.4 / 12) : 0;
        const heightInches = data.height_mm ? Math.round((data.height_mm / 25.4) % 12) : 0;
          

        // Add date_of_birth to the data object
        const updatedUserData = { 
          ...data, date_of_birth: formattedBirthday, 
          height_ft: heightFeet, 
          height_in: heightInches };


        // Update userData with the new data
          setUserData(updatedUserData);
      }
    });
  };

  // const handleFetchOwnProfile = () => {
  //   setIsOwner(true);
  //   // setError(''); // Clear any previous errors

  //   const apiInstance = new CredibleCupid.UserApi();
  //   apiInstance.queryUser(userGuid, (error, data) => {
  //     if (error) {
  //       console.error(error);
  //       // setError("Failed to fetch profile.");
  //     } else {
  //       console.log("Successfully fetched profile");
  //       // Convert birthday_ms_since_epoch to date_of_birth (YYYY-MM-DD)
  //       const birthdayDate = new Date(data.birthday_ms_since_epoch);
  //       // const formattedBirthday = birthdayDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
  //       const formattedBirthday = (birthdayDate instanceof Date && !isNaN(birthdayDate))
  //       ? birthdayDate.toISOString().split('T')[0]
  //       : ""; // Set to empty or null if invalid

  //       // Add date_of_birth to the data object
  //       const updatedUserData = {
  //         ...data,
  //         date_of_birth: formattedBirthday,
  //       };

  //       // Update userData with the new data
  //       setUserData(updatedUserData);
  //     }
  //   });
  // };



  // const handleHeightChange = () => {
  //   const totalInches = parseInt(heightFeet, 10) * 12 + parseInt(heightInches, 10);
  //   const mmHeight = totalInches * 25.4;
    
  //   // Check if userData exists before updating height
  //   if (userData) {
  //     setUserData((prevData) => ({ ...prevData, height_mm: mmHeight }));
  //   }
  // };

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

    // convert Height
    const totalInches = parseInt(userData.height_ft, 10) * 12 + parseInt(userData.height_in, 10);
    const mmHeight = totalInches * 25.4;
    
    // Check if userData exists before updating height
    // if (userData) {
    //   setUserData((prevData) => ({ ...prevData, height_mm: mmHeight }));
    // }
    
    // Build UserUpdateBioRequest object
    const userUpdateBioRequest = {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      bio: userData.bio,
      gender: userData.gender,
      pronouns: userData.pronouns,
      sexual_orientation: userData.sexual_orientation,
      // birthday_ms_since_epoch: userData.birthday_ms_since_epoch,
      date_of_birth: userData.date_of_birth,
      birthday_ms_since_epoch: birthdayMs,
      height_mm: mmHeight,
      height_ft: userData.height_ft,
      height_in: userData.height_in,
      occupation: userData.occupation,
  };
    console.log(JSON.stringify(userUpdateBioRequest)); // new CredibleCupidApi.UserUpdateBioRequest(); puts the data as an entry in a bio object
    // Make the update request
    apiInstance.updateBio(userUpdateBioRequest, (error, data, response) => {
      if (error) {
        console.error("Failed to update profile:", error);
      } else {
        console.log("Successfully updated bio");
        setUserData(userUpdateBioRequest); // Update the state with new data
        setIsEditing(false); // Exit edit mode
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const apiInstance = new CredibleCupid.UserApi();
      const opts = { file }; // File selected by the user
      try {
        apiInstance.uploadProfilePic(opts, (error, data, response) => {
          if (error) {
            console.error("Error uploading profile picture:", error);
          } else {
            console.log("Profile picture uploaded successfully");
            // Optionally, update the UI with the new profile picture
            // Fetch the updated profile picture
            // const guid = 'YOUR_USER_GUID'; // Replace with the actual GUID for the user
            apiInstance.profilePicUser(userGuid, (error, data, response) => {
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
        
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };
  // const handleFetchProfilePic = () => {


  //   let apiInstance = new CredibleCupidApi.UserApi();
  //   // let guid = null; // Object | User GUID
  //   apiInstance.profilePicUser(guid, (error, data, response) => {
  //     if (error) {
  //       console.error(error);
  //     } else {
  //       console.log('API called successfully.');
  //     }
  //   });
  // };

  if (!userData) return <div>Loading...</div>;


  return (
    <div className="profile-page">
      {/* <p>Profile</p> */}
      {/* <button onClick={handleFetchOwnProfile}>{"My Profile"}</button> */}


      {isEditing && isOwner ? (

        // This is just a sample for updating profile. Change the text or dropdowns then click save changes
        <>
        {/* <ProfileContainer> */}
          

          
        <div style={{
            width: '390px',
            // height: '844px',
            backgroundColor: colors.white,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div 
            style={{
              width: '100%',
              padding: '0 spacing.xl',
              maxWidth: '350px', // Constrain width of form
              marginTop: spacing.xl
            }}>
              <form style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }} onSubmit={handleUpdateProfile}>
                {/* back button */}
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

                {/* Upload Image */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '60px' // Push down from top
                }}>
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt={`${userData.first_name}'s profile`}
                    // style={imageStyles.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      opacity: 0.9,
                      borderRadius: 10
                    }}
                    />
                ) : (
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt={`${userData.first_name}'s profile`}
                    // style={imageStyles.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      opacity: 0.9,
                      borderRadius: 10
                    }}
                    />
                )}
            </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Upload Profile Picture:
                    <input
                      style={styles.input}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* The rest */}
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
                  {/* <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    width: '100%',
                    alignItems: 'flex-start', 
                  }}>
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
                  </div> */}
                  <div style={{
                      display: 'flex',
                      // flexDirection: 'row',
                      gap: '8px',
                      width: '50%',
                      alignItems: 'flex-start', 
                    }}>
                    {/* Height */}
                      <label style={styles.label}>
                        Height:
                      
                    {/* Feet input */}
                    <div  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          style={{
                            ...styles.input,
                            width: '100px', // Adjust width to make it more compact if needed
                            ':focus': {
                              borderColor: colors.green.light,
                              backgroundColor: colors.white,
                            }
                          }}
                          type="number"
                          name="height_ft"
                          value={userData.height_ft}
                          // onChange={(e) => setHeightFeet(e.target.value)}
                          onChange={handleChange}
                          // onBlur={handleHeightChange}
                          placeholder="Feet"
                          onFocus={(e) => {
                            e.target.style.borderColor = colors.green.light;
                            e.target.style.backgroundColor = colors.white;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = colors.gray.border;
                            e.target.style.backgroundColor = colors.gray.lighter;
                          }}
                        />
                        <span>ft</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                        style={{
                          ...styles.input,
                          width: '100px', // Adjust width as needed
                          ':focus': {
                            borderColor: colors.green.light,
                            backgroundColor: colors.white,
                          }
                        }}
                        type="number"
                        name="height_in"
                        value={userData.height_in}
                        // onChange={(e) => setHeightInches(e.target.value)}
                        onChange={handleChange}
                        // onBlur={handleHeightChange}
                        placeholder="Inches"
                        onFocus={(e) => {
                          e.target.style.borderColor = colors.green.light;
                          e.target.style.backgroundColor = colors.white;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.gray.border;
                          e.target.style.backgroundColor = colors.gray.lighter;
                        }}
                      />
                      <span>in</span>
                    </div>
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
          
        </div>
        {/* </ProfileContainer> */}
        {/* <Box display="flex" flexDirection="column" alignItems="left" textAlign="left" >
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
          </Box> */}
      </>
      ) : (
        <>
          <div style={{
            width: '390px',
            // height: '844px',
            backgroundColor: colors.white,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Profile Image Section */}

            <div style={{
              width: '300px', // Smaller logo
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '60px' // Push down from top
            }}>
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt={`${userData.first_name}'s profile`}
                  // style={imageStyles.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: 0.9,
                    borderRadius: 10
                  }}
                  />
              ) : (
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt={`${userData.first_name}'s profile`}
                  // style={imageStyles.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: 0.9,
                    borderRadius: 10
                  }}
                  />
              )}
              {
                <div style={badgeStyles.verified}>
                  <Verified size={16} />
                  <span>Verified</span>
                </div>
              }

            </div>

            {/* Content Container */}
            <div style={{
              width: '100%',
              padding: '0 spacing.xl',
              maxWidth: '350px', // Constrain width of form
              marginTop: spacing.xl
            }}>
              {/* Header Section */}
              <div style={{
                textAlign: 'left',
                marginBottom: spacing.xl
              }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing.md
                  }}>
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


                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: spacing.xs,
                      padding: `${spacing.xs} ${spacing.md}`,
                      borderRadius: spacing.md,
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: credibilityScore >= 75 ? '#dcfce7' : credibilityScore >= 25 ? colors.orange.light : '#fee2e2',
                      color: credibilityScore >= 75 ? colors.green.dark : credibilityScore >= 25 ? colors.orange.dark : colors.red.dark
                    }}>
                      <Star size={16} />
                      <span>{credibilityScore}%</span>
                    </div>                  
                </div>
                
              </div>
              {isOwner && (
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
              )}

              {/* Info Section */}
              <div 
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.lg
                }}
                // onSubmit={handleSubmit}
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
                <div style={inputStyles.container}>
                  <label style={inputStyles.label}>
                  Referrals
                  </label>
                  <div>
                    <p style={styles.subtitle}>Person 1: I know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
                    <p style={styles.subtitle}>Person 2: I know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
                    <p style={styles.subtitle}>Person 3: I know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
                  </div>
                </div>
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
            </div>
          </div>
        </>
      )}
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};
export default Profile;