import React, { useEffect, useState } from 'react';

import * as CredibleCupid from '../credible_cupid/src/index'
import InitDefaultCredibleCupidClient from '../client/Client';
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  // const [userData, setUserData] = useState(null);// maybe want a temporary user data to store changes
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const [guid, setGuid] = useState('');

  useEffect(() => {

    const jwtToken = sessionStorage.getItem("jwtToken");
    if (jwtToken) {
      InitDefaultCredibleCupidClient(jwtToken); // Initialize with stored JWT
    } else {
      console.error("JWT token not found. Redirecting to login.");
      navigate("/login"); // Or handle as needed (e.g., redirect to login)
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

  return (
    <div className="profile-page">
      <p>Profile</p>
      <br></br>

      {isEditing ? (
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
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          <br></br>
          <button>Like</button>
          <br></br>
          <button>View Your likes</button>
          {/* <br></br>
          <img src={'https://s.yimg.com/ny/api/res/1.2/3l2GwEUoPVFLpeIAsqx3Sw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM2MA--/https://media.zenfs.com/en/comingsoon_net_477/a82ffbfe13cb6804c0915ae278290b38'} alt="Profile" />
          <p>Username</p>
          <p>{userData.gender}, {calculateAge(userData.birthday_ms_since_epoch)}, {userData.pronouns || "Pronouns not specified"}</p>
          <p>Instagram: @dummy</p>
          <p>Email: {userData.email}</p>
          <p>{userData.sexual_orientation}</p>
          <p>{(userData.height_mm / 1000).toFixed(2)} meters</p>
          <p>{userData.occupation || "Occupation not specified"}</p>
          <p><strong>Bio:</strong> {userData.bio || "No bio available"}</p> */}
          <div style={{ maxWidth: "550px", margin: "20px auto", textAlign: "left" }}>
            {/* Profile Picture and Basic Info Section */}
            <div style={{
              display: "flex",
              flexDirection: "column", // Change to column layout
              justifyContent: "space-around",
              alignItems: "center",
              padding: "20px",
              borderBottom: "1px solid grey"
            }}>
              <img
                style={{ width: "200px", height: "200px", borderRadius: "8px"}}
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="Profile"
              />

            </div>
            <div style={{
              padding: "20px",
              border: "1px solid grey",
              backgroundColor: "#f1f1f1",
              borderRadius: "8px"
            }}>
                <h4>Name</h4>
                <p>Email: {userData.email}</p>
                <p>{userData.gender}, {calculateAge(userData.birthday_ms_since_epoch)}, {userData.pronouns || "Pronouns not specified"}</p>
                <p>Instagram: @dummy</p>
                <p>not AI</p>
              </div>
            {/* About Me Section */}
            <div style={{
              padding: "20px",
              border: "1px solid grey",
              backgroundColor: "#f1f1f1",
              borderRadius: "8px"
            }}>
              <h4>Bio</h4>
              <p>{userData.bio || "No bio available"}</p>
            </div>

            {/* Referrals Section */}
            <div style={{
              padding: "20px",
              border: "1px solid grey",
              backgroundColor: "#f1f1f1",
              borderRadius: "8px"
            }}>
              <h1>Referrals</h1>
              <p><strong>Person 1:</strong> i know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
              <p><strong>Person 2:</strong> i know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
              <p><strong>Person 3:</strong> i know this person from XXX, for YYY years. I would describe him as ZZZ.</p>
            </div>

            {/* Details Section */}
            <div style={{
              padding: "20px",
              border: "1px solid grey",
              backgroundColor: "#f1f1f1",
              borderRadius: "8px"
            }}>
              <p><strong>Gender:</strong> {userData.gender}</p>
              <p><strong>Sexual Orientation:</strong> {userData.sexual_orientation}</p>
              <p><strong>Height:</strong> {(userData.height_mm / 1000).toFixed(2)} meters</p>
              <p><strong>Occupation:</strong> {userData.occupation || "Occupation not specified"}</p>
            </div>
          </div>
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