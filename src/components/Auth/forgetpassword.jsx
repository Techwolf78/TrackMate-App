import React, { useState, useEffect } from "react";
import { auth, sendPasswordResetEmail } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const allowedEmails = [
  "ajaypawargryphon@gmail.com",
  "ummi@gryphonacademy.co.in",
  "ajay@gryphonacademy.co.in",
  "test@gmail.com",
  "nishad@gryphonacademy.co.in",
  "dheeraj@gryphonacademy.co.in",
  "shashikant@gryphonacademy.co.in",
];

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  const validateEmail = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setEmailError("Please enter your email address.");
      return false;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Invalid email format.");
      return false;
    }

    if (!allowedEmails.includes(trimmedEmail)) {
      setEmailError("This email is not registered.");
      return false;
    }

    setEmailError("");
    return true;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleGetOtp = async () => {
    if (!validateEmail()) {
      triggerShake();
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      toast.success("Password reset email sent. Please check your inbox!");
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again.");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleGetOtp();
  };

  const handleBackToLogin = () => {
    navigate("/adminlogin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 via-white to-gray-200 px-4">
      <div
        className={`w-full max-w-md bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8 transition-all duration-300 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Forget Password
        </h2>

        {!isEmailSent && (
          <div className="relative mb-6">
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              required
              className={`peer w-full px-4 pt-6 pb-2 border rounded-md bg-transparent text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Email Address
            </label>
            {emailError && (
              <p className="text-red-600 text-sm mt-1">{emailError}</p>
            )}
          </div>
        )}

        {!isEmailSent && (
          <button
            onClick={handleGetOtp}
            disabled={isLoading}
            className={`w-full py-3 rounded-md font-medium text-white flex justify-center items-center transition ${
              isLoading
                ? "bg-indigo-300 cursor-wait"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {isLoading ? "Sending email..." : "Send Reset Link"}
          </button>
        )}

        {isEmailSent && (
          <div className="mt-6 text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
              <p>
                Check your email for further instructions to reset your
                password.
              </p>
            </div>
            <button
              onClick={handleBackToLogin}
              className="w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
            >
              Go back to login
            </button>
          </div>
        )}
      </div>

      {/* Shake animation style */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
          }
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default ForgetPassword;
