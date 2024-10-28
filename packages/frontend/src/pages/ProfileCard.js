import React, { useState } from 'react';
import { Heart, X, Star, MapPin, Verified, Coffee, Music, Camera, Briefcase, GraduationCap } from 'lucide-react';
import sobbingProfileImage from "../assets/images/sobbing.png"

const colors = {
  red: '#dc2626',
  green: '#16a34a',
  lightGreen: '#dcfce7',
  lightRed: '#fee2e2',
  gray: '#9ca3af',
  darkGray: '#4b5563',
  yellow: '#FFB800',
  background: '#f8f9fa',
  lightGray: '#eee',
  white: '#ffffff',
  orange: '#ffedd5',
  darkOrange: '#9a3412',
  blue: '#1d4ed8',
  cardBackground: '#f3f4f6',
};

const styles = {
  card: {
    width: '100%',
    maxWidth: '375px',
    margin: '0 auto',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    aspectRatio: '4/3',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: `${colors.white}e6`, // Adding transparency
    padding: '4px 8px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: colors.blue,
  },
  infoSection: {
    padding: '12px 16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  nameAgeGender: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  getScoreStyle: (score) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    backgroundColor: score >= 75 ? colors.lightGreen : score >= 25 ? colors.orange : colors.lightRed,
    color: score >= 75 ? colors.green : score >= 25 ? colors.darkOrange : colors.red,
  }),
  bio: {
    fontSize: '13px',
    color: colors.darkGray,
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  detailsContainer: {
    marginBottom: '12px',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '13px',
    color: colors.darkGray,
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  tag: {
    backgroundColor: colors.cardBackground,
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: colors.darkGray,
  },
  buttonContainer: {
    display: 'flex',
    borderTop: `1px solid ${colors.lightGray}`,
  },
  button: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    backgroundColor: colors.white,
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  },
  buttonText: {
    fontWeight: '500',
    fontSize: '13px',
  },
  likedButton: {
    backgroundColor: colors.lightGreen,
  },
  dislikedButton: {
    backgroundColor: colors.lightRed,
  }
};

const ProfileCard = ({ 
  name = "Sarah Johnson",
  age = 28,
  gender = "F",
  image = "/api/placeholder/375/281",
  bio = "Coffee enthusiast and weekend hiker. Looking for someone to share adventures and quiet moments with.",
  credibilityScore = 85,
  occupation = "Software Engineer",
  education = "Master's in Computer Science",
  location = "San Francisco",
  interests = ["Photography", "Hiking", "Jazz", "Cooking"],
  verified = true,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={sobbingProfileImage}
          alt="Profile"
          style={styles.image}
        />
        {verified && (
          <div style={styles.verifiedBadge}>
            <Verified size={14} />
            <span>Verified</span>
          </div>
        )}
      </div>

      <div style={styles.infoSection}>
        <div style={styles.header}>
          <h2 style={styles.nameAgeGender}>{name}, {age}{gender}</h2>
          <div style={styles.getScoreStyle(credibilityScore)}>
            <Star size={14} />
            <span>{credibilityScore}%</span>
          </div>
        </div>

        <p style={styles.bio}>{bio}</p>

        <div style={styles.detailsContainer}>
          <div style={styles.detailRow}>
            <Briefcase size={16} color={colors.darkGray} />
            <span>{occupation}</span>
          </div>
          <div style={styles.detailRow}>
            <GraduationCap size={16} color={colors.darkGray} />
            <span>{education}</span>
          </div>
          <div style={styles.detailRow}>
            <MapPin size={16} color={colors.darkGray} />
            <span>{location}</span>
          </div>
        </div>

        <div style={styles.tagsContainer}>
          {interests.map((interest, index) => (
            <span key={index} style={styles.tag}>{interest}</span>
          ))}
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={handleDislike}
          style={{
            ...styles.button,
            ...(isDisliked ? styles.dislikedButton : {}),
          }}
        >
          <X 
            size={18} 
            color={isDisliked ? colors.red : colors.gray}
          />
          <span style={{
            ...styles.buttonText,
            color: isDisliked ? colors.red : colors.darkGray
          }}>
            PASS
          </span>
        </button>

        <button
          onClick={handleLike}
          style={{
            ...styles.button,
            borderLeft: `1px solid ${colors.lightGray}`,
            ...(isLiked ? styles.likedButton : {}),
          }}
        >
          <Heart
            size={18}
            color={isLiked ? colors.green : colors.gray}
            fill={isLiked ? colors.green : 'none'}
          />
          <span style={{
            ...styles.buttonText,
            color: isLiked ? colors.green : colors.darkGray
          }}>
            LIKE
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;