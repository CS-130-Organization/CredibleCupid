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
  }, []);

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
        setUserData(data);
      }
    });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // InitDefaultCredibleCupidClient(null);
    const apiInstance = new CredibleCupid.UserApi();

    const updateRequest = new CredibleCupid.UserUpdateBioRequest({
      bio: userData.bio,
      gender: userData.gender,
      pronouns: userData.pronouns,
      sexualOrientation: userData.sexual_orientation,
      birthdayMsSinceEpoch: userData.birthday_ms_since_epoch,
      heightMm: userData.height_mm,
      occupation: userData.occupation,
    });

    apiInstance.updateBio(updateRequest, (error, data) => {
      if (error) {
        console.error("Failed to update profile:", error);
      } else {
        setUserData(data); // Update local data on success
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
      <h1>Profile</h1>

      {isEditing ? (
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
          <label>
            Pronouns:
            <input
              type="text"
              name="pronouns"
              value={userData.pronouns}
              onChange={handleChange}
            />
          </label>
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
          <label>
            Height (mm):
            <input
              type="number"
              name="height_mm"
              value={userData.height_mm}
              onChange={handleChange}
            />
          </label>
          <label>
            Occupation:
            <input
              type="text"
              name="occupation"
              value={userData.occupation}
              onChange={handleChange}
            />
          </label>
          <label>
            Bio:
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Done Editing</button>
        </form>
      ) : (
        <>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          <p>Username</p>
          <p>{userData.gender}, {calculateAge(userData.birthday_ms_since_epoch)}, {userData.pronouns || "Pronouns not specified"}</p>
          <p>Instagram: @dummy</p>
          <p>Email: {userData.email}</p>
          <p>{userData.sexual_orientation}</p>
          <p>{(userData.height_mm / 1000).toFixed(2)} meters</p>
          <p>{userData.occupation || "Occupation not specified"}</p>
          <p><strong>Bio:</strong> {userData.bio || "No bio available"}</p>
        </>
      )}

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