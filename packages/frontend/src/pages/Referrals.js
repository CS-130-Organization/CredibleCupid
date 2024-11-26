import React, { useState } from 'react';
import * as CredibleCupidApi from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import { colors, spacing } from '../styles/theme';
import { buttonStyles, formStyles, contentContainerStyles, titleStyles, inputStyles, cardStyles, subheadingStyles, logoStyles } from '../styles/commonStyles';
import logo from '../assets/images/logo.png';

function Referrals() {
  const [email, setEmail] = useState('');
  const [referralText, setReferralText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Add your referral API call here
    try {
      InitDefaultCredibleCupidClient(sessionStorage.getItem("jwtToken"));
      let apiInstance = new CredibleCupidApi.ReferralApi();
      // Assuming you have a createReferral endpoint
      apiInstance.createReferral({ email, message: referralText }, (error, data, response) => {
        if (error) {
          console.error(response);
          console.error(response.body.message);
          console.error(response.body.statusCode);
        } else {
          console.log("Referral sent successfully!");
          // Clear the form
          setEmail('');
          setReferralText('');
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error sending referral:', error);
      setIsLoading(false);
    }
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
        <div style={contentContainerStyles.header}>
          <h1 style={titleStyles}>Refer a Friend</h1>
          <p style={subheadingStyles}>
            Share Credible Cupid with someone special
          </p>
        </div>

        {/* Form Section */}
        <form
          style={formStyles}
          onSubmit={handleSubmit}
        >
          {/* Email Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>Friend's Email</label>
            <input
              style={inputStyles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter their email"
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.borderColor = colors.gray.border;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>

          {/* Referral Message Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>
              Personal Message
            </label>
            <textarea
              style={{
                ...inputStyles.input,
                minHeight: '100px',
                resize: 'vertical'
              }}
              value={referralText}
              onChange={(e) => setReferralText(e.target.value)}
              required
              placeholder="Write a personal message to your friend"
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.borderColor = colors.gray.border;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            style={{
              ...buttonStyles.base,
              marginTop: spacing.md
            }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Referral'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Referrals;