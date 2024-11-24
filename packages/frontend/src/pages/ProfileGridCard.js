import React, { useState } from 'react';
import { Star, Verified } from 'lucide-react';
import { colors } from '../styles/theme';
import { badgeStyles, scoreStyles } from '../styles/commonStyles';

const ProfileCard = ({
  name = 'Anonymous',
  age = '',
  gender = '',
  verified = false,
  imageUrl = null
}) => {
  const [imageError, setImageError] = useState(false);

  const updatedCardStyles = {
    container: {
      width: '100%', 
      maxWidth: '160px', 
      margin: '10px', 
      borderRadius: '8px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
      overflow: 'hidden',
      backgroundColor: colors.white,
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
    }
  };
  
  const updatedImageStyles = {
    section: {
      position: 'relative',
      width: '100%',
    },
    image: {
      width: '100%',
      height: '150px', 
      objectFit: 'cover',
    },
    placeholder: {
      width: '100%',
      height: '150px',
      backgroundColor: colors.gray.light,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.gray.dark,
      fontSize: '12px'
    }
  };
  
  const updatedContentStyles = {
    section: {
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center', 
      lineHeight: '.8', 
      overflow: 'hidden',
      textAlign: 'center',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2px',
    },
    title: {
      fontSize: '14px', 
      fontWeight: '600',
    },
  };
  

  return (
    <div style={updatedCardStyles.container}>
      <div>
        <div style={updatedImageStyles.section}>
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={`${name}'s profile`}
              style={updatedImageStyles.image}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={updatedImageStyles.placeholder}>
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

        <div style={updatedContentStyles.section}>
          <div style={updatedContentStyles.header}>
            <h2 style={updatedContentStyles.title}>
              {name}{age ? `, ${age}` : ''}{gender ? ` ${gender}` : ''}
            </h2>        
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
