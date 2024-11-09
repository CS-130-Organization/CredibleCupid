import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as CredibleCupid from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import { colors, spacing } from '../styles/theme';
import { buttonStyles, inputStyles, cardStyles } from '../styles/commonStyles';
import logo from '../assets/images/logo.png';

function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthday: '',
        gender: '',
        sexualOrientation: '',
        pronouns: '',
        height: '',
        occupation: '',
        bio: '',
        profileImage: null,
        referralEmails: ['', '', ''] // Array for 3 email addresses
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevState => ({
                ...prevState,
                profileImage: file
            }));
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        InitDefaultCredibleCupidClient(null);
        let apiInstance = new CredibleCupid.AuthApi();
        let registerRequest = new CredibleCupid.LoginRequest(
            formData.email,
            formData.password,
        );

        apiInstance.authSignup(registerRequest, (error, data, response) => {
            if (error) {
                console.error(response);
                console.error(response.body.message);
                console.error(response.body.statusCode);
            } else {
                console.log("Successfully registered!");
                navigate('/login');
            }
            setIsLoading(false);
        });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const maxSteps = formData.gender === 'male' ? 4 : 3;

    const ProgressBar = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: spacing.lg
        }}>
            {Array.from({ length: maxSteps }, (_, i) => (
                <div
                    key={i}
                    style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: step >= i + 1 ? colors.primary : colors.gray.lighter,
                        transition: 'background-color 0.3s ease'
                    }}
                />
            ))}
        </div>
    );

    const ImageUpload = () => (
        <div style={inputStyles.container}>
            <label style={inputStyles.label}>Profile Picture</label>
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
                        display: 'inline-block',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}
                >
                    {previewImage ? 'Change Photo' : 'Upload Photo'}
                </label>
            </div>
        </div>
    );

    // Step content components
    const StepOne = () => (
        <>
            <div style={inputStyles.container}>
                <label style={inputStyles.label}>Email</label>
                <input
                    style={inputStyles.input}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                />
            </div>

            <div style={inputStyles.container}>
                <label style={inputStyles.label}>Password</label>
                <input
                    style={inputStyles.input}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                />
            </div>
        </>
    );

    const StepTwo = () => (
        <>
            <div style={inputStyles.container}>
                <label style={inputStyles.label}>First Name</label>
                <input
                    style={inputStyles.input}
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                />
            </div>

            <div style={inputStyles.container}>
                <label style={inputStyles.label}>Last Name</label>
                <input
                    style={inputStyles.input}
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                />
            </div>

            <div style={inputStyles.container}>
                <label style={inputStyles.label}>Gender</label>
                <select
                    style={{
                        ...inputStyles.input,
                        backgroundColor: colors.gray.lighter,
                        height: '40px',
                        padding: '8px 12px'
                    }}
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div style={inputStyles.container}>
                <label style={inputStyles.label}>Sexual Orientation</label>
                <select
                    style={{
                        ...inputStyles.input,
                        backgroundColor: colors.gray.lighter,
                        height: '40px',
                        padding: '8px 12px'
                    }}
                    name="sexualOrientation"
                    value={formData.sexualOrientation}
                    onChange={handleChange}
                    required
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                >
                    <option value="">Select orientation</option>
                    <option value="straight">Straight</option>
                    <option value="gay">Gay</option>
                    <option value="lesbian">Lesbian</option>
                    <option value="bisexual">Bisexual</option>
                    <option value="asexual">Asexual</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div style={inputStyles.container}>
                <label style={inputStyles.label}>Pronouns</label>
                <input
                    style={inputStyles.input}
                    type="text"
                    name="pronouns"
                    value={formData.pronouns}
                    onChange={handleChange}
                    required
                    min="100"
                    max="250"
                    placeholder="Enter your pronouns"
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                />
            </div>

            <div style={inputStyles.container}>
                <label style={inputStyles.label}>Height (cm)</label>
                <input
                    style={inputStyles.input}
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    min="100"
                    max="250"
                    placeholder="Enter your height in cm"
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                />
            </div>

            <div style={inputStyles.container}>
                <label style={inputStyles.label}>Occupation</label>
                <input
                    style={inputStyles.input}
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                    placeholder="Enter your occupation"
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                />
            </div>
        </>
    );

    const StepThree = () => (
        <>
            <ImageUpload />

            <div style={inputStyles.container}>
                <label style={inputStyles.label}>Bio</label>
                <textarea
                    style={{
                        ...inputStyles.input,
                        backgroundColor: colors.gray.lighter,
                        minHeight: '150px',
                        padding: '8px 12px',
                        resize: 'vertical'
                    }}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about yourself"
                    onFocus={(e) => {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.borderColor = colors.gray.border;
                    }}
                    onBlur={(e) => {
                        e.target.style.backgroundColor = colors.gray.lighter;
                    }}
                />
            </div>
        </>
    );

    const StepReferrals = () => (
        <>
            <div style={{
                marginBottom: spacing.md,
                textAlign: 'center',
                color: colors.gray.text
            }}>
                Please provide 3 email addresses for referrals
            </div>
            {[0, 1, 2].map((index) => (
                <div key={index} style={inputStyles.container}>
                    <label style={inputStyles.label}>Referral Email {index + 1}</label>
                    <input
                        style={{
                            ...inputStyles.input,
                            backgroundColor: colors.gray.lighter,
                            height: '40px',
                            padding: '8px 12px'
                        }}
                        type="email"
                        value={formData.referralEmails[index]}
                        onChange={(e) => {
                            const newEmails = [...formData.referralEmails];
                            newEmails[index] = e.target.value;
                            setFormData(prev => ({
                                ...prev,
                                referralEmails: newEmails
                            }));
                        }}
                        required
                        placeholder="Enter referral email"
                        onFocus={(e) => {
                            e.target.style.backgroundColor = colors.white;
                            e.target.style.borderColor = colors.gray.border;
                        }}
                        onBlur={(e) => {
                            e.target.style.backgroundColor = colors.gray.lighter;
                        }}
                    />
                </div>
            ))}
        </>
    );

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
            <div style={{
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '60px',
                flexShrink: 0
            }}>
                <img
                    src={logo}
                    alt="Heart icon"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        opacity: 0.9
                    }}
                />
            </div>

            {/* Content Container */}
            <div style={{
                width: '100%',
                padding: `0 ${spacing.xl} ${spacing.xl} ${spacing.xl}`,
                maxWidth: '350px',
                marginTop: spacing.xl,
                flexGrow: 1,
                overflow: 'auto'
            }}>
                {/* Header Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: spacing.xl
                }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '600',
                        color: colors.gray.text,
                        margin: `0 0 ${spacing.xs} 0`
                    }}>
                        Create Account
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: colors.gray.text,
                        opacity: 0.7,
                        margin: 0
                    }}>
                        {step === 1 && 'Step 1: Account Details'}
                        {step === 2 && 'Step 2: Personal Information'}
                        {step === 3 && 'Step 3: About You'}
                        {step === 4 && 'Step 4: Referrals'}
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: spacing.lg
                }}>
                    {Array.from({ length: formData.gender === 'male' ? 4 : 3 }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: step >= i + 1 ? colors.primary : colors.gray.lighter,
                                transition: 'background-color 0.3s ease'
                            }}
                        />
                    ))}
                </div>

                {/* Form Section */}
                <form
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.lg
                    }}
                    onSubmit={
                        (formData.gender === 'male' ? step === 4 : step === 3)
                            ? handleSubmit
                            : (e) => e.preventDefault()
                    }
                >
                    {step === 1 && <StepOne />}
                    {step === 2 && <StepTwo />}
                    {step === 3 && <StepThree />}
                    {step === 4 && formData.gender === 'male' && <StepReferrals />}

                    {/* Navigation Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: spacing.md,
                        marginTop: spacing.md
                    }}>
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
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
                        {(step < 3 || (formData.gender === 'male' && step === 3)) ? (
                            <button
                                type="button"
                                onClick={nextStep}
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
                <p style={{
                    textAlign: 'center',
                    marginTop: spacing.lg,
                    fontSize: '14px',
                    color: colors.gray.text
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{
                        color: colors.primary,
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;