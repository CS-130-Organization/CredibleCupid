import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as CredibleCupid from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import { colors, spacing } from '../styles/theme';
import { buttonStyles, linkStyles, formStyles, contentContainerStyles, titleStyles, inputStyles, cardStyles, subheadingStyles, logoStyles } from '../styles/commonStyles';
import logo from '../assets/images/logo.png';

function Register() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [orientation, setOrientation] = useState('');
    const [height, setHeight] = useState('');
    const [occupation, setOccupation] = useState('');
    const [birthday, setBirthday] = useState('');
    const [bio, setBio] = useState('');
    const [photo, setPhoto] = useState(null);
    const [referralEmails, setReferralEmails] = useState(['', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        setIsLoading(true);
        setIsVerifying(true);

        setTimeout(() => {
            InitDefaultCredibleCupidClient(null);
            let apiInstance = new CredibleCupid.AuthApi();
            let registerRequest = new CredibleCupid.LoginRequest(email, password);

            apiInstance.authLogin(registerRequest, (error, data, response) => {
                setIsLoading(false);
                if (error) {
                    console.error(error);
                    setIsVerifying(false);
                } else {
                    console.log("Successfully registered!");
                    setTimeout(() => navigate('/login'), 5000);
                }
            });
        }, 1000);
    };

    const handleFocus = (e) => {
        e.target.style.backgroundColor = colors.white;
        e.target.style.borderColor = colors.gray.border;
    };

    const handleBlur = (e) => {
        e.target.style.backgroundColor = colors.gray.lighter;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const ImageUpload = () => (
        <div style={inputStyles.container}>
            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Profile Picture</label>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.lg,
                border: `2px dashed ${colors.gray.border}`,
                borderRadius: '8px',
                backgroundColor: colors.gray.lighter,
                cursor: 'pointer'
            }}>
                {previewImage ? (
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        marginBottom: spacing.md
                    }}>
                        <img
                            src={previewImage}
                            alt="Profile preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                ) : (
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        backgroundColor: colors.gray.lighter,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: spacing.md
                    }}>
                        <span style={{ fontSize: '40px', color: colors.gray.text }}>+</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                />
                <label
                    htmlFor="profile-image-upload"
                    style={{
                        ...buttonStyles.base,
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}
                >
                    {previewImage ? 'Change Photo' : 'Upload Photo'}
                </label>
            </div>
        </div>
    );

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Email</label>
                            <input
                                style={inputStyles.input}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Password</label>
                            <input
                                style={inputStyles.input}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Create a password"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Confirm Password</label>
                            <input
                                style={inputStyles.input}
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Gender</label>
                            <select
                                style={{
                                    ...inputStyles.input,
                                    backgroundColor: colors.gray.lighter,
                                    height: '52px', // Increased height
                                }}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Sexual Orientation</label>
                            <select
                                style={{
                                    ...inputStyles.input,
                                    height: '52px', // Increased height
                                }}
                                value={orientation}
                                onChange={(e) => setOrientation(e.target.value)}
                                required
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            >
                                <option value="">Select orientation</option>
                                <option value="straight">Straight</option>
                                <option value="gay">Gay</option>
                                <option value="lesbian">Lesbian</option>
                                <option value="bisexual">Bisexual</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Height (cm)</label>
                            <input
                                style={inputStyles.input}
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                                placeholder="Enter your height"
                                min="100"
                                max="250"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Occupation</label>
                            <input
                                style={inputStyles.input}
                                type="text"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                required
                                placeholder="Enter your occupation"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Birthday</label>
                            <input
                                style={inputStyles.input}
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                required
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <ImageUpload />

                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Bio</label>
                            <textarea
                                style={{
                                    ...inputStyles.input,
                                    backgroundColor: colors.gray.lighter,
                                    minHeight: '150px',
                                    resize: 'vertical'
                                }}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                required
                                placeholder="Tell us about yourself"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div>
                        {[0, 1, 2].map((index) => (
                            <div key={index} style={inputStyles.container}>
                                <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Referral Email {index + 1}</label>
                                <input
                                    style={inputStyles.input}
                                    type="email"
                                    value={referralEmails[index]}
                                    onChange={(e) => {
                                        const newEmails = [...referralEmails];
                                        newEmails[index] = e.target.value;
                                        setReferralEmails(newEmails);
                                    }}
                                    required
                                    placeholder={`Enter referral email ${index + 1}`}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    const renderVerification = () => (
        <div style={{
            textAlign: 'center',
            padding: spacing.xl
        }}>
            <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto',
                border: `4px solid ${colors.gray.lighter}`,
                borderTopColor: colors.primary,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <h2 style={titleStyles}>Verifying Your Information</h2>
            <p style={subheadingStyles}>
                Please wait while we process your registration.
                You will be redirected to the login page shortly.
            </p>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );

    if (isVerifying) {
        return (
            <div style={cardStyles.container}>
                <div style={logoStyles.container}>
                    <img src={logo} alt="Heart icon" style={logoStyles.image} />
                </div>
                {renderVerification()}
            </div>
        );
    }

    return (
        <div style={{
            ...cardStyles.container,
            height: '100vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Logo Section */}
            <div style={logoStyles.container}>
                <img src={logo} alt="Heart icon" style={logoStyles.image} />
            </div>

            {/* Content Container */}
            <div style={contentContainerStyles.container}>
                {/* Header Section */}
                <div style={contentContainerStyles.header}>
                    <h1 style={titleStyles}>Create Your Account</h1>
                    <p style={subheadingStyles}>
                        {step === 1 && 'Step 1: Account Details'}
                        {step === 2 && 'Step 2: Personal Information'}
                        {step === 3 && 'Step 3: Profile Details'}
                        {step === 4 && gender === 'male' && 'Step 4: Referrals'}
                    </p>
                </div>

                {/* Form Section */}
                <form style={formStyles} onSubmit={handleSubmit}>
                    {renderStep()}

                    <div style={{ display: 'flex', gap: spacing.md, marginTop: spacing.md }}>
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                style={{
                                    ...buttonStyles.base,
                                    flex: 1,
                                    backgroundColor: colors.gray.lighter,
                                    color: colors.gray.text
                                }}
                            >
                                Back
                            </button>
                        )}
                        {((step < 3) || (gender === 'male' && step === 3)) ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                style={{
                                    ...buttonStyles.base,
                                    flex: 1
                                }}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                style={{
                                    ...buttonStyles.base,
                                    flex: 1
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        )}
                    </div>
                </form>

                {/* Login Link */}
                {step === 1 && (
                    <p style={linkStyles.nonLink}>
                        Already have an account?{' '}
                        <Link to="/login" style={linkStyles.link}>Sign in here</Link>
                    </p>
                )}
            </div>
        </div>
    );
}

export default Register;