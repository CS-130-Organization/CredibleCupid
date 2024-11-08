// src/components/ProfileCard/ProfileCard.js
import React, { useState } from 'react';
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

  // Only styles specific to this implementation
  const styles = {
    actions: {
      display: 'flex',
      borderTop: `1px solid ${colors.gray.lighter}`,
      padding: spacing.sm,
      backgroundColor: colors.white
    },
    actionButton: (isActive, isLike) => ({
      flex: 1,
      padding: spacing.md,
      marginLeft: isLike ? spacing.sm : 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      border: 'none',
      borderRadius: spacing.md,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: isActive ? (isLike ? '#dcfce7' : '#fee2e2') : colors.white
    }),
    buttonText: (isActive, isLike) => ({
      fontWeight: '600',
      fontSize: '16px',
      color: isActive ? (isLike ? colors.green.dark : colors.red.dark) : colors.gray.dark
    })
  };

  return (
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

        <div style={styles.actions}>
          <button
            onClick={handleDislike}
            style={styles.actionButton(isDisliked, false)}
          >
            <X 
              size={24} 
              color={isDisliked ? colors.red.dark : colors.gray.placeholder}
            />
            <span style={styles.buttonText(isDisliked, false)}>
              PASS
            </span>
          </button>

          <button
            onClick={handleLike}
            style={styles.actionButton(isLiked, true)}
          >
            <Heart
              size={24}
              color={isLiked ? colors.green.dark : colors.gray.placeholder}
              fill={isLiked ? colors.green.dark : 'none'}
            />
            <span style={styles.buttonText(isLiked, true)}>
              LIKE
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;