import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../../firebaseConfig";

const allowedEmails = [
  "ajaypawargryphon@gmail.com",
  "ummi@gryphonacademy.co.in",
  "ajay@gryphonacademy.co.in",
  "test@gmail.com",
  "nishad@gryphonacademy.co.in",
  "dheeraj@gryphonacademy.co.in",
  "shashikant@gryphonacademy.co.in",
];

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  const validateForm = () => {
    if (!email || !password || !selectedOption) {
      setError("Please fill in all fields and select a dashboard.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email format.");
      return false;
    }

    if (!allowedEmails.includes(email.trim().toLowerCase())) {
      setError("This email is not registered for admin access.");
      return false;
    }

    setError("");
    return true;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem(`admin_selectedOption_${email}`, selectedOption);
      localStorage.setItem(`admin_userEmail_${email}`, email);

      if (selectedOption === "bills") {
        navigate("/media");
      } else if (selectedOption === "placementDocs") {
        navigate("/docs");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("The password is incorrect. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account exists with this email.");
      } else {
        setError("Login failed. Please check credentials or try again later.");
      }
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit(e);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-gray-100 via-white to-gray-200 px-4 relative">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-teal-200 rounded-full opacity-40" />
      <div className="absolute bottom-2 right-10 w-48 h-48 bg-pink-200 rounded-full opacity-30" />
      <div className="absolute top-2 right-24 w-60 h-48 bg-yellow-100 opacity-20 rounded-lg" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-purple-100 rounded-full opacity-30" />

      {/* Login Form */}
      <div
        className={`bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-md transition-all duration-300 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              required
              className={`peer w-full px-4 pt-6 pb-2 border rounded-md bg-transparent text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                error && !email ? "border-red-500" : "border-gray-300"
              }`}
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-600"
            >
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              required
              className={`peer w-full px-4 pt-6 pb-2 border rounded-md bg-transparent text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                error && !password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-600"
            >
              Password
            </label>
          </div>

          {/* Select Option */}
          <select
            id="option"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className={`w-full px-4 py-3 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
              error && !selectedOption ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Dashboard</option>
            <option value="bills">Bills</option>
            <option value="placementDocs">Placement Docs</option>
          </select>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-medium text-white flex justify-center items-center transition ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? (
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
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/forgetpassword" className="text-sm text-indigo-500 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Shake Animation Style */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
