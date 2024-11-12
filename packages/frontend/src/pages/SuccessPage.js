import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing } from '../styles/theme';
import { contentContainerStyles, buttonStyles, titleStyles, subheadingStyles, cardStyles, logoStyles } from '../styles/commonStyles';
import logo from '../assets/images/logo.png';

const SuccessPage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div style={cardStyles.container}>
            {/* Logo Section */}
            <div style={logoStyles.container}>
                <img
                    src={logo}
                    alt="Heart icon"
                    style={logoStyles.image}
                />
            </div>

            {/* Content Container */}
            <div style={contentContainerStyles.container}>
                {/* Header Section */}
                <div style={{
                    ...contentContainerStyles.header,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <h1 style={{
                        ...titleStyles,
                        marginBottom: spacing.xl
                    }}> 
                        Account Created Successfully 
                    </h1>
                    <p style={{
                        ...subheadingStyles,
                        textAlign: 'center',
                        maxWidth: '300px'
                    }}>
                        Your account has been verified and created. You can now log in and start using the app.
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <button
                        onClick={handleLogin}
                        style={{
                            ...buttonStyles.base,
                            width: '200px',
                            marginTop: spacing.xl
                        }}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SuccessPage;