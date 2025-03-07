import React, { useState, useEffect } from "react";
import { auth, signInWithEmailAndPassword } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom"; // For navigation

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading");
  const [emailError, setEmailError] = useState(""); // New state for email-specific error
  const navigate = useNavigate(); // Hook for navigation after successful login

  // Form validation
  const validateForm = () => {
    if (!email || !password) {
      setError("Please fill in both fields.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
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
    setEmailError(""); // Reset email-specific error message
  
    // Set the loading text animation for 2 seconds
    setTimeout(() => {
      setLoading(false);
      setLoadingText("Loading"); // Reset to default text after 2 seconds
    }, 2000); // Loader duration set to 2 seconds
  
    try {
      // Check if email is in the allowed list for specific routes
      if (
        email === "ajay@gryphonacademy.co.in" ||
        email === "nishad@gryphonacademy.co.in" ||
        email === "dheeraj@gryphonacademy.co.in"
      ) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Successfully signed in!");

        // Save the email in sessionStorage
        sessionStorage.setItem("userSale", email);
        
        // Navigate to the sales page for authorized users
        navigate("/sales");
      } else if (
        email === "ajaypawargryphon@gmail.com" ||
        email === "shashikant@gryphonacademy.co.in"
      ) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Successfully signed in!");

        // Save the email in sessionStorage
        sessionStorage.setItem("userPlac", email);
        
        // Navigate to the placement page for authorized users
        navigate("/placement");
      } else {
        setEmailError("Email is not registered for this platform. Contact Admin.");
        setLoading(false); // Stop loading when email is not found
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error); // Log the error
  
      if (error.code === "auth/wrong-password") {
        setError("Oops! The password you entered is incorrect.");
      } else if (error.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  // Handle the loading dots animation
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingText((prevText) => {
          if (prevText.length < 10) {
            return prevText + "."; // Adds a dot every 500ms
          }
          return "Loading"; // Resets after reaching "Loading..."
        });
      }, 500); // Updates every 500ms
    } else {
      setLoadingText("Loading");
      clearInterval(interval); // Clears the interval when loading is complete
    }

    return () => clearInterval(interval); // Cleanup on unmount or when loading stops
  }, [loading]);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 bg-gray-200 relative ">
      {/* Back Button */}
      <div className="absolute top-4 left-0 right-0 text-center">
        <button
          className="flex items-center px-4 sm:px-6 lg:px-8 justify-center text-blue-500 font-medium"
          onClick={() => navigate("/")}
        >
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7"></path>
          </svg>
          Back
        </button>
      </div>

      {/* Login Modal */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full sm:w-96 lg:w-1/3 z-10 relative overflow-hidden">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6 relative z-10">
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border-2 border-gray-300 rounded-full"
              required
            />
            {/* Show the email-specific error */}
            {emailError && (
              <p className="text-sm text-red-500 mt-2 text-center">{emailError}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border-2 border-gray-300 rounded-full"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-100 p-2 rounded-lg mb-4">
              {error}
            </p>
          )}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-full font-medium transition duration-200 ${
              loading ? "bg-blue-300" : "hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin border-t-blue-300"></div>
                <span className="ml-2 text-white">Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>

      {/* Loading Overlay with Animated Dots */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-20 min-h-screen">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-4 border-white border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-white text-xl">{loadingText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
