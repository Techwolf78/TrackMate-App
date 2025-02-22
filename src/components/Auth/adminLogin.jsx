import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../../firebaseConfig";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !selectedOption) {
      setError("Please fill in both fields and select an option.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zAZ0-9]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);

      // Store the selected option and email in sessionStorage or localStorage
      sessionStorage.setItem("selectedOption", selectedOption);
      localStorage.setItem("userEmail", email);  // Store the email in localStorage

      // Navigate based on the selected option
      if (selectedOption === "bills") {
        navigate("/media"); // Navigate to /media for Bills
      } else if (selectedOption === "placementDocs") {
        navigate("/docs"); // Navigate to /docs for Placement Docs
      }
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-100 to-indigo-300 relative px-4 sm:px-6 lg:px-8">
      {/* Background shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-teal-200 rounded-full opacity-40 sm:w-40 sm:h-40 lg:w-48 lg:h-48"></div>
      <div className="absolute bottom-2 right-10 w-48 h-48 bg-pink-200 rounded-full opacity-30 sm:w-56 sm:h-56 lg:w-64 lg:h-64"></div>
      <div className="absolute top-2 right-24 w-60 h-48 bg-yellow-100 opacity-20 rounded-lg sm:w-72 sm:h-56 lg:w-80 lg:h-64"></div>
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-purple-100 rounded-full opacity-30 sm:w-64 sm:h-64 lg:w-72 lg:h-72"></div>

      {/* Admin Login Modal */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full sm:w-96 lg:w-1/3 z-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-indigo-200 via-transparent to-transparent opacity-50 z-[-1]"></div>

        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6 relative z-10">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow duration-300 shadow-sm hover:shadow-md"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-500">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow duration-300 shadow-sm hover:shadow-md"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="option" className="block text-sm font-medium text-gray-500">
              Select Option
            </label>
            <select
              id="option"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow duration-300 shadow-sm hover:shadow-md"
            >
              <option value="">Select an option</option>
              <option value="bills">Bills</option>
              <option value="placementDocs">Placement Docs</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className={`w-full py-3 px-6 bg-indigo-500 text-white rounded-lg font-medium transition duration-200 ${
              loading ? "bg-indigo-300" : "hover:bg-indigo-600"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/forgetpassword" className="text-sm text-indigo-500 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
