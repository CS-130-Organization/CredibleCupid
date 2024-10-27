import React, { useEffect, useState } from 'react';

import * as CredibleCupid from '../credible_cupid/src/index'
import InitDefaultCredibleCupidClient from '../client/Client';
import { Button, Box, Typography, Paper, Avatar } from '@mui/material';
import styled from '@emotion/styled';
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  // const [userData, setUserData] = useState(null);// maybe want a temporary user data to store changes
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const [guid, setGuid] = useState('');
  const [userGuid, setUserGuid] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [tokenRefreshed, setTokenRefreshed] = useState(false); // Track if auth has been refreshed

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
      guid: "4b148da7-562f-46f5-8fdf-d0d2fbf12272",
      bio: "Dummy bio",
      gender: "Male",
      pronouns: "He/Him",
      sexual_orientation: "Straight",
      birthday_ms_since_epoch: 2147483647, // Example birthday in milliseconds since epoch (Jan 1, 1990)
      height_mm: 1800, // Height in millimeters (example: 1800mm = 1.8 meters or 5'11")
      occupation: "Dummy occupation"
    };
    
    // Set dummy data to mimic API response
    if (!userData) setUserData(dummyData);
  }, [userData, navigate]);

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
        setUserData(data);
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
    
    // Build UserUpdateBioRequest object
    const userUpdateBioRequest = {
      bio: userData.bio,
      gender: userData.gender,
      pronouns: userData.pronouns,
      sexual_orientation: userData.sexual_orientation,
      birthday_ms_since_epoch: userData.birthday_ms_since_epoch,
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

  if (!userData) return <div>Loading...</div>;

  const ProfileContainer = styled(Paper)({
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    // borderRadius: '10px',
  });

  return (
    <div className="profile-page">
      <p>Profile</p>
      <br></br>

      {isEditing && isOwner ? (
        // This is just a sample for updating profile. Change the text or dropdowns then click save changes
        <form onSubmit={handleUpdateProfile}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled
            />
          </label>
          <br></br>
          <label>
            Gender:
            <select
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
          <br></br>
          <label>
            Pronouns:
            <input
              type="text"
              name="pronouns"
              value={userData.pronouns}
              onChange={handleChange}
            />
          </label>
          <br></br>
          <label>
            Sexual Orientation:
            <select
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
          <br></br>
          <label>
            Height (mm):
            <input
              type="number"
              name="height_mm"
              value={userData.height_mm}
              onChange={handleChange}
            />
          </label>
          <br></br>
          <label>
            Occupation:
            <input
              type="text"
              name="occupation"
              value={userData.occupation}
              onChange={handleChange}
            />
          </label>
          <br></br>
          <label>
            Bio:
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleChange}
            />
          </label>
          <br></br>
          <button type="submit">Save Changes</button>
          <br></br>
          <button type="button" onClick={() => setIsEditing(false)}>Done Editing</button>
        </form>
      ) : (
        <>
      <ProfileContainer elevation={3}>
            <Box display="flex" flexDirection="column" alignItems="left" textAlign="left">
              <Avatar
                alt="Profile Picture"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                sx={{
                  width: 150,
                  height: 150,
                  marginBottom: 2,
                  borderRadius: 0, // This makes the image rectangular
                }}
              />
              <Typography variant="h5">{"User"}</Typography>
              <Typography variant="subtitle1">{userData?.email || "Email"}</Typography>
              <Typography variant="subtitle1">{userData?.gender}, {calculateAge(userData.birthday_ms_since_epoch)}, {userData?.pronouns || "Pronouns not specified"}</Typography>
              <Typography variant="subtitle1">Instagram: @example</Typography>
              {isOwner ? (
                <Box my={2}>
                  <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} sx={{ marginRight: 1 }}>
                    Edit Profile
                  </Button>
                  <Button variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>
                    View Likes
                  </Button>
                </Box>
              ) : (
                <>
                  <Button variant="outlined" color="secondary">Like</Button>

                </>
              )}
            </Box>

            <Box my={2} p={2} sx={{ backgroundColor: "#f1f1f1", borderRadius: "8px" }}>
              <Typography variant="h6">Bio</Typography>
              <Typography>{userData?.bio || "No bio available"}</Typography>
            </Box>

            <Box my={2} p={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
              <Typography variant="h6">Details</Typography>
              <Typography><strong>Gender:</strong> {userData?.gender}</Typography>
              <Typography><strong>Sexual Orientation:</strong> {userData?.sexual_orientation}</Typography>
              <Typography><strong>Height:</strong> {(userData.height_mm / 1000).toFixed(2)} meters</Typography>
              <Typography><strong>Occupation:</strong> {userData?.occupation || "Occupation not specified"}</Typography>
            </Box>

            <Box my={2} p={2} sx={{ backgroundColor: "#e8f4fc", borderRadius: "8px" }}>
              <Typography variant="h6">Referrals</Typography>
              <Typography><strong>Person 1:</strong> i know this person from XXX, for YYY years. I would describe him as ZZZ.</Typography>
              <Typography><strong>Person 2:</strong> i know this person from XXX, for YYY years. I would describe him as ZZZ.</Typography>
              <Typography><strong>Person 3:</strong> i know this person from XXX, for YYY years. I would describe him as ZZZ.</Typography>
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