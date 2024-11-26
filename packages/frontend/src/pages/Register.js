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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [pronouns, setPronouns] = useState('')
    const [orientation, setOrientation] = useState('');
    const [height, setHeight] = useState('');
    const [occupation, setOccupation] = useState('');
    const [birthday, setBirthday] = useState('');
    const [bio, setBio] = useState('');
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [verificationStep, setVerificationStep] = useState(0);

    // Add this to your state declarations
    const [isUploading, setIsUploading] = useState(false);

    const handleNext = () => {

        switch (step) {
            case 1:
                if (!email || !password || !confirmPassword) {
                    const step1Missing = [];
                    if (!email) step1Missing.push('Email');
                    if (!password) step1Missing.push('Password');
                    if (!confirmPassword) step1Missing.push('Confirm Password');

                    setAlertMessage(`Please fill out the following field(s):\n\n${step1Missing.join(', ')}`);
                    setShowAlert(true);
                    return;
                }

                // Check password strength
                if (!isStrongPassword(password)) {
                    setAlertMessage(
                        'Please use a stronger password that includes:\n' +
                        '• At least 8 characters\n' +
                        '• At least one uppercase letter\n' +
                        '• At least one lowercase letter\n' +
                        '• At least one number\n' +
                        '• At least one special character (@$!%*?&)'
                    );
                    setShowAlert(true);
                    return;
                }

                // password matching validation
                if (password !== confirmPassword) {
                    setAlertMessage("Passwords do not match");
                    setShowAlert(true);
                    return;
                }
                // Create account in db if fields are valid
                let apiInstance = new CredibleCupid.AuthApi();
                let registerRequest = new CredibleCupid.LoginRequest(email, password);

                InitDefaultCredibleCupidClient(null);
                apiInstance.authSignup(registerRequest, (error, data, response) => {
                    if (error) {
                        console.error(error);
                        let errorMessage;

                        if (error.response?.body?.message) {
                            errorMessage = error.response.body.message;
                        } else if (error.response?.body?.error) {
                            errorMessage = error.response.body.error;
                        } else {
                            errorMessage = error.message;
                        }
                        setAlertMessage(errorMessage);
                        setShowAlert(true);
                        return;
                    }
                    sessionStorage.setItem("jwtToken", data.jwt);
                    setStep(step + 1);
                });
                return;

            case 2:
                if (!firstName || !lastName || !gender || !orientation || !height || !occupation || !birthday) {
                    const step2Missing = [];
                    if (!firstName) step2Missing.push('First Name')
                    if (!lastName) step2Missing.push('Last Name')
                    if (!gender) step2Missing.push('Gender');
                    if (!orientation) step2Missing.push('Sexual Orientation');
                    if (!height) step2Missing.push('Height');
                    if (!occupation) step2Missing.push('Occupation');
                    if (!birthday) step2Missing.push('Birthday');

                    setAlertMessage(`Please fill out the following field(s):\n\n${step2Missing.join(', ')}`);
                    setShowAlert(true);
                    return;
                }
                break;
        }
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!photo || !bio) {
            const step3Missing = [];
            if (!photo) step3Missing.push('Profile Photo');
            if (!bio) step3Missing.push('Bio');

            setAlertMessage(`Please fill out the following field(s):\n\n${step3Missing.join(', ')}`);
            setShowAlert(true);
            return;
        }

        setIsLoading(true);
        setIsVerifying(true);

        const jwtToken = sessionStorage.getItem("jwtToken");
        if (!jwtToken) {
            console.error("JWT token missing. Unable to set up profile.");
            return;
        }

        // Set up API client instance and authenticate with JWT
        let defaultClient = CredibleCupid.ApiClient.instance;
        let bearer = defaultClient.authentications['bearer'];
        bearer.accessToken = jwtToken;

        // Convert date_of_birth to milliseconds since epoch
        const birthdayMs = new Date(birthday).getTime();
        const heightMM = height * 10;

        // Build UserUpdateBioRequest object
        const userUpdateBioRequest = {
            first_name: firstName,
            last_name: lastName,
            bio: bio,
            gender: gender,
            pronouns: pronouns,
            sexual_orientation: orientation,
            birthday_ms_since_epoch: birthdayMs,
            height_mm: heightMM,
            occupation: occupation,
        };
        let userApi = new CredibleCupid.UserApi();

        userApi.updateBio(userUpdateBioRequest, (error, data, response) => {
            if (error) {
                console.error("Failed to update profile:", error);
                let errorMessage;

                if (error.response?.body?.message) {
                    errorMessage = error.response.body.message;
                } else if (error.response?.body?.error) {
                    errorMessage = error.response.body.error;
                } else {
                    errorMessage = "Failed to update profile. Please try again.";
                }
                navigate('/error', { state: { errorMessage } });
            } else {
                console.log("Successfully set up bio: ", data);
                navigate('/success');
            }
        });
    };

    const handleFocus = (e) => {
        e.target.style.backgroundColor = colors.white;
        e.target.style.borderColor = colors.gray.border;
    };

    const handleBlur = (e) => {
        e.target.style.backgroundColor = colors.gray.lighter;
    };

    const isStrongPassword = (password) => {
        // At least 8 characters long
        // Contains at least one uppercase letter
        // Contains at least one lowercase letter
        // Contains at least one number
        // Contains at least one special character
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    };


    const Alert = ({ message, onClose }) => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: spacing.xl,
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px',
                width: '70%'
            }}>
                <div style={{
                    marginBottom: spacing.lg,
                    fontSize: '16px',
                    lineHeight: '1.5',
                    color: colors.gray.text,
                    whiteSpace: 'pre-line'
                }}>
                    {message}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        ...buttonStyles.base,
                        width: '100%',
                        marginTop: spacing.md
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    );

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);

            // Set preview immediately 
            setPhoto(file);
            setPreviewImage(URL.createObjectURL(file));

            let defaultClient = CredibleCupid.ApiClient.instance;
            let bearer = defaultClient.authentications['bearer'];
            const jwtToken = sessionStorage.getItem("jwtToken");
            if (!jwtToken) {
                console.error("JWT token missing. Unable to set up profile.");
                return;
            }

            bearer.accessToken = jwtToken

            let userApi = new CredibleCupid.UserApi();
            let opts = {
                'file': file
            };

            InitDefaultCredibleCupidClient(jwtToken)
            userApi.uploadProfilePic(opts, (error, data, response) => {
                setIsUploading(false);

                if (error) {
                    setAlertMessage('Failed to upload profile picture. Please try again.');
                    setShowAlert(true);
                } else {
                    console.log('Profile picture uploaded successfully');
                    if (data?.url) {
                        setPreviewImage(data.url);
                    }
                }
            });

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
                        marginBottom: spacing.md,
                        position: 'relative'
                    }}>
                        <img
                            src={previewImage}
                            alt="Profile preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: isUploading ? 0.5 : 1
                            }}
                        />
                        {isUploading && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}>
                                Loading...
                            </div>
                        )}
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
                    disabled={isUploading}
                />
                <label
                    htmlFor="profile-image-upload"
                    style={{
                        ...buttonStyles.base,
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        height: '30px',
                        opacity: isUploading ? 0.7 : 1
                    }}
                >
                    {isUploading ? 'Uploading...' : (previewImage ? 'Change Photo' : 'Upload Photo')}
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
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>First Name</label>
                            <input
                                style={inputStyles.input}
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Last Name</label>
                            <input
                                style={inputStyles.input}
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Pronouns</label>
                            <input
                                style={inputStyles.input}
                                type="text"
                                value={pronouns}
                                onChange={(e) => setPronouns(e.target.value)}
                                placeholder="Enter your pronouns"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Gender</label>
                            <select
                                style={{
                                    ...inputStyles.input,
                                    backgroundColor: colors.gray.lighter,
                                    height: '52px', // Increased height for dropdown menu
                                }}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-Binary">Non-binary</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Sexual Orientation</label>
                            <select
                                style={{
                                    ...inputStyles.input,
                                    height: '52px', // Increased height for dropdown menu
                                }}
                                value={orientation}
                                onChange={(e) => setOrientation(e.target.value)}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            >
                                <option value="">Select orientation</option>
                                <option value="Straight">Straight</option>
                                <option value="Gay">Gay</option>
                                <option value="Lesbian">Lesbian</option>
                                <option value="Bisexual">Bisexual</option>
                                <option value="Asexual">Asexual</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={inputStyles.container}>
                            <label style={{ ...inputStyles.label, marginTop: spacing.lg }}>Height (cm)</label>
                            <input
                                style={inputStyles.input}
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)} // convert to mm
                                required
                                placeholder="Enter your height (cm)"
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
                                onChange={(e) => { setBirthday(e.target.value) }}
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
                                placeholder="Tell us about yourself"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };


    const renderVerification = () => {
        return (
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
                    {gender.toLowerCase() === 'male' ? (
                        <>
                            Checking referrals and running AI verification...
                        </>
                    ) : (
                        <>
                            Running AI verification...
                        </>
                    )}
                </p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    };

    return (
        <div style={{
            ...cardStyles.container,
            height: '100vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={logoStyles.container}>
                <img src={logo} alt="Heart icon" style={logoStyles.image} />
            </div>

            {isVerifying ? (
                <div style={cardStyles.container}>
                    {renderVerification()}
                </div>
            ) : (
                <div style={contentContainerStyles.container}>
                    <div style={contentContainerStyles.header}>
                        <h1 style={titleStyles}>Create Your Account</h1>
                        <p style={subheadingStyles}>
                            {step === 1 && 'Step 1: Account Details'}
                            {step === 2 && 'Step 2: Personal Information'}
                            {step === 3 && 'Step 3: Profile Details'}
                        </p>
                    </div>

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

                            {/* Next button for step 1 and 2 */}
                            {step !== 3 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    style={{
                                        ...buttonStyles.base,
                                        flex: 1
                                    }}
                                >
                                    {step === 1 ? 'Proceed to Profile Setup' : 'Next'}
                                </button>
                            )}

                            {/* Submit button for step 3 */}
                            {step === 3 && (
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

                    {step === 1 && (
                        <p style={linkStyles.nonLink}>
                            Already have an account?{' '}
                            <Link to="/login" style={linkStyles.link}>Sign in here</Link>
                        </p>
                    )}
                </div>
            )}
            {showAlert && (
                <Alert
                    message={alertMessage}
                    onClose={() => setShowAlert(false)}
                />
            )}
        </div>
    );
}

export default Register;