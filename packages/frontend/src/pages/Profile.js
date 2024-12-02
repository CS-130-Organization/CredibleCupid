import React, {useEffect, useState } from 'react';
import { motion } from 'framer-motion'; 
import * as CredibleCupid from '../credible_cupid/src/index'
import InitDefaultCredibleCupidClient from '../client/Client';
import { ArrowLeft, Instagram, User, Star, MapPin, Verified, Briefcase, GraduationCap, Ruler } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { colors, spacing } from '../styles/theme';
import { 
  buttonStyles,
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

const Profile = ({
  credibilityScore = 90,
}) => {
  const [userData, setUserData] = useState(null);

  const [userEditData, setUserEditData] = useState(null);// maybe want a temporary user data to store changes
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const [guid, setGuid] = useState('');
  const [userGuid, setUserGuid] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  // const [photo, setPhoto] = useState(null);

  // Add this to your state declarations
  const [isUploading, setIsUploading] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [tokenRefreshed, setTokenRefreshed] = useState(false); // Track if auth has been refreshed

  // const [heightFeet, setHeightFeet] = useState(userData?.height_mm ? Math.floor(userData.height_mm / 25.4 / 12) : 0);
  // const [heightInches, setHeightInches] = useState(userData?.height_mm ? Math.round((userData.height_mm / 25.4) % 12) : 0);
  
  // For referrals
  const [referralData, setReferralData] = useState({ refemail: "", message: "" });// for sending referrals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [referrals, setReferrals] = useState([]);


  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtToken");

    const fetchReferrerData = async (referrerGuid) => {
      const apiInstance = new CredibleCupid.UserApi();
      return new Promise((resolve, reject) => {
        apiInstance.queryUser(referrerGuid, (error, data) => {
          if (error) {
            console.error("Error fetching referrer data:", error);
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    };

    const fetchReferralDetails = async (referralGuid) => {
      const apiInstance = new CredibleCupid.ReferralApi();
      return new Promise((resolve, reject) => {
        apiInstance.getReferral(referralGuid, async (error, data) => {
          if (error) {
            console.error("Error fetching referral data:", error);
            reject(error);
          } else {
            try {
              const referrerData = await fetchReferrerData(data.referrer_guid);
              resolve({ ...data, referrer: referrerData });
            } catch (fetchReferrerError) {
              reject(fetchReferrerError);
            }
          }
        });
      });
    };

    const fetchAllReferrals = async (referralGuids) => {
      const referralPromises = referralGuids.map((guid) => fetchReferralDetails(guid));
      try {
        const allReferrals = await Promise.all(referralPromises);
        setReferrals(allReferrals);
      } catch (error) {
        console.error("Error fetching all referrals:", error);
      }
    };

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
          setUserEditData(updatedUserData);

          if (data.referrals?.length > 0) {
            fetchAllReferrals(data.referrals); // Fetch referrals
          }

          apiInstance.profilePicUser(guid, (error, data, response) => {
            if (error) {
              console.error("Error fetching profile picture:", error);
            } else {
              // Assuming response contains the URL to the profile picture
              setProfilePicUrl(response.req.url); // Update the state with the new profile picture URL
              setPreviewImage(response.req.url);
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

  const handleTestUserProfile = (e) => {
    e.preventDefault();  // Prevents the form from refreshing the page
    navigate(`/userprofile/${guid}`);  // Navigates to the profile page with the GUID
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
    const birthdayMs = new Date(userEditData.date_of_birth).getTime();
    userEditData.birthday_ms_since_epoch = birthdayMs;

    // convert Height
    const totalInches = parseInt(userEditData.height_ft, 10) * 12 + parseInt(userEditData.height_in, 10);
    const mmHeight = totalInches * 25.4;
    

    
    // Build UserUpdateBioRequest object
    const userUpdateBioRequest = {
      email: userEditData.email,
      first_name: userEditData.first_name,
      last_name: userEditData.last_name,
      bio: userEditData.bio,
      gender: userEditData.gender,
      pronouns: userEditData.pronouns,
      sexual_orientation: userEditData.sexual_orientation,
      // birthday_ms_since_epoch: userEditData.birthday_ms_since_epoch,
      date_of_birth: userEditData.date_of_birth,
      birthday_ms_since_epoch: birthdayMs,
      height_mm: mmHeight,
      height_ft: userEditData.height_ft,
      height_in: userEditData.height_in,
      occupation: userEditData.occupation,
  };
    console.log(JSON.stringify(userUpdateBioRequest)); // new CredibleCupidApi.UserUpdateBioRequest(); puts the data as an entry in a bio object
    // Make the update request
    apiInstance.updateBio(userUpdateBioRequest, (error, data, response) => {
      if (error) {
        console.error("Failed to update profile:", error);
        setAlertMessage(`Failed to update profile. Please try again`);
        setShowAlert(true);
      } else {
        console.log("Successfully updated bio");
        setAlertMessage(`Successfully updated bio`);
        setShowAlert(true);
        setUserData(userUpdateBioRequest); // Update the state with new data
        setUserEditData(userUpdateBioRequest); // Update the state with new data
        setIsEditing(false); // Exit edit mode
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserEditData({ ...userEditData, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      
      // Set preview immediately 
      // setPhoto(file);
      setPreviewImage(URL.createObjectURL(file));

      const apiInstance = new CredibleCupid.UserApi();
      const opts = { file }; // File selected by the user
      try {
        apiInstance.uploadProfilePic(opts, (error, data, response) => {
          setIsUploading(false);

          if (error) {
            console.error("Error uploading profile picture:", error);
            setAlertMessage(`Failed to upload profile picture. Please try again.`);
            setShowAlert(true);
          } else {
            console.log("Profile picture uploaded successfully");
            setAlertMessage(`Profile picture uploaded successfully`);
            setShowAlert(true);
            // Optionally, update the UI with the new profile picture
            // Fetch the updated profile picture
            // const guid = 'YOUR_USER_GUID'; // Replace with the actual GUID for the user
            apiInstance.profilePicUser(userGuid, (error, data, response) => {
              if (error) {
                console.error("Error fetching profile picture:", error);
              } else {
                // Assuming response contains the URL to the profile picture
                if (data?.url) {
                  setPreviewImage(data.url);
                }
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


  
  const handleSendReferral = (e) => {
    e.preventDefault();
    console.log("handleSendReferral")
    
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      console.error("JWT token missing. Unable to update profile.");
      return;
    }
    
    // Set up API client instance and authenticate with JWT
    let defaultClient = CredibleCupid.ApiClient.instance;
    let bearer = defaultClient.authentications['bearer'];
    bearer.accessToken = jwtToken;
    
    let apiInstance = new CredibleCupid.ReferralApi();

    // Build SendReferralRequest object
    const sendReferralRequest = {
      email: referralData.refemail,
      message: referralData.message,
  };
    console.log(JSON.stringify(sendReferralRequest)); // new CredibleCupidApi.sendReferralRequest(); puts the data as an entry in a bio object
    // Make the sendReferral request
    apiInstance.sendReferral(sendReferralRequest, (error, data, response) => {
      if (error) {
        console.error("Failed to send referral:", response.body.message);

        // Extract error details
        // const statusCode = response.body.status || "Unknown status";
        const errorMessage = response.body.message || "An error occurred.";
        // const errorType = response.error.error || "Unknown error";
    
        // Display error details in alert
        setAlertMessage(`${errorMessage}`);
        setShowAlert(true);
      } else {
        console.log("Successfully sent referral");
        setAlertMessage(`Successfully sent referral`);
        setShowAlert(true);
        closeModal();
        // setUserData(userUpdateBioRequest); // Update the state with new data
        // setIsEditing(false); // Exit edit mode
      }
    });
  };

  // const handleReferralInputChange = useCallback((e) => {
  //   const { name, value } = e.target;
  //   setReferralData({ ...userData, [name]: value });
  // }, []);
  const handleReferralInputChange = (e) => {
    const { name, value } = e.target;
    setReferralData({ ...referralData, [name]: value });
  };

  
  const Alert = ({ message, onClose }) => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    }}>
        <div style={{
            backgroundColor: 'white',
            padding: spacing.xl,
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '70%'
        }}>
            <div style={{
                marginBottom: spacing.lg,
                fontSize: '16px',
                lineHeight: '1.5',
                color: colors.gray.text,
                whiteSpace: 'pre-line'
            }}>
                {message}
            </div>
            <button
                onClick={onClose}
                style={{
                    ...buttonStyles.base,
                    width: '100%',
                    marginTop: spacing.md
                }}
            >
                OK
            </button>
        </div>
    </div>
);


const ImageUpload = () => (
  <div style={inputStyles.container}>
      <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Profile Picture</label>
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.md,
          padding: spacing.lg,
          border: `2px dashed ${colors.gray.border}`,
          borderRadius: '8px',
          backgroundColor: colors.gray.lighter,
          cursor: 'pointer'
      }}>
          {previewImage ? (
              <div style={{
                  width: '300px',
                  height: '300px',
                  borderRadius: '10%',
                  overflow: 'hidden',
                  marginBottom: spacing.md,
                  position: 'relative',
                  opacity: 0.9,
              }}>
                  <img
                      src={previewImage}
                      alt="Profile preview"
                      style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: isUploading ? 0.5 : 1
                      }}
                  />
                  {isUploading && (
                      <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                      }}>
                          Loading...
                      </div>
                  )}
              </div>
          ) : (
              <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: colors.gray.lighter,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.md
              }}>
                  <span style={{ fontSize: '40px', color: colors.gray.text }}>+</span>
              </div>
          )}
          <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="profile-image-upload"
              disabled={isUploading}
          />
          <label
              htmlFor="profile-image-upload"
              style={{
                  ...buttonStyles.base,
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  textAlign: 'center',
                  height: '30px',
                  opacity: isUploading ? 0.7 : 1
              }}
          >
              {isUploading ? 'Uploading...' : (previewImage ? 'Change Photo' : 'Upload Photo')}
          </label>
      </div>
  </div>
);


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData({ ...userData, [name]: value });
  // };

  if (!userData) return <div>Loading...</div>;


  return (
    <div className="profile-page">
      {/* <p>Profile</p> */}

      {isEditing && isOwner ? (

        // This is just a sample for updating profile. Change the text or dropdowns then click save changes
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
            <motion.div 
            style={{
              width: '100%',
              padding: '0 spacing.xl',
              maxWidth: '350px', // Constrain width of form
              marginTop: spacing.xl
            }}initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}>
              <form style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }} onSubmit={handleUpdateProfile}>
                {/* back button */}
                {/* <button 
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
                >Done Editing</button> */}
                 {/* Back Button */}
                  <button
                    style={{
                      backgroundColor: 'transparent',
                      // backgroundColor: colors.gray.lighter,
                      border: 'none',
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      cursor: 'pointer',
                      fontSize: '24px',
                      color: colors.gray.dark,
                      // boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.2)', // Optional: shadow to make it appear elevated
                      borderRadius: '64px',
                      zIndex: 1, // Ensures it appears above the image
                    }}
                    onClick={() => setIsEditing(false)}
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div style={{
                      // width: '100%',
                      // height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',

                  }}>
                  Edit Profile
                  </div>
                {/* Upload Image */}
                {/* <motion.div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '3px' // Push down from top
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                >
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
            </motion.div>
                <motion.div style={styles.inputGroup}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}>
                  <label style={styles.label}>
                    Upload Profile Picture:
                    <input
                      style={styles.input}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </motion.div> */}
                <motion.div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '3px' // Push down from top
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                <ImageUpload />

                </motion.div>

                {/* The rest */}
                  <motion.div style={styles.inputGroup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                          value={userEditData.email}
                          onChange={handleChange}
                          disabled
                        />
                      </label>
                  </motion.div>
                  <motion.div style={styles.inputGroup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                        value={userEditData.first_name}
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
                  </motion.div>
                  <motion.div style={styles.inputGroup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                        value={userEditData.last_name}
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
                  </motion.div>
                  <motion.div style={styles.inputGroup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                        value={userEditData.gender}
                        onChange={handleChange}
                        
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>            
                  </motion.div>
                  <motion.div style={styles.inputGroup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                        value={userEditData.pronouns}
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
                  </motion.div>
                  <motion.div style={styles.inputGroup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                        value={userEditData.sexual_orientation}
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
                  </motion.div>
                  <motion.div style={styles.inputGroup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                              value={userEditData.date_of_birth}
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
                  </motion.div>
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
                  <motion.div style={{
                      display: 'flex',
                      // flexDirection: 'row',
                      gap: '8px',
                      width: '50%',
                      alignItems: 'flex-start', 
                    }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                          value={userEditData.height_ft}
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
                        value={userEditData.height_in}
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
                        
                        
                </motion.div>

                <motion.div style={styles.inputGroup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                        value={userEditData.occupation}
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
                  </motion.div>

                  <motion.div style={styles.inputGroup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}>
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
                      value={userEditData.bio}
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
                  </motion.div>

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
            </motion.div>
          
        </motion.div>
      
      </>
      ) : (
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
              {/* {
                <motion.div style={{
                  position: 'absolute',
                  top: '10px', // Adjusts distance from top of image
                  right: '10px', // Adjusts distance from left of image
                  backgroundColor: colors.primary, // Set background color to make it stand out
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
              } */}

            </motion.div>

            {/* Content Container */}
            <motion.div style={{
              // width: '100%',
              // padding: '0 spacing.xl',
              // maxWidth: '350px', // Constrain width of form
              // marginTop: spacing.xl
              marginTop: '-30px', // Negative margin to overlap the bottom of the image
              backgroundColor: colors.white,
              width: '93%',
              padding: '16px',
              boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.2)', // Optional: shadow to make it appear elevated
              borderRadius: '40px',
              position: 'relative',
              zIndex: 1, // Ensures it appears above the image
            }}>
              <div style={{
                width: '90%',
                // padding: '0 spacing.xl',
                padding: '20px',
                maxWidth: '300px', // Constrain width of form
                // marginTop: spacing.xl
                // marginTop: '20px', 
                marginTop: '5px', 
                marginBottom: '10px', 
                marginLeft: '10px', 
                marginRight: '10px',  
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
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
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
                <motion.button 
                    style={styles.button}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
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
                    </motion.button >

                     {/* Referral Section */}
                    {userData?.gender !== "Male" && <motion.button
                      style={styles.button}
                      initial={{ opacity: 0}}
                      animate={{ opacity: 1}}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      onClick={openModal}
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
                     + Refer a Guy
                    </motion.button>}

                    {isModalOpen && 
                    <>
                      {/* Overlay */}
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.1)", // Darken background
                          backdropFilter: "blur(1px)", // Optional: Add blur effect
                          zIndex: 1000, // Ensure it's above everything else
                        }}
                        onClick={closeModal} // Close modal when clicking outside
                      />
                     <motion.div style={{
                      position: "fixed",
                      top: "50%",
                      left: "4%",
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                      zIndex: 1001,
                      width: "90%",
                      maxWidth: "320px",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: -250 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}>
                         <h1 style={{fontSize: '30px',
                                fontWeight: '600',
                                color: colors.gray.text,
                                margin: `0 0 ${spacing.xs} 0`
                              }}>Send a Referral</h1>
                              <form style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px',
                                  }} onSubmit={handleSendReferral}>
                                <div style={styles.inputGroup}>
                                  <label style={styles.label}>Email:</label>
                                  <input
                                    type="refemail"
                                    name="refemail"
                                    style={{
                                      ...styles.input,
                                      ':focus': {
                                        borderColor: colors.green.light,
                                        backgroundColor: colors.white,
                                      }
                                    }}
                                    // placeholder='The email of the user you wish to refer.'
                                    value={referralData.refemail}
                                    onChange={handleReferralInputChange}
                                    onFocus={(e) => {
                                      e.target.style.borderColor = colors.green.light;
                                      e.target.style.backgroundColor = colors.white;
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.borderColor = colors.gray.border;
                                      e.target.style.backgroundColor = colors.gray.lighter;
                                    }}
                                    required
                                  />
                                </div>
                                <div style={styles.inputGroup}>
                                  <label style={styles.label}>Message:</label>
                                  <textarea
                                    type="message"
                                    style={{
                                      ...styles.input,
                                      ':focus': {
                                        borderColor: colors.green.light,
                                        backgroundColor: colors.white,
                                      }
                                    }}
                                    name="message"
                                    value={referralData.message}
                                    // placeholder='The message of the referral to give readers more information.'
                                    onChange={handleReferralInputChange}
                                    onFocus={(e) => {
                                      e.target.style.borderColor = colors.green.light;
                                      e.target.style.backgroundColor = colors.white;
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.borderColor = colors.gray.border;
                                      e.target.style.backgroundColor = colors.gray.lighter;
                                    }}
                                    required
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: spacing.md, marginTop: spacing.md }}>
                                  <button
                                    type="submit"
                                    style={{
                                      ...buttonStyles.base,
                                      flex: 1
                                  }}
                                    
                                  >
                                    Send Referral
                                  </button>
                                  <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                      ...buttonStyles.base,
                                      flex: 1,
                                      backgroundColor: colors.gray.lighter,
                                      color: colors.gray.text
                                  }}
                                  >
                                    Cancel
                                  </button>              
                                </div>
                              </form>
                    </motion.div>
                    </>
                    }

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
                  {/* <motion.div  style={inputStyles.container}
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
                  </motion.div> */}
                  {/* Referrals */}
                  {userData.gender === "Male" && 
                  <motion.div
                    style={inputStyles.container}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                  <label style={inputStyles.label}>Referrals</label>
                  {referrals.length > 0 ? (
                    referrals.map((referral, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <Link
                          to={`/userprofile/${referral.referrer.guid}`}
                          style={{
                            ...styles.subtitle,
                            marginRight: "8px", // Add spacing between link and message
                          }}
                        >
                          {referral.referrer.first_name}
                        </Link>
                        <p style={{ ...styles.subtitle, margin: 0 }}>- {referral.message}</p>
                      </div>
                    ))
                  ) : (
                    <p>No referrals available.</p>
                  )}
                  </motion.div>}

                  {/* <motion.div style={inputStyles.container}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.5 }}>
                    <form onSubmit={handleTestUserProfile}>
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
                  </motion.div> */}

                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          {showAlert && (
            <Alert
                message={alertMessage}
                onClose={() => setShowAlert(false)}
            />
          )}
        </>
      )}
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};
export default Profile;