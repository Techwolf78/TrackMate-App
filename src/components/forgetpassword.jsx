import React, { useState } from 'react';
import { auth, sendPasswordResetEmail } from "../firebaseConfig";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Corrected import for react-router-dom v6+

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false); // To track if the email was sent
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook to navigate in react-router-dom v6+

  // Handle Get OTP button click
  const handleGetOtp = async () => {
    if (email === '') {
      toast.error('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      // Firebase Authentication: Send password reset email (this is the password reset link)
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      toast.success('Password reset email sent. Please check your inbox!');
    } catch (error) {
      toast.error('Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle redirect to login page
  const handleBackToLogin = () => {
    navigate('/login'); // Use navigate() instead of history.push() in react-router v6+
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forget Password</h2>

        {/* Email Input */}
        {!isEmailSent && (
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {/* Get OTP Button */}
        {!isEmailSent && (
          <div className="flex justify-between items-center mt-6">
            <button
              className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md font-medium transition duration-200 hover:bg-blue-600 ${isLoading ? 'cursor-wait' : ''}`}
              onClick={handleGetOtp}
              disabled={isLoading}
            >
              {isLoading ? 'Sending email...' : 'Send Reset Link'}
            </button>
          </div>
        )}

        {/* Success Modal */}
        {isEmailSent && (
          <div className="mt-4 text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-md">
              <p>Check your email for further instructions to reset your password.</p>
            </div>
            <div className="mt-4">
              <button
                onClick={handleBackToLogin}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md font-medium transition duration-200 hover:bg-blue-600"
              >
                Go back to login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
