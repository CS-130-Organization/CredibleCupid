import React, { useState } from 'react';
import { Heart, X, Star, MapPin, Verified, Briefcase, GraduationCap } from 'lucide-react';

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
  container: {
    width: '100%',
    height: '100vh',
    maxWidth: '390px',
    maxHeight: '844px',
    margin: '0 auto',
    backgroundColor: colors.background,
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    height: '45%', // Adjusted for iPhone 12 Pro aspect ratio
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
  tag: {
    backgroundColor: colors.cardBackground,
    padding: '8px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    color: colors.darkGray,
  },
  buttonContainer: {
    display: 'flex',
    borderTop: `1px solid ${colors.lightGray}`,
    padding: '8px',
    backgroundColor: colors.white,
  },
  button: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: colors.white,
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: '16px',
  },
  likedButton: {
    backgroundColor: colors.lightGreen,
  },
  dislikedButton: {
    backgroundColor: colors.lightRed,
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

const ProfileCard = ({ 
  onLike, 
  onPass,
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
  imageUrl = null
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
    onLike?.();
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
    onPass?.();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.imageContainer}>
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={`${name}'s profile`}
              style={styles.image}
              onError={handleImageError}
            />
          ) : (
            <div style={styles.placeholderImage}>
              No image available
            </div>
          )}
          {verified && (
            <div style={styles.verifiedBadge}>
              <Verified size={16} />
              <span>Verified</span>
            </div>
          )}
        </div>

        <div style={styles.infoSection}>
          <div style={styles.header}>
            <h2 style={styles.nameAgeGender}>
              {name}{age ? `, ${age}` : ''}{gender ? ` ${gender}` : ''}
            </h2>
            <div style={styles.getScoreStyle(credibilityScore)}>
              <Star size={16} />
              <span>{credibilityScore}%</span>
            </div>
          </div>

          <p style={styles.bio}>{bio}</p>

          <div style={styles.detailsContainer}>
            <div style={styles.detailRow}>
              <Briefcase size={20} color={colors.darkGray} />
              <span>{occupation}</span>
            </div>
            <div style={styles.detailRow}>
              <GraduationCap size={20} color={colors.darkGray} />
              <span>{education}</span>
            </div>
            <div style={styles.detailRow}>
              <MapPin size={20} color={colors.darkGray} />
              <span>{location}</span>
            </div>
          </div>

          {interests.length > 0 && (
            <div style={styles.tagsContainer}>
              {interests.map((interest, index) => (
                <span key={index} style={styles.tag}>{interest}</span>
              ))}
            </div>
          )}
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
              size={24} 
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
              marginLeft: '8px',
              ...(isLiked ? styles.likedButton : {}),
            }}
          >
            <Heart
              size={24}
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
    </div>
  );
};

export default ProfileCard;