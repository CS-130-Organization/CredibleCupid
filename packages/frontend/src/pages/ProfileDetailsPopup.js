// src/components/ProfileCard/ProfileCard.js
import React, { useState, useEffect } from 'react';
import { Heart, X, Star, MapPin, Verified, Briefcase, GraduationCap } from 'lucide-react';
import { colors, spacing } from '../styles/theme';
import {
  cardStyles,
  imageStyles,
  badgeStyles,
  contentStyles,
  tagStyles,
  textStyles,
  detailStyles,
  scoreStyles
} from '../styles/commonStyles';

const ProfileDetailsPopup = ({
  name = 'Anonymous',
  age = '',
  gender = '',
  credibilityScore = 0,
  bio = 'No bio available',
  occupation = 'Not specified',
  education = 'Not specified',
  location = 'Location unknown',
  interests = [],
  verified = false,
  imageUrl = null,
  onClose = () => {},
}) => {
  const [imageError, setImageError] = useState(false);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    content: {
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '100%',
      position: 'relative',
    },
    closeButton: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: colors.gray.dark,
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 1100, 
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.content}>
        <div style={cardStyles.container}>
          <div style={cardStyles.content}>
            <div style={imageStyles.section}>
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt={`${name}'s profile`}
                  style={imageStyles.image}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={imageStyles.placeholder}>
                  No image available
                </div>
              )}
              {verified && (
                <div style={badgeStyles.verified}>
                  <Verified size={16} />
                  <span>Verified</span>
                </div>
              )}
            </div>

            <div style={contentStyles.section}>
              <div style={contentStyles.header}>
                <h2 style={contentStyles.title}>
                  {name}{age ? `, ${age}` : ''}{gender ? ` ${gender}` : ''}
                </h2>
                <div style={scoreStyles.tag(credibilityScore)}>
                  <Star size={16} />
                  <span>{credibilityScore}%</span>
                </div>
              </div>

              <p style={textStyles.bio}>{bio}</p>

              <div>
                <div style={detailStyles.row}>
                  <Briefcase size={20} color={colors.gray.dark} />
                  <span>{occupation}</span>
                </div>
                <div style={detailStyles.row}>
                  <GraduationCap size={20} color={colors.gray.dark} />
                  <span>{education}</span>
                </div>
                <div style={detailStyles.row}>
                  <MapPin size={20} color={colors.gray.dark} />
                  <span>{location}</span>
                </div>
              </div>

              {interests.length > 0 && (
                <div style={tagStyles.container}>
                  {interests.map((interest, index) => (
                    <span key={index} style={tagStyles.tag}>{interest}</span>
                  ))}
                </div>
              )}
            </div>        
          </div>
        </div>
        <button onClick={onClose} style={styles.closeButton}>
          X
        </button>
      </div>
    </div>
  );
};

export default ProfileDetailsPopup;