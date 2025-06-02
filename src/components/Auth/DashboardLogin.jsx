import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../../firebaseConfig";
import { MdEmail, MdLock } from "react-icons/md";

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 2 * 60 * 1000; // 2 minutes

const DashboardLogin = () => {
  const [email, setEmail] = useState(localStorage.getItem("rememberedEmail") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem("rememberedEmail"));
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(localStorage.getItem("lastSelectedDashboard") || "");
  const [shake, setShake] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    if (!selectedOption) {
      setToast("Please select a dashboard.");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const lockoutEnd = localStorage.getItem("lockoutEnd");
    if (lockoutEnd && Date.now() < Number(lockoutEnd)) {
      setToast("Too many failed attempts. Try again later.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      localStorage.setItem("lastSelectedDashboard", selectedOption);
      sessionStorage.setItem(`dashboard_selectedOption_${email}`, selectedOption);
      localStorage.removeItem("failedAttempts");
      localStorage.removeItem("lockoutEnd");

      setToast("Login successful!");
      setTimeout(() => {
        if (selectedOption === "saledash") {
          navigate("/saledash");
        } else if (selectedOption === "placdash") {
          navigate("/placdash");
        } else if (selectedOption === "salesvisitdash") {
          navigate("/salesvisitdash");
        }
      }, 1000);
    } catch (error) {
      const attempts = Number(localStorage.getItem("failedAttempts") || 0) + 1;
      localStorage.setItem("failedAttempts", attempts);

      if (attempts >= MAX_ATTEMPTS) {
        localStorage.setItem("lockoutEnd", Date.now() + LOCKOUT_TIME);
        setToast("Too many failed attempts. Try again later.");
      } else {
        setToast("Login failed. Please check your credentials.");
      }

      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 via-white to-gray-200 px-4">
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out">
          {toast}
        </div>
      )}

      <div
        className={`w-full max-w-md bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8 transition-all duration-500 ${
          shake ? "animate-shake" : "animate-fade-in"
        }`}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <MdEmail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="email"
              id="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className={`peer w-full pl-10 pt-6 pb-2 border rounded-md bg-transparent text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />
            <label htmlFor="email" className="absolute left-10 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-600">
              Email Address
            </label>
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <MdLock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              inputMode="text"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={`peer w-full pl-10 pt-6 pb-2 border rounded-md bg-transparent text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
            />
            <label htmlFor="password" className="absolute left-10 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-600">
              Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-3 text-xs text-gray-500 hover:text-indigo-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
          </div>

          {/* Dashboard Options */}
          <select
            id="option"
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              localStorage.setItem("lastSelectedDashboard", e.target.value);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          >
            <option value="">Select Dashboard</option>
            <option value="saledash">Sales Spent Dashboard</option>
            <option value="placdash">Placement Spent Dashboard</option>
            <option value="salesvisitdash">Sales Visit Dashboard</option>
          </select>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-indigo-600"
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgetpassdash" className="text-sm text-indigo-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-medium text-white flex justify-center items-center transition ${
              loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Shake Animation */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
          }
          .animate-shake {
            animation: shake 0.4s ease;
          }
        `}
      </style>
    </div>
  );
};

export default DashboardLogin;
