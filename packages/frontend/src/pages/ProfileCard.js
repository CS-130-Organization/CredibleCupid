import React, { useState } from 'react';
import tempProfileImage from '../assets/images/temp-profile.png'
import sobbingProfileImage from '../assets/images/sobbing-at-computer.png'
import { ReactComponent as HeartIcon } from '../assets/images/heart.svg'

const ProfileCard = () => {
  const handleDislike = () => alert('You disliked Chelsea!');

  // State to track whether the heart is filled
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const handleLike = () => {
    alert("You liked Chelsea!")
    setIsHeartFilled(!isHeartFilled); // Toggle filled state
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src={sobbingProfileImage}
          alt="Profile"
          style={styles.image}
        />
        <div style={styles.info}>
          <h2 style={styles.name}>Chelsea, 26</h2>
          <p style={styles.details}>You both went to UCLA</p>
        </div>
        <div style={styles.actions}>
          <button onClick={handleDislike} style={{ ...styles.button, ...styles.dislike }}>✕</button>
          <button onClick={handleLike} style={styles.button}>
            <HeartIcon
              style={{ width: '40px', height: '40px', fill: isHeartFilled ? 'red' : 'none', stroke: 'red', strokeWidth: '2' }}
            /> </button>
        </div>
      </div>
    </div>
  );
};

// CSS in JS (styled-components or plain object styles)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  card: {
    width: '300px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
  info: {
    padding: '15px',
  },
  name: {
    margin: '0',
    fontSize: '22px',
  },
  details: {
    color: '#888',
    margin: '5px 0 15px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '15px',
    borderTop: '1px solid #f0f0f0',
  },
  button: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  replay: {
    color: '#f5b748',
  },
  dislike: {
    color: '#ec5e6f',
  },
  like: {
    color: '#62b9f7',
  },
  superlike: {
    color: '#5bc590',
  },
};

export default ProfileCard;
