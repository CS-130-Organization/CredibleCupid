// src/components/ProfileCard/ProfileCard.js
import React, { useState, useEffect } from 'react';
import { Heart, X, UserRound, Star, Briefcase, Tag, Users, Ruler, Mail} from 'lucide-react';
import { colors, spacing } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import {
  cardStyles,
  imageStyles,
  badgeStyles,
  contentStyles,
  tagStyles,
  textStyles,
  detailStyles,
  scoreStyles,
  buttonStyles,
} from '../styles/commonStyles';

const ProfileDetailsPopup = ({
  name = 'Anonymous',
  age = '',
  gender = '',
  credibilityScore = 0,
  bio = 'No bio available',
  occupation = 'Not specified',
  orientation = 'Not specified',
  pronouns = 'Not specified',
  height = 'Not specified',
  email = 'Not provided',
  imageUrl = null,
  referrals = [],
  guid,
  onClose = () => { },
}) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

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
    referralSection: {
      marginTop: spacing.lg,
      borderTop: `1px solid ${colors.gray.lighter}`,
      paddingTop: spacing.md,
    },
    referralHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      color: colors.gray.dark,
      marginBottom: spacing.md,
      fontSize: '16px',
      fontWeight: '500',
    },
    referralList: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
    },
    referralItem: {
      padding: spacing.sm,
      backgroundColor: colors.gray.lighter,
      borderRadius: '4px',
      fontSize: '14px',
      color: colors.gray.text,
    }
  };

  const handleViewProfile = () => {
    navigate(`/userprofile/${guid}`);
    onClose();
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
                  <Tag size={20} color={colors.gray.dark} />
                  <span>{pronouns}</span>
                </div>
                <div style={detailStyles.row}>
                  <Users size={20} color={colors.gray.dark} />
                  <span>{orientation}</span>
                </div>
                <div style={detailStyles.row}>
                  <Ruler size={20} color={colors.gray.dark} />
                  <span>{height}</span>
                </div>
                <div style={detailStyles.row}>
                  <Briefcase size={20} color={colors.gray.dark} />
                  <span>{occupation}</span>
                </div>
                <div style={detailStyles.row}>
                  <Mail size={20} color={colors.gray.dark} />
                  <span>{email}</span>
                </div>
                {gender === 'M' && referrals?.length > 0 && (
                  <div style={styles.referralSection}>
                    <div style={styles.referralHeader}>
                      <UserRound size={20} />
                      <span>References ({referrals.length})</span>
                    </div>
                    <div style={styles.referralList}>
                      {referrals.map((referral, index) => (
                        <div key={index} style={styles.referralItem}>
                          {referral}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={handleViewProfile}
                style={{
                  ...buttonStyles.base,
                  width: '100%',
                  marginTop: spacing.md
                }}
              >
                View Full Profile
              </button>
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